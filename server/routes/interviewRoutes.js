const multer=require('multer');
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
const {startInterview,feedbackAndNextQuestion,generateReport,getInterviewSession}=require('../controllers/interviewController')
const {authMiddleware}=require('../middleware/auth')
const express=require('express');
const router=express.Router();

router.post('/start',authMiddleware,startInterview);
router.post('/answer',authMiddleware,upload.single('audio'),feedbackAndNextQuestion);

router.get('/session/:id',getInterviewSession);
router.post('/report/:id',generateReport);

module.exports=router;
