const backend = "https://backendwithapi.onrender.com";


// ================= POPUP HANDLING ================= //
const loginPopup = document.getElementById("loginPopup");
const bookingPopup = document.getElementById("bookingPopup");

const openLogin = document.getElementById("openLogin");
const openBooking = document.getElementById("openBooking");

// Open Login Popup
openLogin.addEventListener("click", () => {
  loginPopup.style.display = "flex";
});

// Open Booking Popup
openBooking.addEventListener("click", () => {
  bookingPopup.style.display = "flex";
});

// Close Popups
const closeButtons = document.querySelectorAll("[data-close]");
closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    loginPopup.style.display = "none";
    bookingPopup.style.display = "none";
  });
});

// Close when clicking outside box
window.addEventListener("click", (e) => {
  if (e.target === loginPopup) loginPopup.style.display = "none";
  if (e.target === bookingPopup) bookingPopup.style.display = "none";
});

// ================= SCROLL ANIMATION ================= //
const revealElements = document.querySelectorAll(".service-card, .review-card, .hero-text, .hero-img");

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Initialize hidden state
revealElements.forEach((el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(40px)";
  el.style.transition = "0.6s ease";
});

// ================= TOAST NOTIFICATION ================= //
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = 1;
    toast.style.transform = "translateY(0)";
  }, 100);

  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Example: show toast when booking is confirmed
const bookingBtn = bookingPopup?.querySelector(".primary-btn");
if (bookingBtn) {
  bookingBtn.addEventListener("click", () => {
    showToast("Booking Confirmed!");
    bookingPopup.style.display = "none";
  });
}

// --- Responsive nav toggle ---
(function () {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!menuToggle || !navLinks) return;

  // create overlay (so clicking outside closes menu)
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    overlay.classList.add('show');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    overlay.classList.remove('show');
  }

  menuToggle.addEventListener('click', function (e) {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) closeMenu(); else openMenu();
  });

  // close when clicking overlay or any nav link
  overlay.addEventListener('click', closeMenu);
  navLinks.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName === 'A' || target.classList.contains('login-btn')) {
      closeMenu();
    }
  });

  // close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // On resize — if moving to wide screen ensure menu closed
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });
})();




// ================= ADD REVIEW =================
const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");

reviewForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("rName").value;
  const msg = document.getElementById("rMessage").value;

  // Create new review card
  const card = document.createElement("div");
  card.classList.add("review-card", "big", "new-review");

  card.innerHTML = `
    <div class="stars">★★★★★</div>
    <p>“${msg}”</p>
    <h4>- ${name}</h4>
  `;

  reviewList.prepend(card);

  reviewForm.reset();
});

