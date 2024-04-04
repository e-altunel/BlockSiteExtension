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
        if (!isPrev) {
          document.body.outerHTML = `<body
              style='margin: 0; padding: 0; background: black; display: flex; justify-content: center; align-items: center; height: 100vh;'>
            <h1 style='color: white; text-align: center; font-size: 3em; background:black; margin:0;'>Site is banned, fuck you</h1></body>`;
        }
        isBanned = true;
        isPrev = true;
        break;
      }
    }
    if (!isBanned && isPrev) {
      isPrev = false;
      chrome.runtime.sendMessage({ message: "Reload" });
    }
  });
}, 2000);

setInterval(() => {
  chrome.storage.local.set({ current_site: current_url }).then(() => {});
}, 2000);
