// const usersDB = require("../Model/usersModel.json");
const {v4 : uuidv4} = require("uuid");
// let fs = require("fs"); 
// let path = require("path"); 

const userModel = require("../Model/usersModel");

// get all users

function getAllUsers(req, res)
{
    if(usersDB.length)
    {
        res.json({
            "message" : "All Data successfully found",
            "data" : usersDB
        })
    }
    else
    {
        res.json({
            "message" : "Data not available"
        })
    }
}

// create a user

function createUsers(req, res)
{
    let user = req.body;
    user.id = uuidv4();
    usersDB.push(user);
    let plansPath = path.join(__dirname, '..', 'Model', 'usersModel.json');
    fs.writeFileSync(plansPath, JSON.stringify(usersDB));
    res.status(201).json({
        "message" : "successfully created User",
        data : usersDB
    })
}

//get a user by id

async function getUserById(req, res) {
    try
    {
        let id = req.id;
        let user = await userModel.findById(id);
        res.status(200).json({
            "message" : "Got the user successfully",
            data : user
        })
    }
    catch(error)
    {
        res.status(501).json({
            "message" : "Failed to get user !",
            error
        })
    }
}

//update a user

async function updateUser(req, res) {
   try
   {
        let id = req.id;
        let updateObj = req.body.updateObj;
        let user = await userModel.findById(id);
        for(key in updateObj)
        {
            user[key] = updateObj[key];
        }
        let updatedUser = await user.save();
        res.status(201).json({
            "message" : "Updated User Successfully",
            data : updatedUser
        })
   }
   catch(error)
   {
       res.status(501).json({
           "message" : "Failed to update User",
           error
       })
   }
}

//delete a User by id

async function deleteUser(req, res) {
    try
    {
        let id = req.id;
        let deletedUser = await userModel.findByIdAndDelete(id);
        if(deletedUser)
        {
            res.status(200).json({
                "message" : "Deleted User Successfully",
                "data" : deletedUser
            })
        }
        else
        {
            res.status(501).json({
                "message" : "User not found"
            })
        }
    }
    catch(error)
    {
        res.status(501).json({
            "message" : "Failed to delete user",
            error
        })
    }
}

// update profile photo
async function updateProfilePhoto(req, res)
{
    try
    {
        let file = req.file;
        console.log(file);
        let imagePath = file.destination + "/" + file.filename;
        imagePath = imagePath.substring(6);

        let id = req.id;
        let user = await userModel.findById(id);
        user.pImage = imagePath;
        await user.save({validateBeforeSave : false});
        res.status(200).json({
            "message" : "Profile Photo Updated"
        })
    }
    catch(error)
    {
        res.status(200).json({
            "message" : "Failed to Update Profile Photo",
            error
        })
    }
}


module.exports.getAllUsers = getAllUsers;
module.exports.createUsers = createUsers;
module.exports.getUserById = getUserById;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.updateProfilePhoto = updateProfilePhoto;