document.addEventListener("DOMContentLoaded", () => {
    const pricing = window.PRICING;
    if (!pricing) return;

    const pagesRange = document.getElementById("pagesRange");
    const pagesCountDisplay = document.getElementById("pagesCountDisplay");
    const pagesSummaryRow = document.getElementById("pagesSummaryRow");
    const pagesSummaryText = document.getElementById("pagesSummaryText");
    const pagesPriceText = document.getElementById("pagesPriceText");
    const domainCheck = document.getElementById("domainCheck");
    const domainSummaryRow = document.getElementById("domainSummaryRow");
    const totalPriceDisplay = document.getElementById("totalPriceDisplay");
    const yearlyTotalDisplay = document.getElementById("yearlyTotalDisplay");
    const calcCta = document.getElementById("calcCta");

    if (!pagesRange) return;

    function pagesWord(count) {
        if (count === 1) return "stránka";
        if (count >= 2 && count <= 4) return "stránky";
        return "stránek";
    }

    function formatKc(amount) {
        return amount.toLocaleString("cs-CZ") + " Kč";
    }

    function updateCalculator() {
        const pagesCount = parseInt(pagesRange.value, 10);

        pagesCountDisplay.textContent = `${pagesCount} ${pagesWord(pagesCount)}`;

        const pagesTotal = pagesCount * pricing.pricePerPage;

        if (pagesCount > 0) {
            pagesSummaryRow.classList.remove("hidden");
            pagesSummaryText.textContent = `Dodatečné stránky (${pagesCount}×)`;
            pagesPriceText.textContent = formatKc(pagesTotal);
        } else {
            pagesSummaryRow.classList.add("hidden");
        }

        const totalOneTime = pricing.basePrice + pagesTotal;
        totalPriceDisplay.textContent = formatKc(totalOneTime);

        const domainSelected = domainCheck.checked;
        domainSummaryRow.classList.toggle("hidden", !domainSelected);
        yearlyTotalDisplay.classList.toggle("hidden", !domainSelected);

        if (calcCta) {
            const params = new URLSearchParams({
                pages: String(pagesCount),
                domain: domainSelected ? "1" : "0",
            });
            calcCta.href = `${calcCta.href.split("?")[0]}?${params.toString()}`;
        }
    }

    pagesRange.addEventListener("input", updateCalculator);
    domainCheck.addEventListener("change", updateCalculator);

    updateCalculator();
});
