const multer=require('multer')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {analyzeConfidence,analyzeTone}=require('../utils/analysisHelper');
const InterviewSession = require('../models/InterviewSessions.model');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model:"gemini-2.5-pro" });

async function transcribeAudio(audioBuffer) {
  try {
    
    const base64Audio = audioBuffer.toString("base64");

   
    const audioData = {
      inlineData: {
        mimeType: "audio/webm",
        data: base64Audio,
      },
    };

    const result = await model.generateContent([
      "Transcribe this audio clearly into text:",
      audioData,
    ]);

    const text = result.response.text();

    if (!text || text.trim() === "") {
      console.error("Gemini returned empty transcription");
      return "Error: could not transcribe audio.";
    }

    return text;
  } catch (error) {
    console.error("Gemini transcription error:", error);
    return "Error: could not transcribe audio.";
  }
}



async function startInterview(req, res) {
    try {
        const {jobDescription}=req.body;
        const userId = req.user.id;

        const chat=model.startChat({
            history:[{
                role:"user",
                parts:[{text:`You are a senior job interviewer for Job Description ${jobDescription}. I am the candidate. Start the interview by asking me your first question.`}]
            }],
        })

        const result= await chat.sendMessage("Start.");

        const firstQuestion = result.response.text();

        const newSession= new InterviewSession({
            jobDescription: jobDescription || "General",
            answers:[{
                questionText:firstQuestion,
            }]
        });

        await newSession.save();


        res.json({firstQuestion,sessionId:newSession._id});

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

async function feedbackAndNextQuestion(req,res) {
    if(!req.file){
        return res.status(400).json({error:"No audio file provided."})
    }
    if(!req.body.sessionId){
        return res.status(400).json({error:"No session ID provided."})
    }

    try {
        const audioBuffer = req.file.buffer;
        const {sessionId}=req.body;
        const audioMimeType = req.file.mimeType;

        const session = await InterviewSession.findById(sessionId);

        if(!session){
            return res.status(404).json({error:"Session not found"});
        }

        const currentQuestion= session.answers[session.answers.length -1].questionText;

        const userTranscript = await transcribeAudio(audioBuffer);

        if(userTranscript.startsWith('Error')){
            return res.status(400).json({error:"could not transcribe audio"});
        }
        const toneScore = analyzeTone(userTranscript);

        const {fillerWordCount, wordCount}= analyzeConfidence(userTranscript);

        const prompt = `
            The interview question was: "${currentQuestion}"
            The candidate's answer was: "${userTranscript}"

            Please provide a JSON object with three keys:
            1. "critique": A brief, one-sentence critique for real-time feedback.
            2. "contentAnalysis": A detailed, 2-3 sentence paragraph analyzing the answer's clarity, accuracy, and structure (like the STAR method). This is for a final report.
            3. "nextQuestion": Your next follow-up question.
            
            Respond ONLY with the JSON object.
        `;

        const result= await model.generateContent(prompt);
        const aiResponseText = result.response.text();
        const aiResponseJson = JSON.parse(aiResponseText.match(/\{[\s\S]*\}/)[0]);

        const lastAnswerIndex = session.answers.length -1;

        session.answers[lastAnswerIndex].answerText = userTranscript;
        session.answers[lastAnswerIndex].critique= aiResponseJson.critique;
        session.answers[lastAnswerIndex].contentAnalysis = aiResponseJson.contentAnalysis;
        session.answers[lastAnswerIndex].toneScore = aiResponseJson.toneScore;
        session.answers[lastAnswerIndex].fillerWordCount = aiResponseJson.fillerWordCount;
        session.answers[lastAnswerIndex].wordCount = aiResponseJson.wordCount;

        session.answers.push({
            questionText:aiResponseJson.nextQuestion
        })

        await session.save();

        res.json({
            userTranscript:userTranscript,
            feedback:aiResponseJson.critique,
            nextQuestion:aiResponseJson.nextQuestion
        })

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

// get raw data

const getInterviewSession = async (req,res)=>{
    const sessionId = req.params.id;

    try {
        const session = await InterviewSession.findById(sessionId);

        if(!session){
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(session);

    } catch (error) {
        res.status(500).json({error:'Server error'});
        console.log("Server error while fetching session",error);
    }
}

// generate reports

const generateReport = async(req,res)=>{
    const sessionId= req.params.id;

    try {
        const session = await InterviewSession.findById(sessionId);

        if(!session){
            return res.status(404).json({ error: 'Session not found' });
        }

        if(session.finalReportSummary){
            return res.json({
                summary:session.finalReportSummary,
                tips:session.finalReportTips
            });
        }

        const analysisData = session.answers
            .filter(a=>(a.answerText))
            .map(a=>({
                question:a.questionText,
                answer:a.answerText,
                critique:a.contentAnalysis,
                tone:a.toneScore,
                confidence:a.fillerWordCount
            }));

            const prompt = `
                A user just finished a mock interview. Here is a JSON array of their performance:
                ${JSON.stringify(analysisData)}

                Please act as a friendly and encouraging interview coach.
                Provide a JSON object with two keys:
                1. "summary": A 3-4 sentence overall performance summary.
                2. "tips": A JSON array of 3 actionable improvement tips.

                **IMPORTANT: The "tips" array must be an array of simple strings.**

                **Good Example of the "tips" format:**
                "tips": [
                    "Tip 1 as a complete sentence.",
                    "Tip 2 as a complete sentence.",
                    "Tip 3 as a complete sentence."
                ]

                **Bad Example (Do NOT do this):**
                "tips": [
                    { "tip": "...", "details": "..." }
                ]

                Respond ONLY with the JSON object.
            `;

            const result = await model.generateContent(prompt);
            const aiResponseText = result.response.text();
            const reportJson= JSON.parse(aiResponseText.match(/\{[\s\S]*\}/)[0]);

            session.finalReportSummary = reportJson.summary;
            session.finalReportTips=reportJson.tips;

            await session.save();

            res.json(reportJson);

    } catch (error) {
        res.status(500).json({error:'Server error'});
        console.log("Server error while generating reports",error);
    }
}

module.exports={startInterview,feedbackAndNextQuestion, generateReport,getInterviewSession};