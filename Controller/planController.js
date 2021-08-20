//const plans = require("../Model/plansModel.json");
// const {v4 : uuidv4} = require("uuid");
// let fs = require("fs");
// let path = require("path");
const planModel = require("../Model/plansModel");


// create a plan

async function createPlans(req, res)
{
    try
    {
        let sentPlan = req.body;
        let plan = await planModel.create(sentPlan);
        res.status(200).json({
            "message" : "Plan created Successfully",
            data : plan
        })
    }
    catch(error)
    {
        res.status(501).json({
            "message" : "Failed to create plan",
            error : error.errors.discount.message
        })
    }
}


 // get all plans

async function getAllPlans(req, res) {
    try
    {
        let plans = await planModel.find({});
        res.status(200).json({
            "message" : "Got all plans successfully",
            data : plans
        })
    }
    catch(error)
    {
        res.status(200).json({
            "message" : "No plans found",
            error : error
        })
    }
}


//get a plan by id

async function getPlanById(req, res) {
    try
    {
        let {id} = req.params;
        let plan = await planModel.findById(id);
        res.status(200).json({
            "message" : "Successfully found this plan",
            "data" : plan
        }) 

    }
    catch(error)
    {
        res.status(404).json({
            "message" : "Plan not found",
            error : error
        })
    }
}

//update a plan

async function updatePlan(req, res) {

    try
    {
        let id = req.params.id || req.id;
        let {updateObj} = req.body;
        // let updatedPlan = await planModel.findByIdAndUpdate(id, updateObj, { new : true });
        let plan = await planModel.findById(id);
        for(key in updateObj)
        {
            plan[key] = updateObj[key];
        }
        let updatedPlan = await plan.save();   // this save function will check the validator before entering discount
        res.status(200).json({
            "message" : "Updated Plan Successfully",
            "data" : updatedPlan
        })
    }
    catch(error)
    {
        res.status(501).json({
            "message" : "Failed to update Plan",
            error : error.errors.discount.message
        })
    }
}

//delete a plan by id

async function deletePlan(req, res) {
    try
    {
        let {id} = req.params;
        let deletedPlan = await planModel.findByIdAndDelete(id);
        if(deletedPlan)
        {
            res.json({
                "message" : "Plan deleted Successfully",
                "data" : deletedPlan
            })   
        }
        else
        {
            res.status(404).json({
                "message" : "Failed to delete plan",
            })
        }
    }
    catch(error)
    {
        res.status(404).json({
            "message" : "Failed to delete plan",
            error
        })
    }
}

module.exports.createPlans = createPlans;
module.exports.getAllPlans = getAllPlans;
module.exports.getPlanById = getPlanById;
module.exports.updatePlan = updatePlan;
module.exports.deletePlan = deletePlan;