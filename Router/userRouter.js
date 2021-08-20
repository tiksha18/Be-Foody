const express = require("express");
const { signup, login, protectRoute, forgetPassword, resetPassword } = require("../Controller/authController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination : function(req, file, cb)
    {
        cb(null, "public/images/users");
    },
    filename : function(req, file, cb)
    {
        cb(null, `user${Date.now()}.jpg`);
    }
})

function fileFilter(req, file, cb)
{
    if(file.mimetype.includes("image"))
    {
        cb(null, true);
    }
    else
    {
        cb(null, false);
    }
}

const upload = multer({storage:storage, fileFilter:fileFilter});


const userRouter = express.Router();

const { getAllUsers, createUsers, getUserById, updateUser, deleteUser, updateProfilePhoto } = require("../Controller/userController");

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/forgetpassword", forgetPassword);
userRouter.patch("/resetpassword/:token", resetPassword);

// userRouter
// .route("")
// .get(getAllUsers)
// .post(createUsers);   // create user ka kaam sign up karra h

userRouter.use(protectRoute);

userRouter.patch("/updateprofilephoto", upload.single("user") , updateProfilePhoto);

userRouter
.route("")    //("/:id")
.get(getUserById)
.patch(updateUser)
.delete(deleteUser);
   

module.exports = userRouter;