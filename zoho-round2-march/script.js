// Solution toggles
document.querySelectorAll('.solution-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        toggleSolution(this);
    });
});

function toggleSolution(button) {
    try {
        const solutionContent = button.nextElementSibling;
        if (!solutionContent) return;

        button.classList.toggle('active');
        solutionContent.classList.toggle('show');

        if (solutionContent.classList.contains('show')) {
            setTimeout(() => {
                solutionContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
    } catch (error) {
        console.error('Error toggling solution:', error);
    }
}