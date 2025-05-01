// Initial state
let state = {
    a: 8,
    b: 0,
    c: 0
};

const capacities = {
    a: 8,
    b: 5,
    c: 3
};

// Game stats
let moveCount = 0;
let selectedJug = null;

// DOM elements
const waterA = document.getElementById('water-a');
const waterB = document.getElementById('water-b');
const waterC = document.getElementById('water-c');
const jugAContainer = document.getElementById('jug-a-container');
const jugBContainer = document.getElementById('jug-b-container');
const jugCContainer = document.getElementById('jug-c-container');
const hintBtn = document.getElementById('hint-btn');
const resetBtn = document.getElementById('reset-btn');
const successMessage = document.getElementById('success-message');
const moveCounter = document.getElementById('move-counter');
const efficiencyDisplay = document.getElementById('efficiency');

// Update water levels visually
function updateVisuals() {
    waterA.style.height = `${(state.a / capacities.a) * 100}%`;
    waterB.style.height = `${(state.b / capacities.b) * 100}%`;
    waterC.style.height = `${(state.c / capacities.c) * 100}%`;

    // Update numeric displays
    document.getElementById('amount-a').textContent = `${state.a}L`;
    document.getElementById('amount-b').textContent = `${state.b}L`;
    document.getElementById('amount-c').textContent = `${state.c}L`;

    // Update jug states (enabled/disabled)
    updateJugStates();

    // Check for success condition (4 liters in two jugs)
    const values = Object.values(state);
    const fourLiterCount = values.filter(v => v === 4).length;

    if (fourLiterCount >= 2) {
        showSuccess();
    } else {
        successMessage.style.display = 'none';
    }
}

function showSuccess() {
    successMessage.style.display = 'block';
    // Calculate efficiency (optimal is 7 moves)
    const efficiency = Math.min(100, Math.round((7 / moveCount) * 100));
    efficiencyDisplay.textContent = `${efficiency}%`;

    // Confetti effect
    triggerConfetti();
}

