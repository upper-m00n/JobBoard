const InterviewSession = require("../models/InterviewSessions.model");

const getAllReports = async (req,res)=>{
    const userId=req.user.id;
    console.log("userId",userId)

    try {
        const reports= await InterviewSession.find({userId:userId})
            .select("_id jobDescription createdAt finalReportSummary")
            .sort({createdAt:-1})

        res.json(reports)

    } catch (error) {
        console.error("Error fetching user dashboard:", error);
        res.status(500).send("Server Error");
    }
}

module.exports={getAllReports}