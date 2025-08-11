// Toggle Dark Mode
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Toggle Navbar Menu (Mobile)
document.getElementById("navbar-toggle").addEventListener("click", () => {
  document.getElementById("navbar-menu").classList.toggle("active");
});

// Search Filter
document.getElementById("search").addEventListener("input", function() {
  let filter = this.value.toLowerCase();
  document.querySelectorAll("main section").forEach(sec => {
    let match = sec.textContent.toLowerCase().includes(filter);
    sec.style.display = match ? "" : "none";
  });
});

// Form Scalp Signal
document.getElementById("scanner-form").addEventListener("submit", e => {
  e.preventDefault();
  let symbol = document.getElementById("symbol-input").value.trim();
  if (symbol) {
    window.open(`https://dexscreener.com/?q=${symbol}`, '_blank', 'noopener');
  }
});