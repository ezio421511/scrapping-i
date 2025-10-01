console.log("Scrapping I: content.js loaded on", window.location.href);
import { extractJobPosting } from "./libs/extractJobs.js";
import callGemini from "./libs/gemini.js";
import { getState, setState, subscribe } from "./libs/state.js";

async function parseJobInfo(jobExtraction) {
  console.log("Parsing job info with LLM...");
  const prompt =
    "Extract a detailed, structured IT job posting from this raw extraction. " +
    "Return JSON with following info (title, type(remote, hybrid, onsite, contract, full-time...), location, company, industry, description, responsibilities, requirements, tech stack, date posted(exact datetime-optional), metadata(exta info)). " +
    "Be as complete as possible and beware unneccessary other postings parts:\n" +
    JSON.stringify(jobExtraction, null, 2);

  const result = await callGemini(prompt);
  return result;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    console.log("Received scrape request from popup.");
    sendResponse({ status: "processing" }); // immediate ack

    setState({ lastScrape: Date.now() });

    const processElement = () => {
      console.log("Extracting job posting from page...");
      return extractJobPosting();
    };

    parseJobInfo(processElement())
      .then((result) => {
        console.log("AI parse success:", result);

        // send AI-generated result back to popup
        chrome.runtime.sendMessage({
          action: "scrapeResult",
          result,
        });
      })
      .catch((err) => {
        console.error("Parsing failed:", err);
        chrome.runtime.sendMessage({
          action: "scrapeResult",
          error: err.message || "Unknown error",
        });
      });

    return true; // important: keep message channel alive for async
  }
});

// Example: subscribe to state changes and log them
subscribe((newState) => {
  console.log("[Content] State updated:", newState);
});
