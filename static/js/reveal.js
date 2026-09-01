const revealItems = document.querySelectorAll('.reveal-item, .markdown-reveal p');
const groupIndex = new Map();

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealItems.forEach(el => {
    const parent = el.parentElement;
    const step = Number(parent && parent.dataset.revealStep) || 80;
    const index = groupIndex.get(parent) || 0;
    groupIndex.set(parent, index + 1);
    el.style.setProperty('--delay', `${index * step}ms`);
    observer.observe(el);
});
