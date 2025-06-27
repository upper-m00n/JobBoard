 const express = require('express')
 const Job = require('../models/Job')
 const {authMiddleware , requireRole} = require('../middleware/auth.js')
const { route } = require('./authRoutes')

 const router = express.Router()

 router.get('/', async(req,res)=>{
    try {
        const jobs = await Job.find().sort({createdAt: -1}).limit(10)
        res.json(jobs)
    } catch (error) {
        res.status(500).json({error:'something went wrong'})
    }
 })

 router.post('/',authMiddleware, requireRole('employer'), async(req,res)=>{
    const {title, company, location, type, description}= req.body
    try {
        console.log('User:',req.user);
        
        const job= new Job({
            title,
            company,
            location,
            type,
            description,
            createdBy:req.user.id,
        })

        await job.save()
        res.status(201).json(job)
    } catch (err) {
        console.error(err);
        res.status(500).json({error:'Failed to create job'})
    }
 } )


 router.get('/myJobs', authMiddleware, requireRole('employer'), async(req,res)=>{
    try {
        const jobs= await Job.find({createdBy:req.user.id}).sort({createdAt:-1})
        res.json(jobs)
    } catch (err) {
        res.status(500).json({error:'Failed to fetch employers jobs'})
    }
 })

 router.delete('/:id', authMiddleware, requireRole('employer'), async(req,res)=>{
    try {
        const job = await Job.findOneAndDelete({_id: req.params.id, createdBy: req.user.id})
        if(!job) return res.status(404).json({error:'Job not found or unauthorized'})
        res.json({message:'Job deleted succesfully'})
    } catch (err) {
        res.status(500).json({error:'Delete failed'})
    }
 })
 

  

module.exports = router;