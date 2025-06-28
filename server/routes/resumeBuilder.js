const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs'); // Added for path verification
const router = express.Router();

// Enhanced browser launcher with debug logging
async function launchBrowser() {
  console.log('Attempting to launch Chromium...');

  // First try: Use Render's system Chromium
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
      executablePath: '/usr/bin/chromium-browser',
      headless: 'new',
      timeout: 30000
    });
    console.log('Successfully launched system Chromium');
    return browser;
  } catch (systemError) {
    console.warn('System Chromium failed, trying fallback...');
  }

  // Fallback: Use Puppeteer's bundled Chromium
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      headless: 'new',
      timeout: 30000
    });
    console.log('Successfully launched bundled Chromium');
    return browser;
  } catch (fallbackError) {
    console.error('All Chromium launch attempts failed:');
    console.error('System error:', systemError?.message);
    console.error('Fallback error:', fallbackError.message);
    
    // Debug: List available Chromium paths
    console.log('Checking common Chromium paths...');
    ['/usr/bin', '/usr/local/bin'].forEach(dir => {
      if (fs.existsSync(dir)) {
        console.log(`Files in ${dir}:`, fs.readdirSync(dir).filter(f => f.includes('chrom')));
      }
    });

    throw new Error('Failed to launch Chromium. Please check server logs.');
  }
}

router.post('/generate', async (req, res) => {
  const { fullName, projects, education, experience, skills, jobTitle, info } = req.body;

  // Validation (unchanged)
  if (!fullName || !education || !experience || !skills || !jobTitle) {
    return res.status(400).json({ error: 'All fields are required to generate resume' });
  }

  try {
    // AI Request (unchanged except max_tokens)
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200, // Reduced for credit limits
      },
      // ... (rest of headers unchanged)
    );

    const rawHtml = response.data.choices?.[0]?.message?.content;

    // PDF Generation with enhanced error handling
    let browser;
    try {
      browser = await launchBrowser();
      const page = await browser.newPage();
      
      await page.setContent(rawHtml, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
      });

      const safeName = (fullName || 'resume').replace(/[^a-zA-Z0-9_]/g, '_');
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${safeName}_Resume.pdf`,
      });
      
      return res.send(pdfBuffer);
    } finally {
      if (browser) await browser.close().catch(e => console.error('Browser close error:', e));
    }
  } catch (error) {
    console.error('Resume generation error:', {
      message: error.message,
      stack: error.stack
    });

    // User-friendly error messages
    let userMessage = 'Failed to generate resume';
    if (error.message.includes('credit')) {
      userMessage = 'API credit limit reached. Please try again later.';
    } else if (error.message.includes('Chromium')) {
      userMessage = 'System error. Our team has been notified.';
    }

    res.status(500).json({ 
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;