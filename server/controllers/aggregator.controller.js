const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');
const fs = require('fs');

puppeteer.use(StealthPlugin());

exports.searchJobs = async (req, res) => {
  const { query, location } = req.body;
  
  if (!query) return res.status(400).json({ error: 'Query is required.' });

  const searchUrl = `https://in.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location || '')}`;

  let browser = null; 

  try {
    console.log(`[Scraper] Launching STEALTH browser for: ${searchUrl}`);
    
    browser = await puppeteer.launch({
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    );

    console.log("[Scraper] Going to page...");
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    const jobCardSelector = 'div.job_seen_beacon';
    console.log(`[Scraper] Waiting for job card selector: ${jobCardSelector}`);
    
    try {
      await page.waitForSelector(jobCardSelector, { timeout: 10000 }); 
      console.log("[Scraper] Job cards found! Parsing...");
    } catch (waitError) {
      console.log(`[Scraper] Selector '${jobCardSelector}' not found.`);
      await browser.close();
      return res.json([]); 
    }
    
    const html = await page.content();
    await browser.close();
    
    const $ = cheerio.load(html);
    const jobs = [];

    $('div.job_seen_beacon').each((i, el) => {
      const jobCard = $(el);
      const link = jobCard.find('a[id^="sj_"]');
      const title = link.find('span[title]').text().trim();
      const company = jobCard.find('span[data-testid="company-name"]').text().trim();
      
    
      const jobUrlPath = link.attr('href');
     
      const jobUrl = jobUrlPath ? `https://in.indeed.com${jobUrlPath}` : null;
      
      const summary = jobCard.find('div.job-snippet, div[class*="snippet"]').text().trim().replace(/\n/g, ' ');

      if (title && company && jobUrl) {
        jobs.push({ title, company, jobUrl, summary });
      }
    });

    console.log(`[Scraper] Found ${jobs.length} jobs.`);
    res.json(jobs);

  } catch (error) {
    console.error("Scraping error:", error);
    if (browser) await browser.close(); 
    res.status(500).json({ error: 'Failed to scrape jobs. The site may be blocking us.' });
  }
};