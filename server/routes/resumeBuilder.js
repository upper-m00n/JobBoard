const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const router = express.Router();

// Optimized for Railway
async function launchBrowser() {
  return await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ],
    headless: 'new',
    timeout: 60000
  });
}

router.post('/generate', async (req, res) => {
  const { fullName, projects, education, experience, skills, jobTitle, info } = req.body;

  if (!fullName || !education || !experience || !skills || !jobTitle) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const prompt = `
You are an expert resume writer and modern web designer.

Generate a highly professional, visually appealing, and ATS-friendly HTML resume using the following information:

- Full Name: ${fullName}
- Job Title: ${jobTitle}
- Experience: ${experience}
- Education: ${education}
- Skills: ${skills}
${projects ? `- Projects: ${projects}` : ''}
${info ? `- Additional Information: ${info}` : ''}

✅ Resume Requirements:
- Use pure, clean **HTML with inline CSS** (no external files).
- Design must be modern, **visually balanced**, and **mobile-friendly**.
- Use **light background**, elegant fonts (e.g., "Segoe UI", "Roboto", or "Open Sans").
- Add **subtle shadows**, **rounded containers**, and consistent padding/margin.
- Section headings should be **color-coded or bold** and separated clearly.
- Use `<section>` tags for **Summary**, **Education**, **Experience**, **Skills**, and **Projects** (if provided).
- Add spacing between sections to enhance readability.
- Ensure the resume is **A4-compatible** when printed or saved as PDF (avoid page breaks in the middle of sections).
- Avoid complex HTML structures that break in ATS systems (no tables or floats).
- Use bullet points for responsibilities, achievements, and skills.

🎯 Important:
- Keep the layout neat and readable.
- Make sure it scores well with Applicant Tracking Systems (ATS).
- Output ONLY the final **HTML code**. Do not include explanations, markdown, or comments.
`;

  try {
    // Get HTML from AI
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku', // More cost-effective model
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000 // Reduced token count
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const html = response.data.choices[0].message.content;

    // PDF Generation
    const browser = await launchBrowser();
    const page = await browser.newPage();
    
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    const pdf = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${fullName.replace(/\s/g, '_')}_Resume.pdf`
    });
    res.send(pdf);

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: error.response?.data?.error?.message || 'PDF generation failed',
      solution: error.response?.status === 402 ? 'Add more OpenRouter credits' : undefined
    });
  }
});

module.exports = router;