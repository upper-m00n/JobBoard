const express= require('express');
const router=express.Router();
const {searchJobs}=require('../controllers/aggregator.controller');
const {authMiddleware}=require('../middleware/auth');

router.post('/',authMiddleware,searchJobs);

module.exports=router;