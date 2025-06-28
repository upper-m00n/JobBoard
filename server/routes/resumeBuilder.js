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
You're a skilled resume designer and front-end developer.

Using the details below, generate a **clean, modern, and ATS-optimized resume** in **pure HTML with inline CSS**. Make it visually similar to a professional PDF resume, styled like a purple & white theme with a neat two-column layout.

Use the following data:

- Full Name: ${fullName}
- Job Title: ${jobTitle}
- Experience: ${experience}
- Education: ${education}
- Skills: ${skills}
${projects ? `- Projects: ${projects}` : ''}
${info ? `- Additional Info: ${info}` : ''}

📄 **Resume Design Requirements**:
- Output should be **pure HTML** with all **CSS inline**.
- Layout should be **2-column** on desktop, responsive on mobile.
  - Left column (25–30% width): Name, Contact, Skills, Links.
  - Right column (70–75%): Education, Experience, Projects, etc.
- Use soft **white background**, dark/gray text, and **purple for highlights/headers**.
- Use **modern fonts** like 'Segoe UI', 'Open Sans', or 'Roboto'.
- Add **margins**, **padding**, and **subtle shadows** for sections.
- Use <section, <h2>, <ul> etc., for **semantic and ATS-friendly layout**.
- Avoid using <table> or complex positioning.

🖨️ **Print Requirements**:
- Ensure content fits within **A4** without breaking sections.
- Keep left and right margins at around 20mm.
- Use printBackground: true when rendered to PDF.

Only return valid and beautiful **HTML code**. Do not return markdown, explanations, or extra text.
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