const current_url = window.location.href;

chrome.storage.local.get("banned_sites").then((banned_sites_obj) => {
  const banned_sites = banned_sites_obj.banned_sites || [];
  for (let i = 0; i < banned_sites.length; i++) {
    const banned_site = banned_sites[i];
    if (current_url.includes(banned_site)) {
      document.body.innerHTML =
        "<h1 style='color: red; text-align: center; margin-top: 20%; font-size: 3em;'>Site is banned, fuck you</h1>";
      break;
    }
  }
});

chrome.storage.local.set({ current_site: current_url });
