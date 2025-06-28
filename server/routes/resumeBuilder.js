const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const router = express.Router();

// Improved browser launcher with multiple fallback paths
async function launchBrowser() {
  const chromiumPaths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
    '/snap/bin/chromium'
  ];

  const launchOptions = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--disable-gpu'
    ],
    headless: 'new',
    timeout: 30000 // 30 seconds timeout
  };

  let lastError = null;

  for (const path of chromiumPaths) {
    if (!path) continue;
    
    try {
      launchOptions.executablePath = path;
      const browser = await puppeteer.launch(launchOptions);
      console.log(`Successfully launched Chromium at ${path}`);
      return browser;
    } catch (error) {
      lastError = error;
      console.warn(`Failed to launch Chromium at ${path}:`, error.message);
    }
  }

  throw new Error(`Could not launch Chromium at any path. Last error: ${lastError?.message}`);
}

router.post('/generate', async (req, res) => {
  const { fullName, projects, education, experience, skills, jobTitle, info } = req.body;

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
  Additional Information: ${info}

  ✅ Output Requirements:
  - Return pure HTML (no markdown).
  - Include **beautiful inline CSS styling**: light background, colored section headers, consistent fonts.
  - Add padding, shadows, and clean layout.
  - Use <section> tags for "Summary", "Education", "Experience", and "Skills".
  - Ensure the layout fits on A4 size when converted to PDF.

  Return only the HTML content.
  `;

  try {
    // Get HTML from AI
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
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

    // Generate PDF
    const browser = await launchBrowser();
    const page = await browser.newPage();
    
    // Set longer timeout for page operations
    page.setDefaultTimeout(30000);
    
    await page.setContent(rawHtml, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      }
    });

    await browser.close();

    const safeName = (fullName || 'resume').replace(/[^a-zA-Z0-9_]/g, '_');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${safeName}_Resume.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Full error during resume generation:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    res.status(500).json({ 
      error: 'Failed to generate resume',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;