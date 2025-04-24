document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        maxRedirectChecks: 60,
        checkInterval: 5000,
        redirectTimeout: 300000, // 5 minutes
        confettiCount: 75
    };

    // Elements cache
    const elements = {
        subscriptionModal: document.getElementById('subscriptionModal'),
        lockedContent: document.getElementById('lockedContent'),
        interviewContent: document.getElementById('interviewContent'),
        returnMessage: document.getElementById('returnMessage'),
        alreadySubscribed: document.getElementById('alreadySubscribed')
    };

    // Initialize
    function init() {
        if (!elements.subscriptionModal) return;
        
        // Check subscription status
        if (localStorage.getItem('ytSubscribed') === 'true') {
            unlockContent();
        }

        // Event listeners
        setupEventListeners();
        
        // Check for YouTube return
        checkForYouTubeReturn();
    }

    // Event listeners setup
    function setupEventListeners() {
        // Subscription buttons
        ['subscribeBtn', 'unlockBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', handleYouTubeRedirect);
        });

        // Already subscribed button
        if (elements.alreadySubscribed) {
            elements.alreadySubscribed.addEventListener('click', handleAlreadySubscribed);
        }
    }

    // YouTube redirect handler
    function handleYouTubeRedirect(e) {
        if (e) e.preventDefault();
        
        try {
            sessionStorage.setItem('ytRedirectActive', 'true');
            localStorage.setItem('ytRedirectTime', Date.now());
            
            const youtubeWindow = window.open(
                'https://www.youtube.com/@codeit-tamil?sub_confirmation=1', 
                '_blank'
            );
            
            if (youtubeWindow) {
                startReturnDetection();
            }
        } catch (error) {
            console.error('YouTube redirect failed:', error);
        }
    }

    // Already subscribed handler
    function handleAlreadySubscribed() {
        localStorage.setItem('ytSubscribed', 'true');
        unlockContent();
        showSuccessMessage();
        createConfetti();
    }

    // Check for YouTube return
    function checkForYouTubeReturn() {
        try {
            const redirectTime = localStorage.getItem('ytRedirectTime');
            const isRedirectActive = sessionStorage.getItem('ytRedirectActive');

            if (isRedirectActive && redirectTime) {
                const timeSinceRedirect = Date.now() - parseInt(redirectTime);

                if (timeSinceRedirect < config.redirectTimeout) {
                    handleAlreadySubscribed();
                }

                // Clean up
                sessionStorage.removeItem('ytRedirectActive');
                localStorage.removeItem('ytRedirectTime');
            }
        } catch (error) {
            console.error('Error checking YouTube return:', error);
        }
    }

    // Return detection
    function startReturnDetection() {
        let checks = 0;
        
        const returnCheck = setInterval(function() {
            checks++;

            if (document.hasFocus()) {
                clearInterval(returnCheck);
                checkForYouTubeReturn();
                return;
            }

            if (checks >= config.maxRedirectChecks) {
                clearInterval(returnCheck);
                cleanRedirectFlags();
            }
        }, config.checkInterval);
    }

    // Clean up redirect flags
    function cleanRedirectFlags() {
        sessionStorage.removeItem('ytRedirectActive');
        localStorage.removeItem('ytRedirectTime');
    }

    // Unlock content
    function unlockContent() {
        if (elements.subscriptionModal) elements.subscriptionModal.style.display = 'none';
        if (elements.lockedContent) elements.lockedContent.style.display = 'none';
        if (elements.interviewContent) elements.interviewContent.classList.remove('hidden');
    }

    // Show success message
    function showSuccessMessage() {
        if (!elements.returnMessage) return;
        
        elements.returnMessage.style.display = 'block';
        setTimeout(() => {
            elements.returnMessage.style.display = 'none';
        }, 5000);
    }

    // Create confetti
    function createConfetti() {
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
        
        for (let i = 0; i < config.confettiCount; i++) {
            setTimeout(() => {
                try {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    Object.assign(confetti.style, {
                        left: `${Math.random() * 100}vw`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        animationDuration: `${Math.random() * 2 + 2}s`
                    });
                    
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 3000);
                } catch (error) {
                    console.error('Error creating confetti:', error);
                }
            }, i * 30); // Stagger creation
        }
    }

    // Initialize the application
    init();
});