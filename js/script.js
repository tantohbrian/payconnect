// responsive nav
const nav = document.querySelector("#nav");
const bars = document.querySelector("#bars");
function toggleNav() {
  nav.classList.toggle("active");
}
bars.addEventListener("click", () => {
  toggleNav();
});
