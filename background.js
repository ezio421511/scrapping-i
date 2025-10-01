import { getState, setState, subscribe } from "./libs/state.js";

chrome.runtime.onInstalled.addListener(() => {
  setState({ installedAt: Date.now() });
  console.log("Scrapping I extension installed.");
});
chrome.storage.local.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.appState) {
    state.data = changes.appState.newValue;
    state.listeners.forEach((cb) => cb(state.data));
  }
});

// Example: subscribe to state changes and log them
subscribe((newState) => {
  console.log("[Background] State updated:", newState);
});
