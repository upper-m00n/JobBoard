const mongoose=require('mongoose')

const applicationSchema = new mongoose.Schema({
    job:{type: mongoose.Schema.Types.ObjectId, ref:'Job', required:true},
    name:{type:String,},
    email:{type:String,},
    seeker:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    resumeLink:{type:String},
    coverLetter:{type:String},
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending',
    },
    isDeletedByEmployer:{type:Boolean , default:false}
},{timestamps:true})

module.exports= mongoose.model('Application',applicationSchema)