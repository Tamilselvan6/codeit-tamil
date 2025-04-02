document.addEventListener('DOMContentLoaded', function () {
    // Check if user has already subscribed
    if (localStorage.getItem('ytSubscribed') === 'true') {
        unlockContent();
    }

    // Handle all subscription-related clicks
    const subscriptionButtons = [
        document.getElementById('subscribeBtn'),
        document.getElementById('unlockBtn')
    ];

    subscriptionButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                handleYouTubeRedirect();
            });
        }
    });

    // Handle "I've already subscribed" button
    document.getElementById('alreadySubscribed').addEventListener('click', function () {
        localStorage.setItem('ytSubscribed', 'true');
        unlockContent();
        showSuccessMessage();
        createConfetti();
    });

    // Check if we're returning from YouTube
    checkForYouTubeReturn();

    // Function to handle YouTube redirect
    function handleYouTubeRedirect() {
        // Set a flag that we're redirecting to YouTube
        sessionStorage.setItem('ytRedirectActive', 'true');
        // Store the current time
        localStorage.setItem('ytRedirectTime', Date.now());
        // Open YouTube in new tab
        window.open('https://www.youtube.com/@codeit-tamil?sub_confirmation=1', '_blank');
        // Start checking for return
        startReturnDetection();
    }

    // Function to check if we're returning from YouTube
    function checkForYouTubeReturn() {
        const redirectTime = localStorage.getItem('ytRedirectTime');
        const isRedirectActive = sessionStorage.getItem('ytRedirectActive');

        if (isRedirectActive && redirectTime) {
            const timeSinceRedirect = Date.now() - parseInt(redirectTime);

            // If we returned within 5 minutes (300000 ms)
            if (timeSinceRedirect < 300000) {
                // Assume user subscribed
                localStorage.setItem('ytSubscribed', 'true');
                unlockContent();
                showSuccessMessage();
                createConfetti();
            }

            // Clean up
            sessionStorage.removeItem('ytRedirectActive');
            localStorage.removeItem('ytRedirectTime');
        }
    }

    // Function to detect when user returns from YouTube
    function startReturnDetection() {
        let checks = 0;
        const maxChecks = 60; // Check for up to 5 minutes (300 seconds / 5 second intervals)
        const checkInterval = 5000; // Check every 5 seconds

        const returnCheck = setInterval(function () {
            checks++;

            // If window regains focus, assume user returned
            if (document.hasFocus()) {
                clearInterval(returnCheck);
                checkForYouTubeReturn();
                return;
            }

            // Stop checking after max attempts
            if (checks >= maxChecks) {
                clearInterval(returnCheck);
                sessionStorage.removeItem('ytRedirectActive');
                localStorage.removeItem('ytRedirectTime');
            }
        }, checkInterval);
    }

    // Function to unlock content
    function unlockContent() {
        document.getElementById('subscriptionModal').style.display = 'none';
        document.getElementById('lockedContent').style.display = 'none';
        document.getElementById('interviewContent').classList.remove('hidden');
    }

    // Function to show success message
    function showSuccessMessage() {
        const returnMessage = document.getElementById('returnMessage');
        returnMessage.style.display = 'block';
        setTimeout(() => {
            returnMessage.style.display = 'none';
        }, 5000);
    }

    // Function to create confetti effect
    function createConfetti() {
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
});