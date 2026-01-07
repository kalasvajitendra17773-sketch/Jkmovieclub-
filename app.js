"use strict";

/* ================= CINEMATIC AUTO THEME ENGINE ================= */
(function autoCinematicTheme() {
  
  const themes = [
    { bg1: "#050814", bg2: "#02030a", accent: "#ff4d5a" }, // Netflix red
    { bg1: "#06080f", bg2: "#000000", accent: "#ff7a18" }, // Prime orange
    { bg1: "#040612", bg2: "#000000", accent: "#4da6ff" }, // Disney blue
    { bg1: "#02060c", bg2: "#000000", accent: "#00e5a8" }, // Teal neon
    { bg1: "#070014", bg2: "#000000", accent: "#b97cff" } // Purple cinema
  ];
  
  const t = themes[Math.floor(Math.random() * themes.length)];
  const root = document.documentElement;
  
  root.style.setProperty("--bg1", t.bg1);
  root.style.setProperty("--bg2", t.bg2);
  root.style.setProperty("--accent", t.accent);
  
  /* convert hex → rgba glow */
  const hex = t.accent.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  root.style.setProperty(
    "--accent-glow",
    `rgba(${r},${g},${b},0.45)`
  );
  
})();

/* ================= SCROLL REVEAL ================= */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  
  revealEls.forEach(el => io.observe(el));
}

/* ================= HEADER SMART HIDE ================= */
const header = document.querySelector(".header");
let lastScroll = 0;

if (header) {
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    
    if (y > lastScroll && y > 90) {
      header.style.transform = "translateY(-110%)";
    } else {
      header.style.transform = "translateY(0)";
    }
    lastScroll = y;
  });
}

/* ================= CARD CINEMATIC TILT ================= */
document.querySelectorAll(".card").forEach(card => {
  
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    
    const rx = -(y / r.height - 0.5) * 10;
    const ry = (x / r.width - 0.5) * 10;
    
    card.style.transform =
      `perspective(900px)
       rotateX(${rx}deg)
       rotateY(${ry}deg)
       translateY(-6px)
       scale(1.02)`;
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)";
  });
  
});

/* ================= SEARCH + FILTER (DYNAMIC SAFE) ================= */
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filters span");

let activeFilter = "all";

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter || "all";
    filterMovies();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", filterMovies);
}

function filterMovies() {
  const cards = document.querySelectorAll(".card");
  const q = searchInput ? searchInput.value.toLowerCase() : "";
  let visible = 0;
  
  cards.forEach(card => {
    const title = card.dataset.title?.toLowerCase() || "";
    const cat = card.dataset.category || "";
    
    const matchText = title.includes(q);
    const matchCat =
      activeFilter === "all" || cat === activeFilter;
    
    if (matchText && matchCat) {
      card.style.display = "block";
      visible++;
    } else {
      card.style.display = "none";
    }
  });
  
  const noResult = document.getElementById("noResult");
  if (noResult) {
    noResult.style.display = visible ? "none" : "block";
  }
}

/* ================= BASIC HARDENING ================= */
document.addEventListener("contextmenu", e => e.preventDefault());