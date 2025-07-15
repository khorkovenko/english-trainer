function handleTabNavigation(maxIndex) {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            const activeElement = document.activeElement;
            const currentIndex = parseInt(activeElement.getAttribute("tabindex"));

            if (currentIndex === maxIndex && !event.shiftKey) {
                event.preventDefault();
                document.querySelector('[tabindex="1"]').focus();
            }
        }
    });
}

export { handleTabNavigation };