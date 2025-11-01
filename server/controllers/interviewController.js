const multer=require('multer')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model:"gemini-2.5-pro" });

const chatHistories={};

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

        const chat=model.startChat({
            history:[{
                role:"user",
                parts:[{text:`You are a senior job interviewer for Job Description ${jobDescription}. I am the candidate. Start the interview by asking me your first question.`}]
            }],
        })

        const result= await chat.sendMessage("Start.");

        const firstQuestion = result.response.text();

        const sessionId = `sess_${Date.now()}`;
        chatHistories[sessionId]=chat;

        res.json({firstQuestion,sessionId});

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
        const sessionId=req.body.sessionId;

        const chat = chatHistories[sessionId];

        if(!chat){
            return res.status(404).json({error:"Chat session not found."});
        }

        const userTranscript = await transcribeAudio(audioBuffer);

        const prompt=`
            That was my answer: "${userTranscript}". 
            
            Please provide two things in your response:
            1. A brief, one-sentence critique of my answer.
            2. Your next interview question.
            
            Respond ONLY with a JSON object in this exact format:
            {
                "feedback": "Your critique here...",
                "nextQuestion": "Your next question here..."
            }
        `;

        const result= await chat.sendMessage(prompt);
        const aiResponseText = result.response.text();

        let aiResponseJson;
        try {
            const cleanJsonString = aiResponseText.match(/\{[\s\S]*\}/)[0];
            aiResponseJson=JSON.parse(cleanJsonString);
        } catch (e) {
            console.error("Failed to parse LLM JSON:", e, aiResponseText);
            return res.status(500).json({ error: "AI response was not valid JSON." });
        }

        res.json({
            userTranscript: userTranscript,
            ...aiResponseJson
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}

module.exports={startInterview,feedbackAndNextQuestion};