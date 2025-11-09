const express=require('express');
const router=express.Router();
const {generateResume,atsChecker}= require('../controllers/resume.controller')
const multer=require('multer');

const storage=multer.memoryStorage();
const upload=multer({storage:storage});

router.post('/generate',generateResume);
router.post('/check-ats',upload.single('resume'),atsChecker);

module.exports=router;