// Robust review + star script
document.addEventListener("DOMContentLoaded", () => {
  console.log("Review script loaded.");

  // Helper: find or create reviewList container
  let reviewList = document.getElementById("reviewList");
  if (!reviewList) {
    // try older naming or create one under .reviews
    reviewList = document.querySelector(".review-grid") || document.querySelector(".reviews .review-grid");
    if (reviewList) {
      reviewList.id = "reviewList";
      console.warn("reviewList was missing — assigned id to existing .review-grid.");
    } else {
      // create a reviewList at end of reviews section or body fallback
      const reviewsSection = document.querySelector(".reviews") || document.body;
      reviewList = document.createElement("div");
      reviewList.id = "reviewList";
      reviewList.className = "review-grid big-review";
      reviewsSection.appendChild(reviewList);
      console.warn("No .review-grid found — created #reviewList and appended to reviews section or body.");
    }
  }

  // Helper: find form or tell user what to add
  let reviewForm = document.getElementById("reviewForm");
  if (!reviewForm) {
    // try to find a form by class
    reviewForm = document.querySelector("form.review-form") || document.querySelector("form");
    if (reviewForm) {
      reviewForm.id = "reviewForm";
      console.warn("reviewForm id was missing — assigned id to existing form.");
    } else {
      console.error("No review form found. Please add a form with id='reviewForm'.");
      return;
    }
  }

  // Find name and message inputs (try multiple fallbacks)
  const rName = document.getElementById("rName") || reviewForm.querySelector("input[name='name']") || reviewForm.querySelector("input[type='text']");
  const rMessage = document.getElementById("rMessage") || reviewForm.querySelector("textarea[name='message']") || reviewForm.querySelector("textarea");

  if (!rName || !rMessage) {
    console.error("Name or message fields not found. Ensure inputs are present and have id='rName' and id='rMessage' (or at least a text input and a textarea).");
    return;
  }

  // Find star container: support #starRating or .star-rating; create if absent
  let starContainer = document.getElementById("starRating") || document.querySelector(".star-rating");
  if (!starContainer) {
    // create a star container just above the first input
    starContainer = document.createElement("div");
    starContainer.className = "star-rating";
    starContainer.id = "starRating";
    // inject before name input
    rName.parentNode.insertBefore(starContainer, rName);
    console.warn("Star container not found — created #starRating above name input.");
  } else {
    // ensure it has id for later selection
    if (!starContainer.id) starContainer.id = "starRating";
  }

  // Populate star elements if not present
  let stars = starContainer.querySelectorAll(".star");
  if (!stars || stars.length === 0) {
    starContainer.innerHTML = ""; // clear
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement("i");
      s.className = "star";
      s.setAttribute("data-value", String(i));
      s.setAttribute("role", "button");
      s.setAttribute("aria-label", `${i} star`);
      s.textContent = "★";
      starContainer.appendChild(s);
    }
    stars = starContainer.querySelectorAll(".star");
    console.log("Added 5 star elements to #starRating.");
  }

  // Star rating logic
  let selectedRating = 0;
  function updateStarUI(rating) {
    stars.forEach((s) => {
      const val = parseInt(s.getAttribute("data-value"), 10);
      if (val <= rating) s.classList.add("selected");
      else s.classList.remove("selected");
    });
  }

  stars.forEach((star) => {
    star.style.cursor = "pointer";
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.getAttribute("data-value"), 10);
      updateStarUI(selectedRating);
    });

    // optional hover preview
    star.addEventListener("mouseover", () => {
      const hv = parseInt(star.getAttribute("data-value"), 10);
      updateStarUI(hv);
    });
    star.addEventListener("mouseout", () => {
      updateStarUI(selectedRating);
    });
  });

  // Submit handler
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (rName.value || "").trim();
    const message = (rMessage.value || "").trim();

    if (selectedRating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }
    if (!name || !message) {
      alert("Please enter your name and a review message.");
      return;
    }

    // Create new review card (matches existing structure)
    const newCard = document.createElement("div");
    newCard.className = "review-card big";
    // add left border style consistent with other cards (if you use CSS class, remove inline style)
    newCard.style.borderLeft = "5px solid #18a51a";
    newCard.style.background = "white";
    newCard.style.borderRadius = "14px";
    newCard.style.padding = "18px";
    newCard.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
    newCard.style.marginBottom = "18px";

    // star text
    const starText = "★".repeat(selectedRating);

    newCard.innerHTML = `
      <div class="stars" style="color:#ffb400; font-size:20px; margin-bottom:8px;">${starText}</div>
      <p style="margin:0 0 12px 0;">“${escapeHtml(message)}”</p>
      <h4 style="margin:0; font-weight:600;">- ${escapeHtml(name)}</h4>
    `;

    // prepend to reviewList
    reviewList.prepend(newCard);

    // reset form and stars
    reviewForm.reset();
    selectedRating = 0;
    updateStarUI(0);

    console.log("New review added:", { name, message, rating: selectedRating });
  });

  // small HTML escape to avoid accidental markup
  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

}); // DOMContentLoaded end



// ================= MOBILE NAV (Optional Future Update) ================= //
// Add menu animations or mobile nav if needed

