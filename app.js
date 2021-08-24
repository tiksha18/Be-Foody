// npm init -y
// npm i express nodemon
// npm install uuid
// npm install jsonwebtoken
// npm i pug

const express = require("express");
const stripe = require("stripe");
// let fs = require("fs");
// const {v4 : uuidv4} = require("uuid");
// const plans = require("./db/plans.json");
// const usersDB = require("./db/users.json");
const planRouter = require("./Router/planRouter");
const userRouter = require("./Router/userRouter");
const viewRouter = require("./Router/viewRouter");
const cookieParser = require("cookie-parser");
const path = require("path");
const bookingRouter = require("./Router/bookingRouter");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const stripeObj = stripe('sk_test_51JOSOmSAKlgVI5t21qCo2DOCTLuKrtFtSPE7D53Lwpy022I36bCwcAegGntPnF3mC4RyFo0mqmtaX3zjHKW4sfSk00iO9ErLFo');


app.use(express.static("public"));

app.set("view engine", "pug");  // tell ki hum pug as a view engine use karenge
app.set("views", path.join(__dirname,"View"));   // path do jaha pe views rakhe hue h


app.post("/api/booking/checkoutComplete", bodyParser.raw({type : 'application/json'}) ,function (req, res)
{
    const END_POINT_KEY = process.env.END_POINT_KEY;
    // console.log("checkout complete ran");
    // console.log(req);
    const stripeSignature = req.headers['stripe-signature'];
    let event;
    try
    {
        event = stripeObj.webhooks.constructEvent(req.body, stripeSignature, END_POINT_KEY);
    }
    catch(error)
    {
        res.status(400).send(`Webhook Error : ${error.message}`);
    }
    console.log("event object : ");
    console.log(event);
}
)


app.use("/api/booking", bookingRouter);

app.use("/api/plans", planRouter);
app.use("/api/users", userRouter);
app.use("", viewRouter);


let port = process.env.PORT || 3000; 

app.listen(port, () =>
{
    console.log("Server started at port 3000");
})


// ######################## Users #########################

// get all users

//app.get("/api/users", getAllUsers);

// create a user

// app.post("/api/users", createUsers);

//get a user by id

// app.get("/api/users/:id", getUserById);

//update a user

// app.patch("/api/users/:id", updateUser);

//delete a User by id

// app.delete("/api/users/:id" , deleteUser);



// ######################## Plans #########################

// get all plans

//app.get("/api/plans", getAllPlans);

// create a plan

//app.post("/api/plans", createPlans);

//get a plan by id

//app.get("/api/plans/:id", getPlanById);   

//update a plan

//app.patch("/api/plans/:id", updatePlan);

//delete a plan by id

//app.delete("/api/plans/:id" , deletePlan);

