import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer from "puppeteer";

const genAI= new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model=genAI.getGenerativeModel({model:"gemini-2.5-pro"});

async function generateResume(req,res) {
    const {fullName, projects, education, experience, skills, jobTitle, info}= req.body;

    if (!fullName || !education || !experience || !skills || !jobTitle || !projects) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const prompt = `
      You are a professional resume writer and designer. Generate a visually appealing, and good ATS score, modern HTML resume with the following details:

      Full Name: ${fullName}
      Job Title: ${jobTitle}
      Experience: ${experience}
      Education: ${education}
      Projects: ${projects}
      Skills: ${skills}
      Additional Information: ${info}

      Output Requirements:
      - Return a *single*, *complete* HTML document. Start with <!DOCTYPE html> and end with </html>.
      - Include **beautiful inline CSS** inside a <style> tag in the <head>.
      - Use a professional, clean, single-column layout.
      - Use <section> tags for "Summary", "Education", "Experience", "Projects", and "Skills".
      - Ensure the layout is optimized for an A4 page size for PDF conversion.
      - Do not include any markdown (like \`\`\`html) or explanatory text before or after the HTML block.

      Return only the complete HTML.
      
    `;

    try {
        const result= await model.generateContent(prompt);
        const response= result.response;
        const resumeHTML= response.text();

        console.log("resume generation started....");

        const broswer= await puppeteer.launch({
            args:['--no-sandbox']
        });

        const page = await broswer.newPage();

        await page.setContent(resumeHTML,{waitUntil:'networkidle0'});

        const pdf =  await page.pdf({
            format:'A4',
            printBackground:true,
            margin:{
                top:'10px',
                bottom:'20px',
                right:'20px',
                left:'20px'
            }
        })

        await broswer.close();
        console.log("PDF generated successfully");

        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition','attachment; filename=resume_by_HireReadyAI.pdf');

        res.send(pdf);

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ 
        error: error.response?.data?.error?.message || 'PDF generation failed',
        solution: error.response?.status === 402 ? 'Add more OpenRouter credits' : undefined
    });
    }
}

export {generateResume};