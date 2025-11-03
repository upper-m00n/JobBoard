const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema= new Schema({
    questionText:{type: String, required:true},
    answerText:{type:String},
    critique:{type:String},
    contentAnalysis:{type:String},
    toneScore:{type:Number},
    fillerWordCount:{type:Number},
    wordCount:{type:Number},
});

const InterviewSessionSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    jobDescription:{type:String, default:'General'},
    answers:[AnswerSchema],

    finalReportSummary:{type:String},
    finalReportTips:[String],

    createdAt:{type:Date, default:Date.now}
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);

