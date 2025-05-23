const openModalButtons = document.querySelectorAll("[data-modal-target");
const closeModalButtons = document.querySelectorAll("[data-close-button");
const overlay = document.querySelector("#overlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
    // console.log(modal);
  });
});
overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");

  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}
function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}
window.addEventListener("load", () => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  });
});
