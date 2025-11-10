const { GoogleGenerativeAI } = require("@google/generative-ai");
const puppeteer = require("puppeteer-extra");
const pdf = require('pdf-parse-new')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }); 


const generateResume = async (req, res) => {
  const { fullName, projects, education, experience, skills, jobTitle, info } = req.body;

  if (!fullName || !education || !experience || !skills || !jobTitle || !projects) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const prompt = `
    You are a professional resume writer and designer. Generate a visually appealing, ATS-friendly, modern HTML resume with the following details:

    Full Name: ${fullName}
    Job Title: ${jobTitle}
    Experience: ${experience}
    Education: ${education}
    Projects: ${projects}
    Skills: ${skills}
    Additional Information: ${info}

    Output Requirements:
    - Return a *single*, *complete* HTML document (<!DOCTYPE html> ... </html>).
    - Include inline CSS in a <style> tag.
    - Use a professional single-column layout.
    - Use <section> tags for each resume part.
    - Optimized for A4 page size for PDF export.
  `;

  try {
    const result = await model.generateContent(prompt);
    const resumeHTML = result.response.text();

    console.log("Generating resume...");

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setContent(resumeHTML, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", bottom: "20px", right: "20px", left: "20px" },
    });

    await browser.close();

    console.log("PDF generated successfully");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume_by_HireReadyAI.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({
      error: error.response?.data?.error?.message || "PDF generation failed",
      solution: error.response?.status === 402 ? "Add more OpenRouter credits" : undefined,
    });
  }
};

const parsePdfBuffer = async(buffer)=>{
  try {
    const data = await pdf(buffer);
    return data.text.trim();
  } catch (err) {
    console.error("Error parsing PDF:", err);
    throw err;
  }
}

const atsChecker = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(404).json({ error: "No resume file uploaded" });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: "No job description provided" });
    }

    const resumeText = await parsePdfBuffer(req.file.buffer);

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const prompt = `
      You are a  ATS calculator, not just a simple parser.
      Your task is to analyze the following resume against the provided job description.

      **CRITICAL INSTRUCTIONS:**
      1.  **The current date is ${currentDate}.** Use this to evaluate all dates. Dates like 2024 are in the PAST, not the future.
      2.  **Resume Structure:** Be intelligent. A "Project" listed *under* a "Work Experience" role (like an internship) is part of that job. Personal projects are listed under the main "PROJECTS" heading. Do not flag this as confusing.
      3.  **Focus:** Your primary goal is to analyze the *match* (skills, keywords, experience) between the resume and the job description.

      **Job Description:**
      ---
      ${jobDescription}
      ---

      **Resume Text:**
      ---
      ${resumeText}
      ---

      **Respond with a JSON object with the following schema:**
      {
        "match_score": "A percentage (e.g., 85) representing how well the resume matches the job description.",
        "summary": "A 2-3 sentence summary of the candidate's fit for the role.",
        "missing_keywords": ["An array of the top 5-10 most important keywords from the job description that are MISSING from the resume."],
        "concerns": ["An array of *real* concerns (e.g., 'Missing 3 years of required experience,' 'Lacks critical [X] skill'). Do NOT list minor formatting or correct past dates as concerns."]
      }
    `;

    const analysisModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await analysisModel.generateContent(prompt);
    const aiResponseText = result.response.text();

    const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in model response.");

    const atsResult = JSON.parse(jsonMatch[0]);
    res.json(atsResult);
  } catch (error) {
    console.error("Error in ATS check:", error.message);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
};

module.exports = {
  generateResume,
  atsChecker
};