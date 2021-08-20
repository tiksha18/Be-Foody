// [
//     {
//         "id": 2,
//         "plan": "non vegan",
//         "food": "Rice with mutton"
//     },
//     {
//         "id": 4,
//         "plan": "vegan",
//         "food": "Salad"
//     },
//     {
//         "id": "2c0c85a6-21e1-44b9-a1ce-c1eae3eb1344",
//         "plan": "Non Veg",
//         "food": "Chicken"
//     },
//     {
//         "plan": "Veg",
//         "food": "Bhelpuri",
//         "id": "08c8f922-ec98-4610-a8ac-63bbb948ab0a"
//     }
// ]

// npm i mongoose

const mongoose = require("mongoose");
// const { DB_LINK } = require("../config/secrets");


// heroku k liye
const DB_LINK = process.env.DB_LINK;


mongoose.connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => {
    console.log("connected to db");
})

let planSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxlength : [40, "You Plan name must be less than 40 characters"]
    },
    duration : {
        type: Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    ratings : Number,
    discount : {
        type : Number,
        validate : {
            validator : function() {
                return this.discount < this.price;
            },
            message : "Discount should be less than actual price"
        }
    }
})

const planModel = mongoose.model("planscollection", planSchema);

module.exports = planModel;