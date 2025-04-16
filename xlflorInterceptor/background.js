// background.js
console.log("✅ xlFlorInterceptor background worker started");

chrome.runtime.onInstalled.addListener(() => {
  console.log("🎉 xlFlorInterceptor installed successfully");
});
