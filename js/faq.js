function toggleFAQ(element) {
  const faqAnswer = element.nextElementSibling;
  const icon = element.querySelector('.toggle-icon');

  if (faqAnswer.style.display === "block") {
    faqAnswer.style.display = "none";
    icon.textContent = "+";
    element.classList.remove("open");
  } else {
    faqAnswer.style.display = "block";
    icon.textContent = "-";
    element.classList.add("open");
  }
}
