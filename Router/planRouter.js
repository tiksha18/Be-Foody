const express = require("express");
const { protectRoute, isAuthorized } = require("../Controller/authController");

const planRouter = express.Router();

const { getAllPlans, createPlans, getPlanById, updatePlan, deletePlan } = require("../Controller/planController")


planRouter
.route("")
.get( protectRoute , getAllPlans)    // mtlb getallplans func chalne se pehle protectRoute middleware pe jayega
.post(createPlans);

planRouter
.route("/:id")
.get( protectRoute, getPlanById)
.patch( protectRoute, isAuthorized, updatePlan)
.delete( protectRoute ,  isAuthorized ,deletePlan);

module.exports = planRouter;