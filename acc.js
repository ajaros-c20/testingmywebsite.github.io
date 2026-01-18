document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    let scale = parseFloat(localStorage.getItem('p-scale')) || 1;

    const minScale = 0.85;
    const maxScale = 2.5;
    const step = 0.2;

    root.style.setProperty('--p-font-scale', scale);

    document.getElementById('text-increase')?.addEventListener('click', () => {
        scale = Math.min(scale + step, maxScale);
        updateScale();
    });

    document.getElementById('text-decrease')?.addEventListener('click', () => {
        scale = Math.max(scale - step, minScale);
        updateScale();
    });

    document.getElementById('reset-text-size')?.addEventListener('click', () => {
        scale = 1;
        updateScale();
    });

    function updateScale() {
        root.style.setProperty('--p-font-scale', scale);
        localStorage.setItem('p-scale', scale);
    }
});
