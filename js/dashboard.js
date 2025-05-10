const countries = [
  "Cameroon",
  "Nigeria",
  "Kenya",
  "Ghana",
  "South Africa",
  "Egypt",
  "Morocco",
  "Ivory Coast",
  "Senegal",
  "Tanzania",
  "Uganda",
  "Algeria",
  "Zambia",
  "Rwanda",
  "Botswana",
];

const select = document.querySelector("#select");
console.log(select);

countries.forEach((country, index) => {
  const option = document.createElement("option");
  option.value = country;
  option.textContent = country;
  if (index === 0) option.selected = true; // Cameroon default
  select.appendChild(option);
});

// cancel transcation
const cancelBtn = document.querySelector("#cancel-btn");

cancelBtn.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal");
  const form = document.querySelector(".makepayment-form");
  modals.forEach((modal) => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    // form.reset();
  });
});

// form validation

// !page loader
const loader = document.querySelector(".page-loader");

// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const MIN_TIME = 800; // in ms
  const start = Date.now();

  window.addEventListener("load", () => {
    const elapsed = Date.now() - start;
    const delay = Math.max(MIN_TIME - elapsed, 0);

    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => loader.remove(), 300);
    }, delay);
  });
});

// active link
