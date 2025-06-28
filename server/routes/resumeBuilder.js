const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const router = express.Router();


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
You are a professional resume writer and designer. Generate a visually appealing, and good ATS score, modern **HTML resume** with the following details:

Full Name: {{fullName}}
Job Title: {{jobTitle}}
Experience: {{experience}}
Education: {{education}}
Projects: {{projects}}
Skills: {{skills}}
Additional Information: {{info}}

✅ Output Requirements:
- Return pure HTML (no markdown).
- Include **beautiful inline CSS styling**: light background, colored section headers, consistent fonts.
- Add padding, shadows, and clean layout.
- Use <section> tags for "Summary", "Education", "Experience", and "Skills".
- Ensure the layout fits on A4 size when converted to PDF.

Return only the HTML content.
`;


  try {
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku', 
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const html = response.data.choices[0].message.content;


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