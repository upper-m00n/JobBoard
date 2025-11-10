// ✅ FIX 1: Correct puppeteer import
const puppeteer = require('puppeteer-extra');
const TrackedJob = require('../models/TrackedJob');
const cheerio = require('cheerio');

/**
 * Helper function to scrape the full job description from a job's URL
 */
const scrapeJobDescription = async (jobUrl) => {
  let browser = null;
  console.log(`[Scraper] started for JD from :${jobUrl}`);

  try {
    // ✅ FIX 2: Add robust launch arguments
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    );
    
    // This 'goto' will now work because 'jobUrl' is an absolute path
    await page.goto(jobUrl, { waitUntil: 'networkidle2' });

    const descriptionSelector = 'div#jobDescriptionText';
    await page.waitForSelector(descriptionSelector, { timeout: 10000 });

    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);
    const jobDescription = $(descriptionSelector).text().trim();
    
    console.log("[Scraper] Successfully scraped JD.");
    return jobDescription;
  } catch (error) {
    console.error(`[Scraper] Failed to scrape JD: ${error.message}`);
    if (browser) await browser.close();
    return "Could not scrape job description. Please copy and paste it manually.";
  }
};

const saveJob = async (req, res) => {
  try {
    const { jobTitle, companyName, originalUrl, summary } = req.body;

    // This will now receive a full, valid URL
    const fullJobDescription = await scrapeJobDescription(originalUrl);

    const job = new TrackedJob({
      userId: req.user.id,
      jobTitle,
      companyName,
      originalUrl,
      jobDescription: fullJobDescription || summary
    });
    
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
    console.log("Error while saving job", error);
  }
};

const getTrackedJob = async (req, res) => {
  try {
    const jobs = await TrackedJob.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
    console.log("error while fetching jobs for logged in user", error);
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await TrackedJob.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
    console.log("error while updating status", error);
  }
};


const getTrackedJobById = async (req, res) => {
  try {
    const job = await TrackedJob.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTrackedJob = async (req,res)=>{

    try {
        await TrackedJob.findOneAndDelete({
            _id:req.params.id
        })

        
        res.json({message:"Job deleted successfully"})
    } catch (error) {
        console.error("Error deleting job by ID:", error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { updateJobStatus, getTrackedJob, saveJob, getTrackedJobById,deleteTrackedJob };