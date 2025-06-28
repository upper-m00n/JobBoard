const express = require('express');
const Application = require('../models/Applications');
const { authMiddleware, requireRole } = require('../middleware/auth');
const multer = require('multer');
const imagekit = require('../utils/imageKit');
const path = require('path');
const Job = require('../models/Job')
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.delete('/:id', authMiddleware, requireRole('seeker'), async(req,res)=>{
  try {
    const deleteApp = await Application.findOneAndDelete({
      _id: req.params.id,
      seeker: req.user.id
    })

    if(!deleteApp) return res.status(404).json({error:'Application not found'})

    res.json({message:'Application deleted successfully'})

  } catch (err) {
    console.error('Failed to delete application',err);
    res.status(500).json({error:"Failed to delete application"})
  }
})

router.put('/:id', authMiddleware, requireRole('seeker'),upload.single('resume'), async(req,res)=>{
  const {coverLetter}= req.body

  try{
    const  updatedApp = await Application.findOneAndUpdate(
      {_id: req.params.id, seeker:req.user.id},
      {coverLetter},
      {new:true}
    )

    if (!updatedApp) return res.status(404).json({error: 'Application not found'})
    
    res.json({message:'Application updated successfully',application:updatedApp})
  }
  catch(err){
    console.error('failed to update application',err.stack || err)
    res.status(500).json({error:'Failed to update application'})
  }
})

router.patch('/:jobid', authMiddleware, requireRole('seeker'), upload.single('resume'), async(req,res)=>{
  try {
    const application= await Application.findById(req.params.id);

    if( !application || application.seeker.toString() !== req.user.id){
      return res.status(403).json({error: 'Not authorized to update this application'})
    }

    if(req.body.coverLetter){
      application.coverLetter = req.body.coverLetter
    }

    if(req.file){
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const fileUpload = bucket.file(`resumes/${filename}`)

      await fileUpload.save(req.file.buffer, {
        metadata : {contentType: req.file.mimetype},
        public: true
      })

      const newResumeUrl =`https://storage.googleapis.com/${bucket.name}/resumes/${filename}`
      application.resumeLink = newResumeUrl
    }

    await application.save();
    res.json({message:'Application updated successfully'})

  } catch (err) {
    console.error('Failed to update application',err);
    res.status(500).json({error:'Failed to update application'})
  }
})

router.post('/:jobId', authMiddleware, requireRole('seeker'), upload.single('resume'), async (req, res) => {
  const { file } = req;
  const jobId = req.params.jobId;
  const { coverLetter } = req.body;

  try {
    if (!file) {
      return res.status(400).json({ error: 'No resume file provided' });
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${path.basename(file.originalname, fileExtension)}${fileExtension}`;

    const uploaded = await imagekit.upload({
      file: file.buffer,
      fileName,
      folder: "resumes",
      useUniqueFileName: true,
    });

    const resumeUrl = uploaded.url;

    const newApp = new Application({
      job: jobId,
      seeker: req.user.id,
      resumeLink: resumeUrl,
      coverLetter,
      name:req.body.name,
      email:req.body.email,
    });

    await newApp.save();

    const job = await Job.findById(jobId);
    if(!job){
      return res.status(404).json({error:'job not found'})
    }

    await sendEmail({
      to: req.body.email,
      subject: `You have applied to ${job.title}`,
      html:`<h2>Congratulations! ${req.body.name}</h2>
        <p> your Application for <strong>${job.title}</strong> has been submitted successfully</p>
       <p> click here to review your resume <a href="${resumeUrl}"> View resume </a></p>
      `
    })

    console.log('✅ Final Resume Link:', resumeUrl);
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    console.error('❌ ImageKit Upload Failed:', err);
    res.status(500).json({ error: 'Failed to apply for the job' });
  }
});

router.get('/my-applications', authMiddleware, requireRole('seeker'), async (req, res) => {
  try {
    const apps = await Application.find({ seeker: req.user.id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// employers api routes

router.get('/employer/:jobId', authMiddleware, requireRole('employer'), async(req,res)=>{
  
  try {
    const {jobId}= req.params
    console.log("📥 Fetching applications for jobId:", jobId);
    
    const applications = await Application.find({job: new mongoose.Types.ObjectId(jobId),isDeletedByEmployer:false}).populate('seeker');
    //console.log('applications',applications)
    res.json({applications})
    
  } catch (err) {
    console.error('Failed to fetch employer applications:',err)
    res.status(500).json({error:'server error'})
  }
})

router.delete('/employer/:id',authMiddleware, requireRole('employer'), async(req,res)=>{
  try {
    const applicationId= req.params.id
    const deleteApp = await Application.findByIdAndUpdate(applicationId,{
      isDeletedByEmployer:true,
    },{new:true})

    if(!deleteApp){res.status(404).json({error: "Application not found"})}

    res.json({message:"Application marked as deleted for employer"});
    } catch (err) {
      console.error("Failed to soft delete application by employer",err);
      res.status(500).json({error:'server error'})
    }
  
})

router.patch('/:id/status', authMiddleware, requireRole('employer'), async(req,res)=>{
    
    const {id}= req.params
    const {status} = req.body;
    const validStatus = ['accepted','rejected','pending']

    if(!validStatus.includes(status)){
      return res.status(400).json({error:'Invalid status value'});
    }

    try {
      const application = await Application.findById(id).populate('seeker');
      console.log("Application",application)
      const job=await Job.findById(application.job);
      console.log("Job:",job)
      if(!application){
        return res.status(404).json({error:'Application not found'})
      }

      application.status = status;
      await application.save();

      if(!job){
      return res.status(404).json({error:'job not found inside status'})
      }

      if(status === 'accepted'){
        sendEmail({
          to:application.seeker.email,
          subject: 'Your application has been shortlisted.',
          html:`
            <h2>Congratulations! ${application.seeker.name}</h2>
            <p>Your application for ${job.title} has been shortlisted</p>
            <p>${job.company} will soon reach out to you.</p>
            <p>Thank you ,</p>
            <p>Team JobBoard</p>
          `
        })
      }
      else if(status === 'rejected'){
        sendEmail({
          to:application.seeker.email,
          subject: 'Your application is rejected.',
          html:`
            <h2>We are sorry to inform you that your application for ${job.title} has been rejected</h2>
            <p>But dont stop keep up the hard work and apply for more jobs on our JobBoard application</p>
            <p>Thank you ,</p>
            <p>Team JobBoard</p>
          `
        })
      }
      res.json({message: `Application status updated to ${status}`});
    } catch (err) {
      console.error("Failed to update application status",err);
      res.status(500).json({error:'server error while updating status'});
    }
  
});

module.exports = router; 
