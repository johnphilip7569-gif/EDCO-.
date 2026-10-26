// EdWorld Focus Guard - Background Service Worker (Manifest V3)

const BASE_RULE_ID = 1000;

// Listen for messages from content_script.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_FOCUS_LOCK") {
    handleUpdateFocusLock(message.active, message.blockedDomains, message.endTime);
    sendResponse({ success: true });
    return true;
  }
});

async function handleUpdateFocusLock(isActive, blockedDomains, endTime) {
  // Save state
  await chrome.storage.local.set({
    focusActive: isActive,
    blockedDomains: blockedDomains || [],
    endTime: endTime || "",
  });

  // Get existing dynamic rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIdsToRemove = existingRules.map((r) => r.id);

  if (!isActive || !blockedDomains || blockedDomains.length === 0) {
    // Clear all dynamic rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: [],
    });
    console.log("[EdWorld Focus Guard] Restrictions lifted. Happy browsing!");
    return;
  }

  // Create redirect rules for each blocked domain
  const newRules = blockedDomains.map((domain, index) => {
    return {
      id: BASE_RULE_ID + index,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          url: `http://localhost:3000/focus?blocked=${encodeURIComponent(domain)}`,
        },
      },
      condition: {
        urlFilter: `||${domain}`,
        resourceTypes: ["main_frame"],
      },
    };
  });

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIdsToRemove,
    addRules: newRules,
  });

  console.log(`[EdWorld Focus Guard] Enforced ${newRules.length} domain block rules until ${endTime}`);
}

// Alarm to auto-check if session expired
chrome.alarms?.create("check_focus_expiry", { periodInMinutes: 1 });
chrome.alarms?.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "check_focus_expiry") {
    const data = await chrome.storage.local.get(["focusActive", "endTime"]);
    if (data.focusActive && data.endTime) {
      const now = Date.now();
      const end = new Date(data.endTime).getTime();
      if (now >= end) {
        handleUpdateFocusLock(false, [], "");
      }
    }
  }
});
