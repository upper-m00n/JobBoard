const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const router = express.Router();

router.post('/generate', async (req, res) => {
  const { fullName,projects ,education, experience, skills, jobTitle, info} = req.body;

  if (!fullName || !education || !experience || !skills || !jobTitle) {
    return res.status(400).json({ error: 'All fields are required to generate resume' });
  }

  const prompt = `
You are a professional resume writer and designer. Generate a visually appealing, and good ATS score, modern **HTML resume** with the following details:

Full Name: ${fullName}
Job Title: ${jobTitle}
Experience: ${experience}
Education: ${education}
Projects: ${projects}
Skills: ${skills}
Additional Information:${info}

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
        model: 'anthropic/claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://job-board-pied-eight.vercel.app',
          'Content-Type': 'application/json',
        },
      }
    );

    const rawHtml = response.data.choices?.[0]?.message?.content;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(rawHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const safeName = (fullName || 'resume').replace(/ /g, '_');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${safeName}_Resume.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('AI Resume Generation Failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

module.exports = router;