function triggerConfetti() {
    // Simple confetti effect
    const colors = ['#4361ee', '#3a56d4', '#4895ef', '#4cc9f0', '#f72585'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-10px';
        confetti.style.zIndex = '1000';
        confetti.style.transform = 'rotate(0deg)';
        confetti.style.opacity = '0.8';

        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { top: '-10px', transform: 'rotate(0deg)', opacity: 0.8 },
            { top: `${Math.random() * 100 + 50}vh`, transform: 'rotate(360deg)', opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 3000,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

// Update which jugs are interactive
function updateJugStates() {
    const jugs = ['a', 'b', 'c'];
    jugs.forEach(jug => {
        const element = document.getElementById(`jug-${jug}-container`);
        if (selectedJug) {
            // When a jug is selected, only enable jugs that can receive water
            element.classList.toggle('disabled',
                jug === selectedJug || state[selectedJug] === 0 ||
                (capacities[jug] - state[jug]) === 0
            );
        } else {
            // When no jug is selected, only enable jugs with water
            element.classList.toggle('disabled', state[jug] === 0);
        }
    });
}

// Update game statistics
function updateStats() {
    moveCounter.textContent = moveCount;
    const efficiency = Math.min(100, Math.round((7 / moveCount) * 100)) || 0;
    if (!successMessage.style.display || successMessage.style.display === 'none') {
        efficiencyDisplay.textContent = `${efficiency}%`;
    }
}

// Pour water from one jug to another with animation
function pour(from, to) {
    if (from === to) return false;

    // Create pouring animation
    const anim = document.createElement('div');
    anim.className = 'pour-animation';
    document.body.appendChild(anim);

    // Position animation between jugs
    const fromRect = document.getElementById(`jug-${from}`).getBoundingClientRect();
    const toRect = document.getElementById(`jug-${to}`).getBoundingClientRect();

    // Calculate control points for Bezier curve
    const controlY = Math.min(fromRect.top, toRect.top) - 50;

    // Animate pouring with Bezier curve
    anim.style.left = `${fromRect.left + fromRect.width / 2 - 10}px`;
    anim.style.top = `${fromRect.top + fromRect.height - 20}px`;
    anim.style.width = '20px';
    anim.style.height = '0px';
    anim.style.borderRadius = '50%';

    // Start animation
    requestAnimationFrame(() => {
        anim.style.transition = 'all 0.7s cubic-bezier(0.68, -0.6, 0.32, 1.6)';
        anim.style.left = `${toRect.left + toRect.width / 2 - 10}px`;
        anim.style.top = `${toRect.top + toRect.height - 20}px`;
        anim.style.width = '20px';
        anim.style.height = '20px';

        setTimeout(() => {
            anim.style.transition = 'all 0.3s ease-out';
            anim.style.width = '0px';
            anim.style.height = '0px';
            anim.style.opacity = '0';

            setTimeout(() => {
                anim.remove();

                // Actual pour logic
                const availableSpace = capacities[to] - state[to];
                const amountToPour = Math.min(state[from], availableSpace);

                if (amountToPour > 0) {
                    state[from] -= amountToPour;
                    state[to] += amountToPour;
                    moveCount++;
                    updateStats();
                    updateVisuals();
                    return true;
                }
                return false;
            }, 300);
        }, 700);
    });

    return true;
}

// Reset to initial state
function reset() {
    state = {
        a: 8,
        b: 0,
        c: 0
    };

    moveCount = 0;
    selectedJug = null;
    clearSelection();

    updateStats();
    updateVisuals();
    successMessage.style.display = 'none';
}

// Clear jug selection
function clearSelection() {
    jugAContainer.classList.remove('selected');
    jugBContainer.classList.remove('selected');
    jugCContainer.classList.remove('selected');
    updateJugStates();
}

// Handle jug selection and pouring
function handleJugClick(jug) {
    if (!selectedJug) {
        // Select first jug only if it has water
        if (state[jug] > 0) {
            selectedJug = jug;
            const element = document.getElementById(`jug-${jug}-container`);
            element.classList.add('selected');
            element.classList.add('jug-pulse');
            setTimeout(() => {
                element.classList.remove('jug-pulse');
            }, 1000);
            updateJugStates();
        }
    } else {
        // Second click - pour from selected jug to this one
        if (selectedJug !== jug) {
            pour(selectedJug, jug);
        }
        clearSelection();
        selectedJug = null;
    }
}

// Event listeners
jugAContainer.addEventListener('click', () => handleJugClick('a'));
jugBContainer.addEventListener('click', () => handleJugClick('b'));
jugCContainer.addEventListener('click', () => handleJugClick('c'));

// Touch support for mobile
jugAContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleJugClick('a');
});
jugBContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleJugClick('b');
});
jugCContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleJugClick('c');
});

resetBtn.addEventListener('click', reset);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === '1') handleJugClick('a');
    if (e.key === '2') handleJugClick('b');
    if (e.key === '3') handleJugClick('c');
    if (e.key === 'r' || e.key === 'R') reset();
});

// Initialize
updateVisuals();

// Fullscreen functionality
document.getElementById('fullscreen-btn').addEventListener('click', function() {
    const solveArea = document.querySelector('.solve-area');
    
    if (!document.fullscreenElement) {
        if (solveArea.requestFullscreen) {
            solveArea.requestFullscreen();
        } else if (solveArea.webkitRequestFullscreen) { /* Safari */
            solveArea.webkitRequestFullscreen();
        } else if (solveArea.msRequestFullscreen) { /* IE11 */
            solveArea.msRequestFullscreen();
        }
        solveArea.classList.add('fullscreen');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        solveArea.classList.remove('fullscreen');
    }
});

// Listen for fullscreen change
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const solveArea = document.querySelector('.solve-area');
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        solveArea.classList.remove('fullscreen');
    }
}