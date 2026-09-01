document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const formPagesRange = document.getElementById("formPagesRange");
    const formPagesDisplay = document.getElementById("formPagesDisplay");
    const domainCheck = document.getElementById("domainCheck");
    const submitBtn = document.getElementById("contactSubmit");
    const statusEl = document.getElementById("formStatus");

    function pagesLabel(val) {
        if (val === 0) return "1 stránka (Pouze Homepage)";
        const word = val === 1 ? "dodatečná stránka" : (val >= 2 && val <= 4 ? "dodatečné stránky" : "dodatečných stránek");
        return `Homepage + ${val} ${word}`;
    }

    if (formPagesRange && formPagesDisplay) {
        formPagesRange.addEventListener("input", (e) => {
            formPagesDisplay.textContent = pagesLabel(parseInt(e.target.value, 10));
        });

        // Prefill from the pricing calculator's "Poptat tento projekt" link (?pages=N&domain=0|1)
        const params = new URLSearchParams(window.location.search);
        if (params.has("pages")) {
            const pages = Math.min(10, Math.max(0, parseInt(params.get("pages"), 10) || 0));
            formPagesRange.value = String(pages);
            formPagesDisplay.textContent = pagesLabel(pages);
        }
        if (params.get("domain") === "1" && domainCheck) {
            domainCheck.checked = true;
        }
    }

    function showStatus(message, isError) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.classList.remove("hidden", "text-red-400", "text-emerald-400");
        statusEl.classList.add(isError ? "text-red-400" : "text-emerald-400");
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Honeypot — a filled hidden field means a bot filled the form
        if (form.elements.website && form.elements.website.value) {
            return;
        }

        const endpoint = form.dataset.endpoint;
        if (!endpoint || endpoint.includes("REPLACE_WITH")) {
            console.warn("contact-form.js: Site.Params.contactFormEndpoint is not configured yet — see google-apps-script/Code.gs for setup steps.");
            showStatus("Formulář zatím není propojen s doručením. Napište mi prosím přímo na e-mail níže — děkuji za pochopení.", true);
            return;
        }

        const payload = {
            name: form.elements.name.value,
            email: form.elements.email.value,
            phone: form.elements.phone.value,
            clientType: form.elements.clientType.value,
            pages: form.elements.pages.value,
            domain: domainCheck && domainCheck.checked,
            contentReady: form.elements.contentReady && form.elements.contentReady.checked,
            message: form.elements.message.value,
        };

        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-60", "cursor-not-allowed");

        // Apps Script Web Apps don't support CORS preflight for JSON requests,
        // so this uses no-cors + text/plain to avoid the preflight — the
        // response is opaque, so we optimistically report success here and
        // rely on the Apps Script's own email notification as confirmation.
        fetch(endpoint, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(payload),
        })
            .then(() => {
                form.reset();
                showStatus("Děkuji za poptávku! Ozvu se vám co nejdříve.", false);
            })
            .catch(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-60", "cursor-not-allowed");
                showStatus("Odeslání se nezdařilo. Zkuste to prosím znovu nebo mi napište přímo na e-mail.", true);
            });
    });
});
