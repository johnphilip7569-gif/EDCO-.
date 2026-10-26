// EdWorld Focus Guard - Content Script Bridge

// Respond to ping from website so web app knows extension is installed
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data && event.data.type === "EDWORLD_FOCUS_GUARD_PING") {
    window.postMessage({ type: "EDWORLD_FOCUS_GUARD_PONG", version: "1.0.0" }, "*");
  }

  if (event.data && event.data.type === "EDWORLD_FOCUS_LOCK_UPDATE") {
    chrome.runtime.sendMessage({
      type: "UPDATE_FOCUS_LOCK",
      active: event.data.active,
      blockedDomains: event.data.blockedDomains,
      endTime: event.data.endTime,
    });
  }
});

// Also check localStorage sync periodically
try {
  const sync = localStorage.getItem("edworld_focus_guard_sync");
  if (sync) {
    const data = JSON.parse(sync);
    chrome.runtime.sendMessage({
      type: "UPDATE_FOCUS_LOCK",
      active: data.active,
      blockedDomains: data.blockedDomains,
      endTime: data.endTime,
    });
  }
} catch (_) {}
