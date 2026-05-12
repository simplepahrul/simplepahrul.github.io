/* =========================
   SCROLL RESTORATION
========================= */

window.history.scrollRestoration = "manual";

window.onload = () => {
  window.scrollTo(0, 0);
};

/* =========================
   CONFIG
========================= */

const username = "simplepahrul";

/* =========================
   MODE TOGGLE
========================= */

function toggleMode() {
  const body = document.body;

  const modeText = document.getElementById("modeText");
  const modeIcon = document.getElementById("modeIcon");

  const isGithub = body.dataset.mode === "github";

  body.dataset.mode = isGithub ? "strava" : "github";

  modeText.innerText = isGithub ? "GitHub Mode" : "Strava Mode";
  modeIcon.innerText = isGithub ? "🌙" : "☀️";
}

/* =========================
   FETCH HELPER
========================= */

async function fetchGitHub(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("GitHub API error");
  }

  return res.json();
}

/* =========================
   PROFILE
========================= */

async function loadGithubProfile() {
  try {
    const data = await fetchGitHub(`https://api.github.com/users/${username}`);

    const githubUrl = data.html_url;

    document.getElementById("githubProfile").innerHTML = `
      <div class="d-flex align-items-start gap-3 flex-wrap">

        <!-- AVATAR -->
        <img
          src="${data.avatar_url}"
          width="85"
          class="rounded-circle"
        />

        <!-- INFO -->
        <div class="flex-grow-1">

          <!-- NAME + USERNAME -->
          <h5 class="mb-0">
            ${data.name || "-"}
          </h5>

          <div class="small muted mb-2">
            @${data.login}
          </div>

          <!-- BIO -->
          <div class="small mb-2">
            ${data.bio || "No bio available"}
          </div>

          <!-- META -->
          <div class="small muted mb-2">
            🏢 ${data.company || "-"} • 📍 ${data.location || "-"}
          </div>

          <!-- STATS -->
          <div class="d-flex flex-wrap gap-3 small mb-2">

            <a href="${githubUrl}?tab=repositories" target="_blank">
              📦 ${data.public_repos} Repos
            </a>

            <a href="https://github.com/${data.login}?tab=followers" target="_blank">
              👥 ${data.followers} Followers
            </a>

            <a href="https://github.com/${data.login}?tab=following" target="_blank">
              👥 ${data.following} Following
            </a>

          </div>

          <!-- LINKS -->
          <div class="small mb-2 d-flex flex-wrap gap-2">

            <a href="${githubUrl}" target="_blank" class="text-decoration-none">
              🔗 github
            </a>

            ${
              data.blog
                ? `<a href="${
                    data.blog.startsWith("http")
                      ? data.blog
                      : "https://" + data.blog
                  }" target="_blank" class="text-decoration-none">
                    🌐 website
                  </a>`
                : `<span class="muted">🌐 no website</span>`
            }

          </div>

        </div>

      </div>
    `;
  } catch (err) {
    document.getElementById("githubProfile").innerHTML =
      `<div class="muted">failed to load GitHub profile 😵</div>`;
  }
}

/* =========================
   REPOSITORIES
========================= */

async function loadGithubRepos() {
  try {
    const repos = await fetchGitHub(
      `https://api.github.com/users/${username}/repos?sort=updated`,
    );

    document.getElementById("githubRepos").innerHTML = repos
      .slice(0, 6)
      .map(
        (repo) => `
          <div class="card p-3 mb-2">

            <div class="d-flex justify-content-between align-items-start mb-2">

              <div>

                <!-- REPO NAME (CLICKABLE) -->
                <a href="${repo.html_url}" target="_blank" class="fw-bold">
                  ${repo.name}
                </a>

                <div class="muted small">
                  ${repo.description || "no description"}
                </div>

              </div>

              <small class="muted">
                ${repo.language || "-"}
              </small>

            </div>

            <small class="muted">
              ⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count}
            </small>

          </div>
        `,
      )
      .join("");
  } catch (err) {
    document.getElementById("githubRepos").innerHTML =
      `<div class="card p-3 muted">gagal load repos 😵</div>`;
  }
}

/* =========================
   SKILLS
========================= */

async function loadGithubSkills() {
  try {
    const repos = await fetchGitHub(
      `https://api.github.com/users/${username}/repos`,
    );

    const skills = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    document.getElementById("githubSkills").innerHTML = Object.entries(skills)
      .map(
        ([lang, count]) => `
            <div class="d-flex justify-content-between mb-2">
              <span>${lang}</span>
              <span class="muted">${count} repo</span>
            </div>
          `,
      )
      .join("");
  } catch (err) {
    document.getElementById("githubSkills").innerHTML =
      `<div class="muted">gagal load skills 😵</div>`;
  }
}

/* =========================
   INIT
========================= */

loadGithubProfile();
loadGithubRepos();
loadGithubSkills();
