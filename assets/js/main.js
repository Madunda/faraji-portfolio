/* Portfolio interactions */
const menuButton = document.getElementById("menu-toggle");
const navigation = document.getElementById("main-nav");
const themeButton = document.getElementById("theme-toggle");
const themeIcon = themeButton?.querySelector(".theme-icon");
const themeLabel = themeButton?.querySelector(".theme-label");
const yearElement = document.getElementById("year");
const rootElement = document.documentElement;

function setTheme(theme) {
    rootElement.dataset.theme = theme;
    const darkMode = theme === "dark";

    if (themeIcon) {
        themeIcon.textContent = darkMode ? "☀" : "☾";
    }

    if (themeLabel) {
        themeLabel.textContent = darkMode ? "Light mode" : "Dark mode";
    }

    if (themeButton) {
        themeButton.setAttribute(
            "aria-label",
            darkMode ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
        themeColor.setAttribute("content", darkMode ? "#0d1720" : "#f7f8fa");
    }
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem("portfolio-theme");
} catch (error) {
    savedTheme = null;
}

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

setTheme(savedTheme || preferredTheme);

themeButton?.addEventListener("click", () => {
    const nextTheme = rootElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    try {
        localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
        // The selected theme remains active for the current page session.
    }
});

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
        menuButton.innerHTML = isOpen
            ? '<span aria-hidden="true">✕</span> Close'
            : '<span aria-hidden="true">☰</span> Menu';
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.innerHTML = '<span aria-hidden="true">☰</span> Menu';
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navigation.classList.contains("open")) {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.innerHTML = '<span aria-hidden="true">☰</span> Menu';
            menuButton.focus();
        }
    });
}

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* Reveal content as it enters the viewport, with a reduced-motion fallback. */
const revealElements = document.querySelectorAll(
    ".section-heading, .expertise-card, .experience-card, .education-item, .project-card, .contact-item"
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("reveal-ready");
    revealElements.forEach((element) => element.classList.add("reveal"));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
}
