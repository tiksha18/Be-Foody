// npm init -y
// npm i express nodemon
// npm install uuid
// npm install jsonwebtoken
// npm i pug

const express = require("express");
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

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.set("view engine", "pug");  // tell ki hum pug as a view engine use karenge
app.set("views", path.join(__dirname,"View"));   // path do jaha pe views rakhe hue h

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

