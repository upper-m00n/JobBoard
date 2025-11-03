const express=require("express");
const { authMiddleware } = require("../middleware/auth");
const { getAllReports } = require("../controllers/userDashboardController");

const router=express.Router();

router.get('/reports',authMiddleware,getAllReports);

module.exports=router;