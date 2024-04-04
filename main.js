document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit").addEventListener("click", banSite);
  document.getElementById("clear").addEventListener("click", clear);
  updateList();
  setInterval(updateList, 2000);
});

function updateList() {
  chrome.storage.local.get("banned_sites", function (banned_sites_obj) {
    const banned_sites_list = document.getElementById("banned-list");
    banned_sites_list.innerHTML = "";
    const banned_sites = banned_sites_obj.banned_sites;
    if (banned_sites.length > 0) {
      for (let i = 0; i < banned_sites.length; i++) {
        const site = banned_sites[i];
        banned_sites_list.innerHTML += `
          <li>${site} <button id="${i}">X</button></li>
        `;
      }
      for (let i = 0; i < banned_sites.length; i++) {
        document.getElementById(i).addEventListener("click", () => {
          removeSite(i);
        });
      }
    } else {
      banned_sites_list.innerHTML = "No sites banned";
    }
  });
  chrome.storage.local.get("current_site").then((result) => {
    if (!result.current_site) {
      document.getElementById("current-site").innerHTML = "No current site";
      return;
    }
    const current_site = result.current_site.split("/")[2];
    if (!current_site) {
      document.getElementById("current-site").innerHTML = "No current site";
      return;
    }
    let newInner = `<li>Current site:<br></li><li> ${current_site}`;
    chrome.storage.local.get("banned_sites").then((banned_sites_obj) => {
      const banned_sites = banned_sites_obj.banned_sites || [];
      let found = false;
      for (let i = 0; i < banned_sites.length; i++) {
        const banned_site = banned_sites[i];
        if (current_site.includes(banned_site)) {
          found = true;
          break;
        }
      }
      if (found) {
        newInner += `<button id="unban">O</button></li>`;
        document.getElementById("current-site").innerHTML = newInner;
        document.getElementById("unban").addEventListener("click", () => {
          unban(current_site);
        });
      } else {
        newInner += `<button id="ban">X</button></li>`;
        document.getElementById("current-site").innerHTML = newInner;
        document.getElementById("ban").addEventListener("click", () => {
          ban(current_site);
        });
      }
    });
  });
}

function banSite() {
  const name = document.getElementById("banned-input").value;
  chrome.storage.local.get("banned_sites").then((result) => {
    const banned_sites = result.banned_sites || [];
    banned_sites.push(name);
    chrome.storage.local.set({ banned_sites: banned_sites }).then(() => {
      updateList();
    });
    window.location.reload();
  });
}

function clear() {
  chrome.storage.local.set({ banned_sites: [] }).then(() => {
    updateList();
  });
}

function removeSite(index) {
  chrome.storage.local.get("banned_sites").then((result) => {
    const banned_sites = result.banned_sites || [];
    banned_sites.splice(index, 1);
    chrome.storage.local.set({ banned_sites: banned_sites }).then(() => {
      updateList();
    });
    window.location.reload();
  });
}

function ban(site) {
  chrome.storage.local.get("banned_sites").then((result) => {
    const banned_sites = result.banned_sites || [];
    banned_sites.push(site);
    chrome.storage.local.set({ banned_sites: banned_sites }).then(() => {
      updateList();
    });
    window.location.reload();
  });
}

function unban(site) {
  chrome.storage.local.get("banned_sites").then((result) => {
    const banned_sites = result.banned_sites || [];
    for (let i = 0; i < banned_sites.length; i++) {
      if (banned_sites[i] === site) {
        banned_sites.splice(i, 1);
        chrome.storage.local.set({ banned_sites: banned_sites }).then(() => {
          updateList();
        });
        break;
      }
    }
  });
}
