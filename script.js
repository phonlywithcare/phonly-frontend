// ================= POPUP HANDLING ================= //
const loginPopup = document.getElementById("loginPopup");
const bookingPopup = document.getElementById("bookingPopup");

const openLogin = document.getElementById("openLogin");
const openBooking = document.getElementById("openBooking");

// Open Login Popup
openLogin?.addEventListener("click", () => {
  loginPopup.style.display = "flex";
});

// Open Booking Popup
openBooking?.addEventListener("click", () => {
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

// ================= TOAST ================= //
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => { toast.style.opacity = 1; }, 100);

  setTimeout(() => { 
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}


// ================= BOOKING SUBMIT (CONNECTED TO BACKEND) ================= //
const bookingBtn = bookingPopup?.querySelector(".primary-btn");

if (bookingBtn) {
  bookingBtn.addEventListener("click", async () => {
    
    const inputs = bookingPopup.querySelectorAll("input, select");

    const data = {
      name: inputs[0].value,
      phone: inputs[1].value,
      device: inputs[2].value,
      model: inputs[3].value,
      service: inputs[4].value,
      address: inputs[5].value,
      datetime: inputs[6].value,
    };

    try {
      const res = await fetch("https://backendwithapi.onrender.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      showToast("Booking Confirmed! ID: " + result.bookingId);
      bookingPopup.style.display = "none";

    } catch (err) {
      showToast("Server Error");
    }
  });
}


// ================= STAR RATING ================= //
let selectedRating = 5;

const stars = document.querySelectorAll("#starRating .star");

stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);

    stars.forEach((s) => s.classList.remove("active"));
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  });
});

// ================= REVIEW SUBMIT ================= //
const reviewForm = document.getElementById("reviewForm");

reviewForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("rName").value.trim();
  const message = document.getElementById("rMessage").value.trim();

  if (!name || !message) {
    showToast("Please fill all fields");
    return;
  }

  const data = {
    name,
    message,
    rating: selectedRating,
  };

  try {
    const res = await fetch(
      "https://backendwithapi.onrender.com/api/reviews",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) throw new Error("Failed");

    showToast("Review submitted successfully ⭐");

    reviewForm.reset();
    stars.forEach((s) => s.classList.remove("active"));
    selectedRating = 5;

  } catch (err) {
    showToast("Server error");
  }
});



