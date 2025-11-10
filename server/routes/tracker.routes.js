const express=require('express');
const router= express.Router();
const {saveJob,updateJobStatus,getTrackedJob,getTrackedJobById, deleteTrackedJob}=require('../controllers/jobTracker.controller');

const {authMiddleware}=require('../middleware/auth')

router.use(authMiddleware);

router.get('/',getTrackedJob);
router.get('/:id', getTrackedJobById);
router.post('/',saveJob);
router.put('/:id',updateJobStatus);
router.delete('/:id',deleteTrackedJob);


module.exports=router;