document.addEventListener("DOMContentLoaded", () => {
    const filterBar = document.getElementById("portfolioFilters");
    const grid = document.getElementById("portfolioGrid");
    if (!filterBar || !grid) return;

    const cards = grid.querySelectorAll(".portfolio-card");
    const chips = filterBar.querySelectorAll(".filter-chip");

    filterBar.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (!chip) return;

        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");

        const filter = chip.dataset.filter;
        cards.forEach((card) => {
            const show = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("hidden", !show);
        });
    });
});
