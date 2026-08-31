document.addEventListener("DOMContentLoaded", () => {

    // Smooth scrolling for same-page anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.pushState(null, "", targetId);
        });
    });


    // Keep copyright year current automatically
    const yearElements = document.querySelectorAll("[data-current-year]");

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

});