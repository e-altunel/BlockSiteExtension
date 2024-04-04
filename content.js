const current_url = window.location.href;
let isPrev = false;
let isBanned = false;

setInterval(() => {
  chrome.storage.local.get("banned_sites").then((banned_sites_obj) => {
    const banned_sites = banned_sites_obj.banned_sites || [];
    isBanned = false;
    for (let i = 0; i < banned_sites.length; i++) {
      const banned_site = banned_sites[i];
      if (current_url.includes(banned_site)) {
        document.body.innerHTML =
          "<h1 style='color: red; text-align: center; margin-top: 20%; font-size: 3em;'>Site is banned, fuck you</h1>";
        isBanned = true;
        isPrev = true;
        break;
      }
    }
    if (!isBanned && isPrev) {
      chrome.runtime.sendMessage({ message: "Reload" });
    }
  });
}, 2000);

setInterval(() => {
  chrome.storage.local.set({ current_site: current_url }).then(() => {});
}, 2000);
