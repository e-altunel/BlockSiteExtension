document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit").addEventListener("click", banSite);
  document.getElementById("clear").addEventListener("click", clear);
  updateList();
});

function updateList() {
  chrome.storage.local.get("banned_sites", function (banned_sites_obj) {
    const banned_sites_list = document.getElementById("banned-list");
    banned_sites_list.innerHTML = "";
    const banned_sites = banned_sites_obj.banned_sites;
    console.log(banned_sites);
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
}

function banSite() {
  console.log("ban site");
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
