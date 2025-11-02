const express=require('express');
const router=express.Router();
const {generateResume}= require('../controllers/resume.controller')
router.post('/generate',generateResume);

module.exports=router;