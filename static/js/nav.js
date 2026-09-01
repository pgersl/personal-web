document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.replace(/\/$/, "");
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "");
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });

    const navCard = document.getElementById("nav-card");
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navIconOpen = document.getElementById("nav-icon-open");
    const navIconClose = document.getElementById("nav-icon-close");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("flex");
            navMenu.classList.toggle("hidden", !isOpen);
            navIconOpen.classList.toggle("hidden", isOpen);
            navIconClose.classList.toggle("hidden", !isOpen);
            navCard.classList.toggle("rounded-full", !isOpen);
            navCard.classList.toggle("rounded-3xl", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => navToggle.click());
        });
    }
});