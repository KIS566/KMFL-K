// Page navigation के code में यह update करें
document.querySelectorAll('nav a, .floating-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        if (page) {
            showPage(page);
            
            // Projects page load होने पर initialize करें
            if (page === 'projects') {
                // Small delay to ensure DOM is ready
                setTimeout(onProjectsPageShow, 50);
            }
            
            // Tic Tac Toe page load hone par game initialize karein
            if (page === 'tictactoe') {
                setTimeout(initTicTacToeGame, 100);
            }
            
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Page load पर check करें
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
        // Agar Projects page hai to initialize karein
        if (hash === 'projects') {
            setTimeout(onProjectsPageShow, 100);
        }
        // Agar Tic Tac Toe page hai to game initialize karein
        if (hash === 'tictactoe') {
            setTimeout(initTicTacToeGame, 100);
        }
    } else {
        showPage('home');
    }
});

// Also listen for hash changes
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash === 'projects') {
        setTimeout(onProjectsPageShow, 50);
    }
});
