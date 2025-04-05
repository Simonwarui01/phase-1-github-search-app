document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const toggle = document.getElementById("toggle-search-type");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
  
      const isRepoSearch = toggle.checked;
  
      if (isRepoSearch) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
          headers: {
            "Accept": "application/vnd.github.v3+json"
          }
        })
          .then(response => response.json())
          .then(data => {
            displayRepos(data.items); // Repos come from `items`
            userList.innerHTML = ""; // Clear user results
          })
          .catch(error => {
            console.error("Error fetching repositories:", error);
          });
  
      } else {
        fetch(`https://api.github.com/search/users?q=${query}`, {
          headers: {
            "Accept": "application/vnd.github.v3+json"
          }
        })
          .then(response => response.json())
          .then(data => {
            displayUsers(data.items);
            reposList.innerHTML = ""; // Clear previous repos
          })
          .catch(error => {
            console.error("Error fetching users:", error);
          });
      }
    });
  
    function displayUsers(users) {
      userList.innerHTML = "";
  
      users.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${user.avatar_url}" width="50" height="50">
          <a href="${user.html_url}" target="_blank">${user.login}</a>
          <button data-username="${user.login}">View Repos</button>
        `;
        userList.appendChild(li);
      });
  
      // Attach event listeners for repo fetch buttons
      document.querySelectorAll("button[data-username]").forEach(button => {
        button.addEventListener("click", (e) => {
          const username = e.target.dataset.username;
          fetchRepos(username);
        });
      });
    }
  
    function fetchRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      })
        .then(response => response.json())
        .then(repos => {
          displayRepos(repos);
        })
        .catch(error => {
          console.error("Error fetching repos:", error);
        });
    }
  
    function displayRepos(repos) {
      reposList.innerHTML = "";
  
      repos.forEach(repo => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        reposList.appendChild(li);
      });
    }
  });
  