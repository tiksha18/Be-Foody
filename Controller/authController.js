const userModel = require("../Model/usersModel");
const jwt = require("jsonwebtoken");
// const { SECRET_KEY, GMAIL_ID, GMAIL_PW } = require("../config/secrets");
const nodemailer = require("nodemailer");
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


// heroku pe deploy karne se pehle ye key value pairs hamare credentials k waha daal denge aur yaha code me ese define karte hain
const SECRET_KEY = process.env.SECRET_KEY;
const GMAIL_ID = process.env.GMAIL_ID;
const GMAIL_PW = process.env.GMAIL_PW;


async function sendEmail(message)
{
    try
    {
        // createTransport ek object leta h mailtrap(website) se jo info deta h ki kaha aur kaise mail phounchana hai=> to abhi humne mailtrap ka user id aur password dala h to udhar jakar trap hojayega mail taki hum testing kar sake ki actual me mail jo hum bhej rae h wo kaisa dikhta h
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
              user: GMAIL_ID,
              pass: GMAIL_PW
            }
        });

        // send mail with defined transport object
        let res = await transporter.sendMail({
            from: message.from, // sender address
            to: message.to, // list of receivers
            subject: message.subject, // Subject line
            text: message.text, // plain text body
        });
        return res;
    }
    catch(error)
    {
        return error;
    }
}

// sendEmail().then(function(){
//     console.log("Email Sent !");
// }).catch(function(error){
//     console.log("Failed to send Email !");
// });



async function signup(req, res) {

    try 
    {
        let user = req.body;
        // it will create a new document in the collection in db
        let newUser = await userModel.create({
            name : user.name,
            email : user.email,
            password : user.password,
            confirmPassword : user.confirmPassword,
            role : user.role
        })
        res.status(201).json({
            "message" : "Successfully Signed Up",
            "data" : newUser
        })
    }
    catch(error)
    {
        res.status(501).json({
            "message" : "Failed to Sign Up",
            error : error
        })
    }
}

async function login(req, res) {
    try
    {
        let {email, password} = req.body;
        let loggedInUser = await userModel.find({ email : email });
        if(loggedInUser.length)
        {
            let user = loggedInUser[0];
            if(user.password == password)
            {
                // yaha JWT Token banega
                const token = jwt.sign( { id : user["_id"]} , SECRET_KEY );  // yaha me token me payload me wo id jayegi user ko jo mongodb khud se banadeta h and secret key humne config folder me di h
                // make a cookie taki user agar uss duration k beech me wapas aata h same site pe to wo login show ho
                res.cookie('jwt', token, {httpOnly: true});                
                res.status(200).json({
                    "mesaage" : "Logged in Successfully",
                    "data" : loggedInUser[0]
                })
            }
            else
            {
                res.status(200).json({
                    "message" : "Email id and Password didn't match"
                })
                // res.resetPasswordHandler("login.pug", {message : "Email id and Password didn't match"});
            }
        }
        else
        {
            res.status(200).json({
                "message" : "No User Found ! SignUp First !"
            })
            // res.resetPasswordHandler("login.pug", {message : "No User Found ! Sign Up First !"});
        }
    }
    catch(error)
    {
        res.status(501).json({
            "message" : "Failed to Log in",
            "error" : error
        })
        // res.resetPasswordHandler("login.pug", {message : error});
    }
}

// middleware func means intended route pe jane se pehle iss function pe aaoge
async function protectRoute(req, res, next)
{
    // Token ko humne postman me Authorization column me Bearer Token choose karke fir right side me Token me token dala h
    try 
    {
        // here we will check ki user pehle se login h ya nahi .. agar pehle se logg in hoga to cookie me uska data pada hoga db se laya hua aur log in nahi hoga to payload me null hoga to wo else part ko chalayega
        //const token = req.headers.authorization.split(" ").pop();
        const token = req.cookies.jwt;     //abb cookie me se token nikalenge
        const payload = jwt.verify(token, SECRET_KEY);
        if(payload)
        {
            req.id = payload.id;   // id is stuffed into req.id (payload consists user ki id)
            next();  // ye kyuki ek middleware func h to next call karne se wo abb getallplans wale func ko chala dega
        }
        else
        {
            res.status(501).json({
                "message" : "Log In First !"
            })
        }
    }
    catch(error)
    {
        res.status(501).json({
            "message" : "Log In First",
            error
        })
    }
}

// another middleware to check whether the person logged in is authorized to do that task
async function isAuthorized(req, res, next) {
    try
    {
        let id = req.id;
        let user = await userModel.findById(id);
        if(user.role == "admin")
        {
            next();
        } 
        else
        {
            res.status(200).json({
                "message" : "You don't have admin rights",
            })
        }
    }
    catch(error)
    {
        res.status(501).json({
            "message" : "Failed to authorize",
            error
        })
    }
}

async function forgetPassword(req, res)
{
    try
    {
        let {email} = req.body;
        let user = await userModel.findOne({email : email});
        if(user)
        {
            let token = user.createPwToken();   // created a key in its model for new token
            //console.log(token);
            await user.save({validateBeforeSave : false});
            let resetLink = `http://localhost:3000/resetpassword/${token}`;
            let message = {
                from : "varshney.tiksha18@gmail.com",
                to : email,
                subject : "Reset Password",
                text : resetLink
            }
            let response = await sendEmail(message);
            res.status(200).json({
                "message" : "Reset Password link has been sent to your email",
                response
            })
        }
        else
        {
            res.status(200).json({
                "message" : "User not found .. Sign Up First !"
            })
        }
    }
    catch(error)
    {
        res.status(200).json({
            "message" : "Request Failed",
            error
        })
    }
}

async function resetPassword(req, res)
{
    try
    {
        const token = req.params.token;
        const {password, confirmPassword} = req.body;
        const user = await userModel.findOne({
            pwToken : token,
            tokenTime : { $gt : Date.now() }   // $gt => here gt is greater than ,, similarly $lt bhi hota h => where lt is lower than
        })
        // console.log(user);
        if(user)
        {
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();
            res.status(200).json({
                "message" : "Password Reset Successful !",
            })
        }
        else
        {
            res.status(200).json({
                "message" : "Password Reset Link expired.. Try Again !"
            })
        }
    }
    catch(error)
    {
        res.status(404).json({
            "message" : "Failed to reset password",
            error
        })
    }
}

async function isLoggedIn(req, res, next)
{
    try
    {
        let token = req.cookies.jwt;     //abb cookie me se token nikalenge
        const payload = jwt.verify(token, SECRET_KEY);
        if(payload)
        {
            let user = await userModel.findById(payload.id);
            req.name = user.name;
            req.user = user;
            next();  // ye kyuki ek middleware func h to next call karne se wo abb getallplans wale func ko chala dega
        }
        else
        {
            next();
        }
    }
    catch(error)
    {
       next()
    }
}

async function logout(req, res)
{
    try
    {
        res.clearCookie("jwt");
        res.redirect("/");
    }
    catch(error)
    {
        res.status(501).json({
            error
        })
    }
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.protectRoute = protectRoute;
module.exports.isAuthorized = isAuthorized;
module.exports.forgetPassword = forgetPassword;
module.exports.resetPassword = resetPassword;
module.exports.isLoggedIn = isLoggedIn;
module.exports.logout = logout;