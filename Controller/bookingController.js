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
    const END_POINT_KEY = process.env.END_POINT_KEY;
    // console.log("checkout complete ran");
    // console.log(req);
    const stripeSignature = req.headers['stripe-signature'];
    let event;
    try
    {
        event = stripe.webhooks.constructEvent(req.body, stripeSignature, END_POINT_KEY);
    }
    catch(error)
    {
        res.status(400).send(`Webhook Error : ${error.message}`);
    }
    console.log("event object : ");
    console.log(event);
}


async function createNewBooking(req, res)
{
    
}

module.exports.createPaymentSession = createPaymentSession;
module.exports.createNewBooking = createNewBooking;
module.exports.checkoutComplete = checkoutComplete;