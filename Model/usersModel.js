// [
//     {
//         "name": "Shivam",
//         "email": "shivu@gmail.com",
//         "id": "a41b4646-1afd-4916-9c09-427671101d4d"
//     },
//     {
//         "name": "Riva",
//         "email": "rivu@gmail.com",
//         "id": "7826ed59-cbd6-4edd-b8d5-7aa02a6b1278"
//     },
//     {
//         "name": "Diya",
//         "email": "didu@yahoo.in",
//         "id": "cab33ffb-54ff-4788-b5f4-ee27ecfa7843"
//     }
// ]

// npm i mongoose

const mongoose = require("mongoose");
// const { DB_LINK } = require("../config/secrets");
const crypto = require("crypto");


// heroku k liye
const DB_LINK = process.env.DB_LINK;


mongoose.connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => {
    console.log("connected to db");
})

let userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : { 
        type : String,
        required : true,
        minlength : [6, "Password must be more than 6 characters long"],
    },
    confirmPassword : {
        type : String,
        // required : true,
        minlength : [6, "Password must be more than 6 characters long"],
        validate : {
            validator : function(){
                return this.password == this.confirmPassword;
            },
            message : "Password doesn't match"
        }
    },
    role : {
        type : String,
        enum : ["admin", "user", "restaurant owner", "delivery boy"],
        default : "user"
    },
    pImage : {
        type : String,
        default : "/images/users/default.png"
    },
    pwToken : String,
    tokenTime : String,
    bookedPlanId : {
        type : String
    }
})

// ye pre hook hai jo create func se pehle chalega aur uss time confirmPassword ki value ko undefined kardega
userSchema.pre("save", function() {
    this.confirmPassword = undefined; 
})

// humne userSchema k sath ye createPwToken ek func banakar attach kardiya hai 
// jab bhi forgetPassword click hoga to ye func chalega
// to jo bhi document(tuple or user) uss time pe aayega db se wo iss func ko call lagayega agar wo forgot password click karta h to 
userSchema.methods.createPwToken = function()
{
    // creating token
    let token = crypto.randomBytes(32).toString("hex");
    // creating time for which the token is valid to change password
    let time = Date.now() * 60 * 10 * 1000;
    // updating the current document keys
    this.pwToken = token;
    this.tokenTime = time;
    return token;
}

userSchema.methods.resetPasswordHandler = function(password, confirmPassword)
{
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.pwToken = undefined;  // assigning undefined to these keys will remove the keys from the database of that particular document
    this.tokenTime = undefined;
}

const userModel = mongoose.model("userscollection", userSchema);

module.exports = userModel;