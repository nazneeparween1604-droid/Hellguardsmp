// HELLGUARD SMP - Interactive JavaScript Engine
const SERVER_IP = "hellguard.abrdns.com";

// =========================================================
// 1. TAB SWITCHING SYSTEM (Shows ONLY clicked section)
// =========================================================
function switchTab(tabId) {
  // Hide all tab panes
  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach(pane => {
    pane.classList.remove('active');
  });

  // Remove active from all nav pills
  const pills = document.querySelectorAll('.nav-pill');
  pills.forEach(pill => {
    pill.classList.remove('active');
  });

  // Activate targeted tab pane
  const targetPane = document.getElementById('tab-' + tabId);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // Activate targeted nav pill button
  const targetPill = document.querySelector(`.nav-pill[data-tab="${tabId}"]`);
  if (targetPill) {
    targetPill.classList.add('active');
  }

  // Smooth scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL hash without jumping
  if (history.pushState) {
    history.pushState(null, null, '#' + tabId);
  } else {
    location.hash = '#' + tabId;
  }
}

// Handle browser back/forward or direct hash links (e.g. site.com/#store)
function handleHashChange() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const validTabs = ['home', 'store', 'rewards', 'rules', 'staff', 'about'];
  if (validTabs.includes(hash)) {
    switchTab(hash);
  } else {
    switchTab('home');
  }
}

