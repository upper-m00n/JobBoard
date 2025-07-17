const express = require('express');
const sendEmail = require('../utils/sendEmail');
const router= express.Router();

router.post('/', async (req,res)=>{
    try {
        const {email, name, msg}= req.body;

        if(!email || !name || !msg){
            return res.status(400).json({message:"Basic info is required"})
        }

        const sendMail = await sendEmail({
            to: 'ashu.toast2004@gmail.com',
            from:email,
            subject: `Job Board Email from ${name}`,
            html:`<p>${msg}</p>`
        })

        res.status(201).json({message:"Email sent successfully"})
    } catch (err) {
        console.log("Error while sending email",err)
        return res.status(500).json({message:"Error while sending email"})
    }
})

module.exports =router