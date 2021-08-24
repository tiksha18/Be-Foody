const stripe = require("stripe");
const bookingModel = require("../Model/bookingModel");
const planModel = require("../Model/plansModel");
const userModel = require("../Model/usersModel");
const stripeObj = stripe('sk_test_51JOSOmSAKlgVI5t21qCo2DOCTLuKrtFtSPE7D53Lwpy022I36bCwcAegGntPnF3mC4RyFo0mqmtaX3zjHKW4sfSk00iO9ErLFo');


async function createPaymentSession(req, res)
{
    try
    {
        const userId = req.id;
        let {planId} = req.body;
        const plan = await planModel.findById(planId);
        const user = await userModel.findById(userId);

        //session object that initiates the payment
        const session = await stripeObj.checkout.sessions.create({
            payment_method_types: ['card'],
            // customer : user.name,
            customer_email : user.email,
            client_reference_id : planId,
            line_items: [
            {
                price_data: {
                currency: 'usd',
                product_data: { 
                    name: plan.name,
                },
                unit_amount: plan.price*100,
                },
                quantity: 1,
            },
            ],
            mode: 'payment',
            success_url: 'https://hey-foody.herokuapp.com/',
            cancel_url: 'https://hey-foody.herokuapp.com/',
        })
        res.json({
            session
        })
    }
    catch(error)
    {
        res.json({
            "message" : "Failed to Create Payment Session",
            error
        })
    }
}

async function checkoutComplete(req, res)
{
    try
    {
        const END_POINT_KEY = process.env.END_POINT_KEY;
        const stripeSignature = req.headers['stripe-signature'];
        // if(req.body.data.type == "checkout.session.completed")
        // {
            const userEmail = req.body.data.object.customer_email;
            const planId = req.body.data.object.client_reference_id;
            await createNewBooking(userEmail, planId);
        // }
    }
    catch(error)
    {
        res.json({
            error
        })
    }
}


async function createNewBooking(userEmail, planId)
{
    try
    {
        const user = await userModel.findOne({email : userEmail});
        const plan = await planModel.findById(planId);
        const userId = user["_id"];
        if(user.bookedPlanId == undefined)
        {
            const bookingOrder = {
                userId : userId,
                bookedPlans : [ { planId : planId, name : plan.name, currentPrice : plan.price} ]
            }
            const newBookingOrder = await bookingModel.create(bookingOrder);
            user.bookedPlanId = newBookingOrder["_id"];
            await user.save({validateBeforeSave : false});
        }
        else
        {
            const newBookedPlan = {
                planId : planId, 
                name : plan.name, 
                currentPrice : plan.price
            }
            const userBookingObject = await bookingModel.findById(user.bookedPlanId);
            userBookingObject.bookedPlans.push(newBookedPlan);
            await userBookingObject.save();
        }
    }
    catch(error)
    {
        return error;
    }
}

module.exports.createPaymentSession = createPaymentSession;
module.exports.createNewBooking = createNewBooking;
module.exports.checkoutComplete = checkoutComplete;