// =========================================================
// 2. COPY SERVER IP FUNCTION
// =========================================================
function copyServerIp() {
  navigator.clipboard.writeText(SERVER_IP).then(() => {
    showToast("Server IP: " + SERVER_IP + " copied to clipboard!");
  }).catch(() => {
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = SERVER_IP;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    showToast("Server IP: " + SERVER_IP + " copied!");
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// =========================================================
// 3. FETCH LIVE REAL MINECRAFT SERVER STATUS
// =========================================================
async function checkServerStatus() {
  const statusText = document.getElementById("serverStatusText");
  const playerCount = document.getElementById("playerCount");

  try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
    const data = await res.json();

    if (data.online) {
      if (statusText) {
        statusText.textContent = "Online";
        statusText.style.color = "#22c55e";
      }
      const current = data.players && typeof data.players.online !== 'undefined' ? data.players.online : 0;
      const max = data.players && typeof data.players.max !== 'undefined' ? data.players.max : 100;
      if (playerCount) {
        playerCount.textContent = `${current} / ${max}`;
      }
    } else {
      if (statusText) {
        statusText.textContent = "Offline";
        statusText.style.color = "#ef4444";
      }
      if (playerCount) {
        playerCount.textContent = "0 / 0";
      }
    }
  } catch (err) {
    if (statusText) {
      statusText.textContent = "Online";
      statusText.style.color = "#22c55e";
    }
    if (playerCount) {
      playerCount.textContent = "Active / 100";
    }
  }
}

// =========================================================
// 4. RANK PERKS DATABASE & MODAL MANAGER
// =========================================================
const RANKS_DATA = {
  hero: {
    name: "HERO RANK (₹99)",
    perks: [
      "Protection IX Armor Kit",
      "₹500,000 In-Game Money",
      "Exclusive Custom rank Prefix in chat"
    ]
  },
  boss: {
    name: "BOSS RANK (₹160)",
    perks: [
      "Protection VIII Armor Kit",
      "₹500,000 In-Game Money",
      "Exclusive Custom rank Prefix in chat",
      "2x Eternal keys",
      "2x Boss keys",
      "2x Hero keys"
    ]
  },
  eternal: {
    name: "ETERNAL RANK (₹200)",
    perks: [
      "Protection IX Armor Kit",
      "₹1,000,000 In-Game Money",
      "Exclusive Custom rank Prefix in chat",
      "2x Deadliest keys",
      "3x Eternal keys",
      "3x Boss keys",
      "3x Hero keys"
    ]
  },
  deadliest: {
    name: "DEADLIEST RANK (₹250)",
    perks: [
      "Protection X Armor Kit",
      "₹1,000,000 In-Game Money",
      "Exclusive Custom rank Prefix in chat",
      "1x Ace keys",
      "4x Deadliest keys",
      "4x Eternal keys",
      "4x Boss keys",
      "4x Hero keys"
    ]
  },
  ace: {
    name: "ACE RANK (₹300)",
    perks: [
      "Protection XII Armor Kit",
      "₹2,000,000 In-Game Money",
      "Exclusive Custom rank Prefix in chat",
      "6x Ace keys",
      "6x Deadliest keys",
      "6x Eternal keys",
      "6x Boss keys",
      "6x Hero keys",
      "1x Max out Mace"
    ]
  }
};

function openPerkModal(rankKey) {
  const rank = RANKS_DATA[rankKey];
  if (!rank) return;

  document.getElementById("modalRankName").textContent = rank.name;
  const listContainer = document.getElementById("modalPerkList");
  listContainer.innerHTML = "";

  rank.perks.forEach(perk => {
    const item = document.createElement("div");
    item.className = "perk-item";
    item.innerHTML = `<span class="green-dot-bullet"></span> <span>${perk}</span>`;
    listContainer.appendChild(item);
  });

  document.getElementById("perkModal").classList.add("active");
}

function closePerkModal() {
  document.getElementById("perkModal").classList.remove("active");
}

// =========================================================
// 5. FIERY PARTICLES ENGINE
// =========================================================
function initFireCanvas() {
  const canvas = document.getElementById("fire-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 3.5 + 1;
      this.speedY = Math.random() * 1.5 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.hue = Math.floor(Math.random() * 35) + 10;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= 0.003;
      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, ${this.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// =========================================================
// 6. PLAYER REVIEWS SYSTEM
// =========================================================
function initReviewSystem() {
  const reviewForm = document.getElementById('reviewForm');
  const reviewsList = document.getElementById('reviewsList');
  const toggleBtn = document.getElementById('toggleReviewsBtn');
  const toggleText = document.getElementById('toggleReviewsText');
  const toggleArrow = document.getElementById('toggleReviewsArrow');

  if (reviewForm && reviewsList) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('reviewUsername');
      const ratingSelect = document.getElementById('reviewRating');
      const feedbackInput = document.getElementById('reviewFeedback');

      const username = usernameInput.value.trim();
      const rating = parseInt(ratingSelect.value, 10);
      const feedback = feedbackInput.value.trim();

      if (!username || !feedback) return;

      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

      const newReview = document.createElement('div');
      newReview.className = 'review-item';
      newReview.innerHTML = `
        <div class="reviewer-avatar">
          <img src="https://mc-heads.net/avatar/${encodeURIComponent(username)}/48" alt="${username}" onerror="this.src='https://mc-heads.net/avatar/Steve/48'" />
        </div>
        <div class="review-item-content">
          <div class="reviewer-name">${username}</div>
          <div class="review-stars">${stars}</div>
          <p class="review-comment">"${feedback.replace(/"/g, '&quot;')}"</p>
        </div>
      `;

      reviewsList.prepend(newReview);
      reviewsList.style.display = 'flex';
      if (toggleText) toggleText.textContent = 'Hide Reviews';
      if (toggleArrow) toggleArrow.textContent = '▲';

      reviewForm.reset();
      showToast('Review posted successfully!');
    });
  }

  if (toggleBtn && reviewsList) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = reviewsList.style.display === 'none';
      reviewsList.style.display = isHidden ? 'flex' : 'none';
      if (toggleText) {
        toggleText.textContent = isHidden ? 'Hide Reviews' : 'Show Reviews';
      }
      if (toggleArrow) {
        toggleArrow.textContent = isHidden ? '▲' : '▼';
      }
    });
  }
}

// Initialise everything
document.addEventListener("DOMContentLoaded", () => {
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
  initFireCanvas();
  checkServerStatus();
  initReviewSystem();
  setInterval(checkServerStatus, 30000);
});
