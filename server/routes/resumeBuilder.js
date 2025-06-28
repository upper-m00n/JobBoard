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

  const prompt = `You are an expert ATS-optimized resume designer. Create a visually stunning HTML resume that passes through applicant tracking systems while maintaining elegant design. Follow these requirements carefully:

# Candidate Details
- Full Name: ${fullName}
- Target Position: ${jobTitle}
- Professional Experience: ${experience}
- Education Background: ${education}
- Technical Skills: ${skills}
- Additional Information: ${info || 'N/A'}

# Design Requirements
1. ATS Compatibility:
   - Use standard section headers (Experience, Education, Skills)
   - Include relevant keywords from the ${jobTitle} field
   - No tables, columns, or complex layouts that confuse ATS

2. Visual Design:
   - Professional color scheme (primary color: #2563eb, secondary: #4b5563)
   - Modern typography (clean sans-serif fonts)
   - Subtle shadows and borders for depth
   - Balanced white space
   - Responsive layout

3. HTML Structure:
   - Semantic HTML5 (<section> tags for each category)
   - Inline CSS only (no external stylesheets)
   - Print-optimized for A4 paper size (210mm × 297mm)
   - Margin: 20mm on all sides

4. Content Sections:
   - Header with name and contact info
   - Professional summary (3-4 lines)
   - Work experience (reverse chronological)
   - Education (degrees only)
   - Skills (grouped by category)
   - Optional: Projects/Certifications if space allows

5. Output Format:
   - Pure HTML only (no markdown, no ''')
   - Perfectly valid HTML that can be rendered directly
   - No placeholder comments or TODOs

Generate only the HTML code for the resume, without any additional commentary or explanation. The design should impress both ATS systems and human recruiters.`;

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