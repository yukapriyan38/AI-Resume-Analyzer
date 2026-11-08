const axios = require("axios");

/**
 * Fetches jobs from the Adzuna API for a given search query.
 * Docs: https://developer.adzuna.com/
 */
const searchAdzuna = async (query, location = "", page = 1) => {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) return [];

  try {
    const country = "in"; // adjust country code as needed
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;

    const { data } = await axios.get(url, {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what: query,
        where: location || undefined,
        results_per_page: 20,
      },
      timeout: Number(process.env.EXTERNAL_API_TIMEOUT_MS || 8000),
    });

    return (data.results || []).map((job) => ({
      jobTitle: job.title,
      company: job.company?.display_name || "Unknown",
      companyLogo: "",
      location: job.location?.display_name || "",
      salary: job.salary_min
        ? `${Math.round(job.salary_min)} - ${Math.round(job.salary_max || job.salary_min)}`
        : "",
      experience: "",
      employmentType: job.contract_time || "",
      description: job.description || "",
      applyUrl: job.redirect_url,
      source: "adzuna",
      externalId: job.id,
    }));
  } catch (error) {
    console.error("Adzuna API error:", error.message);
    return [];
  }
};

/**
 * Fetches jobs from the JSearch API (RapidAPI) for a given search query.
 * Docs: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 */
const searchJSearch = async (query, location = "") => {
  if (!process.env.JSEARCH_API_KEY) return [];

  try {
    const { data } = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: { query: `${query} ${location}`.trim(), page: 1, num_pages: 1 },
      headers: {
        "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      timeout: Number(process.env.EXTERNAL_API_TIMEOUT_MS || 8000),
    });

    return (data.data || []).map((job) => ({
      jobTitle: job.job_title,
      company: job.employer_name || "Unknown",
      companyLogo: job.employer_logo || "",
      location: job.job_city
        ? `${job.job_city}, ${job.job_country}`
        : job.job_country || "",
      salary:
        job.job_min_salary && job.job_max_salary
          ? `${job.job_min_salary} - ${job.job_max_salary}`
          : "",
      experience: job.job_required_experience?.required_experience_in_months
        ? `${Math.round(job.job_required_experience.required_experience_in_months / 12)}+ years`
        : "",
      employmentType: job.job_employment_type || "",
      description: job.job_description || "",
      applyUrl: job.job_apply_link,
      source: "jsearch",
      externalId: job.job_id,
    }));
  } catch (error) {
    console.error("JSearch API error:", error.message);
    return [];
  }
};

/**
 * Runs searches across multiple queries and providers, then de-duplicates
 * results by applyUrl / externalId.
 */
const searchJobs = async (queries, location = "") => {
  const allResults = [];

  for (const query of queries) {
    const [adzunaResults, jsearchResults] = await Promise.all([
      searchAdzuna(query, location),
      searchJSearch(query, location),
    ]);
    allResults.push(...adzunaResults, ...jsearchResults);
  }

  const seen = new Set();
  const deduped = [];
  for (const job of allResults) {
    const key = job.externalId || job.applyUrl;
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(job);
    }
  }

  return deduped;
};

module.exports = { searchAdzuna, searchJSearch, searchJobs };
