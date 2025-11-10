const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const TrackedJobSchema= Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    jobTitle:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    jobDescription:{
        type:String,
        required:true,
    },
    originalUrl:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['Saved','Preparing','Applied','Interviewing', 'Offer', 'Rejected'],
        default:'Saved'
    },
    notes:{
        type:String,
        default:''
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports= mongoose.model('TrackedJob',TrackedJobSchema);