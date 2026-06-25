const fs = require('fs');
const { MongoClient } = require('mongodb');

// === CẤU HÌNH ===
const BASE_URL = 'https://cms.ahamove.com/api/jobs';
const PAGE_SIZE = 10;

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "aha";
const COLLECTION = "jobs";

if (!MONGO_URI) {
  console.error("Lỗi: MONGO_URI chưa được cấu hình trong Environment Variables!");
  process.exit(1);
}

const HEADERS = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
  "authorization": "Bearer afce5b626036d96cee308332ac3e6508391a90ffc2a9246b8631746bde60c575459bfdd3c57cca3b92413e153de9b7201f69ca26e2bc681c1a1067dcf96099047a101e9bcb3fc2ec6b34b694818b97b4acef29edcf9b538f17db6fb186c6c6515196d838da562c85fb8b4f6b0f579f4b1c1049cd421d9a10fc5c5afd850e1c39",
  "priority": "u=1, i",
  "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "Referer": "https://ahamove.com/"
};

const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

// === Markdown Logger ===
class MarkdownLogger {
  constructor(filename) {
    this.stream = fs.createWriteStream(filename, { encoding: 'utf-8' });
    this._closed = false;
    this._printHeader();
  }

  _printHeader() {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
    this.stream.write(`# 📄 Job Crawling Report\n`);
    this.stream.write(`**🕒 Time:** \`${formatted}\`\n\n`);
    this.stream.write(`## 📌 Log Output\n\n\`\`\`log\n`);
  }

  log(message) {
    if (this._closed) return;
    const now = new Date();
    const time = now.toTimeString().substring(0, 8);
    const timestamp = `[${time}]`;
    const formatted = message.trim() ? `${timestamp} ${message}` : message;
    process.stdout.write(formatted + '\n');
    this.stream.write(formatted + '\n');
  }

  close() {
    if (!this._closed) {
      this.stream.write('\n```\n');
      this.stream.end();
      this._closed = true;
    }
  }
}

const logger = new MarkdownLogger('README.md');

