const mongoose = require("mongoose");
// const { DB_LINK } = require("../config/secrets");

// heroku k liye
const DB_LINK = process.env.DB_LINK;


mongoose.connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => {
    console.log("connected to db");
})

// bookedPlan schema
const bookedPlanSchema = new mongoose.Schema({
    planId : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    currentPrice : {
        type : Number,
        required : true
    },
    bookedOn : {
        type : String,
        default : Date.now()
    }
})


// booking schema
const bookingSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    bookedPlans : {
        type : [bookedPlanSchema],
        required : true
    }
})


const bookingModel = mongoose.model("bookingcollection", bookingSchema);

module.exports = bookingModel;