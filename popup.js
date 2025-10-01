import { getState, setState, subscribe } from "./libs/state.js";

document.getElementById("scrape").addEventListener("click", async () => {
  setState({ lastAction: "scrape_clicked", timestamp: Date.now() });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Show a loading state right away
  document.getElementById("output").textContent = "⏳ Processing...";

  // Send scrape request
  chrome.tabs.sendMessage(tab.id, { action: "scrape" }, (response) => {
    if (chrome.runtime.lastError) {
      document.getElementById("output").textContent =
        "❌ Error: " + chrome.runtime.lastError.message;
      return;
    }

    if (response?.status === "processing") {
      // Wait for the async AI result
      chrome.runtime.onMessage.addListener(function handleMessage(message) {
        if (message.action === "scrapeResult") {
          document.getElementById("output").textContent = message.error
            ? "❌ Error: " + message.error
            : JSON.stringify(message.result, null, 2);

          // remove this listener after handling once
          chrome.runtime.onMessage.removeListener(handleMessage);
        }
      });
    }
  });
});

// Example: subscribe to state changes and log them
subscribe((newState) => {
  console.log("[Popup] State updated:", newState);
});
