const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

export const animateScrollToSelected = (carouselElement, selectedIndex) => {
    if (carouselElement) {
        const selectedElement = carouselElement.children[selectedIndex];
        if (selectedElement) {
            const targetScrollLeft =
                selectedElement.offsetLeft -
                carouselElement.offsetWidth / 2 +
                selectedElement.offsetWidth / 2;

            const startScrollLeft = carouselElement.scrollLeft;
            const distance = targetScrollLeft - startScrollLeft;
            const duration = 600;
            let start;

            const step = (timestamp) => {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);

                carouselElement.scrollLeft =
                    startScrollLeft + distance * easeInOutCubic(progress);

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };

            window.requestAnimationFrame(step);
        }
    }
};