function log(message) {
  logger.log(message);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === CRAWLING FUNCTIONS ===
async function crawlPage(page) {
  try {
    const params = new URLSearchParams({
      'populate': '*',
      'pagination[page]': page,
      'pagination[pageSize]': PAGE_SIZE,
      '_q': '',
      'sort': 'publishedAt:DESC'
    });

    const response = await fetch(`${BASE_URL}?${params}`, { headers: HEADERS });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    log(`✓ Crawled page ${page} - Found ${data.data.length} items`);
    return data;
  } catch (e) {
    log(`✗ Error crawling page ${page}: ${e.message}`);
    return null;
  }
}

async function crawlWithRetry(page, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await crawlPage(page);
    if (result) return result;
    if (attempt < maxRetries) {
      log(`🔄 Retrying page ${page} (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(attempt * 1000);
    }
  }
  log(`❌ Failed to crawl page ${page} after ${maxRetries} attempts`);
  return null;
}

async function crawlAllPages() {
  log('🚀 Starting to crawl all pages...\n');
  const allData = [];

  try {
    const firstPageData = await crawlWithRetry(1);
    if (!firstPageData) {
      log('❌ Failed to fetch first page');
      return [];
    }

    const pagination = firstPageData.meta.pagination;
    const totalPages = pagination.pageCount;
    const totalItems = pagination.total;

    log(`📊 Total items: ${totalItems}`);
    log(`📄 Total pages: ${totalPages}`);
    log(`📦 Page size: ${PAGE_SIZE}\n`);

    allData.push(...firstPageData.data);

    for (let page = 2; page <= totalPages; page++) {
      const pageData = await crawlWithRetry(page);
      if (pageData && pageData.data) {
        allData.push(...pageData.data);
      }
      await sleep(100);
    }

    log(`\n✅ Successfully crawled all ${totalPages} pages`);
    log(`📊 Total items collected: ${allData.length}`);
    displayStatistics(allData);
    return allData;
  } catch (error) {
    log(`❌ Error during crawling: ${error.message}`);
    return [];
  }
}

function displayStatistics(data) {
  log('\n📈 STATISTICS:');
  log('================');
  if (data.length === 0) {
    log('No data to analyze');
    return;
  }

  const attributesCount = {};
  for (const item of data) {
    if (item.attributes) {
      for (const key of Object.keys(item.attributes)) {
        attributesCount[key] = (attributesCount[key] || 0) + 1;
      }
    }
  }

  log(`📊 Total jobs: ${data.length}`);
  log('📋 Available attributes:');
  for (const [key, count] of Object.entries(attributesCount)) {
    log(`   - ${key}: ${count} items`);
  }
}

// === MONGODB FUNCTIONS ===
async function connectMongodb() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    const db = client.db(DB_NAME);
    const jobsCollection = db.collection(COLLECTION);
    log("✅ Successfully connected to MongoDB");
    return { client, db, jobsCollection };
  } catch (e) {
    log(`❌ Error connecting to MongoDB: ${e.message}`);
    return { client: null, db: null, jobsCollection: null };
  }
}

function normalizeApplication(app) {
  const attr = app.attributes;
  // Lưu toàn bộ data trả về, thêm tracking fields
  return {
    application_id: app.id,
    ...attr,
    is_new: true,
    crawled_at: today
  };
}

function normalizeJob(jobRaw) {
  const attr = jobRaw.attributes;
  const jobApplications = [];

  if (attr.job_applications && attr.job_applications.data) {
    for (const app of attr.job_applications.data) {
      jobApplications.push(normalizeApplication(app));
    }
  }

  // Lưu toàn bộ data trả về, ghi đè job_applications bằng bản normalized
  return {
    ...attr,
    id_job: attr.id_job,
    crawled_at: today,
    first_seen_at: today,
    job_applications: jobApplications
  };
}

async function saveOrUpdateJob(jobRaw, jobsCollection) {
  const jobId = jobRaw.attributes.id_job;
  const existing = await jobsCollection.findOne({ id_job: jobId });
  const jobDoc = normalizeJob(jobRaw);

  if (!existing) {
    log(`[+] Thêm job mới: ${jobId} với ${jobDoc.job_applications.length} ứng viên`);
    await jobsCollection.insertOne(jobDoc);
  } else {
    jobDoc.first_seen_at = existing.first_seen_at;

    const existingAppIds = new Set(
      (existing.job_applications || []).map(app => app.application_id)
    );

    const newApplications = jobDoc.job_applications.filter(
      app => !existingAppIds.has(app.application_id)
    );

    const allApplications = [...(existing.job_applications || []), ...newApplications];
    jobDoc.job_applications = allApplications;
    jobDoc.is_new = jobRaw.attributes.updatedAt !== (existing.updatedAt || existing.updated_at);

    await jobsCollection.updateOne({ id_job: jobId }, { $set: jobDoc });

    if (newApplications.length > 0) {
      log(`[~] Cập nhật job: ${jobId} - Thêm ${newApplications.length} ứng viên mới`);
    } else {
      log(`[~] Cập nhật job: ${jobId} - Không có ứng viên mới`);
    }
  }
}

async function saveJobsToMongodb(jobList) {
  const { client, db, jobsCollection } = await connectMongodb();
  if (!jobsCollection) {
    log("❌ Cannot connect to MongoDB");
    return;
  }

  try {
    log(`\n🔄 Saving ${jobList.length} jobs to MongoDB...`);
    for (const job of jobList) {
      await saveOrUpdateJob(job, jobsCollection);
    }
    log("✅ Successfully saved all jobs to MongoDB");
    await countNewApplications(jobsCollection);
  } catch (e) {
    log(`❌ Error saving to MongoDB: ${e.message}`);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function countNewApplications(jobsCollection) {
  try {
    let total = 0;
    const cursor = jobsCollection.find({ "job_applications.crawled_at": today });
    for await (const job of cursor) {
      total += (job.job_applications || []).filter(a => a.is_new).length;
    }
    log(`\n📊 Tổng ứng viên mới hôm nay (${today}): ${total}`);
  } catch (e) {
    log(`❌ Error counting applications: ${e.message}`);
  }
}

async function appendApplications(idJob, applicationsRaw, jobsCollection) {
  const job = await jobsCollection.findOne({ id_job: idJob });
  if (!job) {
    log(`[!] Job ${idJob} không tồn tại.`);
    return;
  }

  const existingIds = new Set(
    (job.job_applications || []).map(a => a.application_id)
  );

  const newApps = [];
  for (const app of (applicationsRaw.data || [])) {
    if (!existingIds.has(app.id)) {
      const normalizedApp = normalizeApplication(app);
      newApps.push(normalizedApp);
    }
  }

  if (newApps.length > 0) {
    await jobsCollection.updateOne(
      { id_job: idJob },
      { $push: { job_applications: { $each: newApps } } }
    );
    log(`[+] Đã thêm ${newApps.length} ứng viên mới vào job ${idJob}`);
  } else {
    log(`[-] Không có ứng viên mới cho job ${idJob}`);
  }
}

// === MAIN FUNCTION ===
async function main() {
  log("🚀 Starting crawl and save process...");

  const jobList = await crawlAllPages();
  if (!jobList || jobList.length === 0) {
    log("❌ No data crawled, exiting...");
    return;
  }

  await saveJobsToMongodb(jobList);
  log("\n🎉 Process completed successfully!");
}

// === ENTRY POINT ===
(async () => {
  try {
    await main();
  } catch (e) {
    if (e.message === 'Process interrupted') {
      log("\n⚠️ Process interrupted by user");
    } else {
      log(`\n💥 Process failed: ${e.message}`);
    }
  } finally {
    logger.close();
  }
})();
