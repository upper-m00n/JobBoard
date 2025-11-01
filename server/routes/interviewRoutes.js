const multer=require('multer');
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
const {startInterview,feedbackAndNextQuestion}=require('../controllers/interviewController')

const express=require('express');
const router=express.Router();

router.post('/start',startInterview);
router.post('/answer',upload.single('audio'),feedbackAndNextQuestion);

module.exports=router;
