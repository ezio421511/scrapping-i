// Basic state layer for extension (shared via chrome.storage.local)
export const state = {
  data: {},
  listeners: [],
  initialized: false,
};

function notifyAll() {
  state.listeners.forEach((cb) => cb(state.data));
}

export function setState(newState) {
  // Always fetch latest before setting to avoid race conditions
  getState().then((current) => {
    state.data = { ...current, ...newState };
    chrome.storage.local.set({ appState: state.data }, notifyAll);
  });
}

export function getState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["appState"], (result) => {
      state.data = result.appState || {};
      resolve(state.data);
      if (!state.initialized) {
        state.initialized = true;
        notifyAll();
      }
    });
  });
}

export function subscribe(cb) {
  state.listeners.push(cb);
  // Immediately call with current state
  getState().then(cb);
}

// Listen for changes from other extension parts
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.appState) {
    state.data = changes.appState.newValue;
    notifyAll();
  }
});
