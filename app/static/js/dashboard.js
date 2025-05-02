// Dashboard Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initDashboardCards();
    initTabNavigation();
    initChartAnimations();
    initDropdownAnimations();

    // Check for dark mode preference
    checkDarkMode();
});

/**
 * Initialize dashboard card animations and interactions
 */
function initDashboardCards() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach(card => {
        // Add hover effect class
        card.classList.add('transition-all', 'duration-300', 'ease-in-out');
        
        // Add entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + Array.from(cards).indexOf(card) * 100);
    });
}

/**
 * Initialize tab navigation with smooth transitions
 */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    const tabsContainer = document.querySelector('.dashboard-tabs');
    
    if (!tabButtons.length || !tabPanels.length) return;
    
    // Create active tab indicator if it doesn't exist
    let indicator = document.querySelector('.active-tab-indicator');
    if (!indicator && tabsContainer) {
        indicator = document.createElement('span');
        indicator.classList.add('active-tab-indicator');
        tabsContainer.appendChild(indicator);
    }
    
    // Update indicator position based on active tab
    function updateIndicator(activeTab) {
        if (!indicator || !activeTab) return;
        
        indicator.style.width = `${activeTab.offsetWidth}px`;
        indicator.style.left = `${activeTab.offsetLeft}px`;
    }
    
    // Initialize indicator position
    const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
    if (activeTab) {
        updateIndicator(activeTab);
    }
    
    // Add click event listeners to tabs
    tabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update indicator
            updateIndicator(tab);
            
            // Animate tab panel transition
            const targetPanel = document.getElementById(tab.getAttribute('aria-controls'));
            if (targetPanel) {
                tabPanels.forEach(panel => {
                    if (panel === targetPanel) {
                        panel.classList.remove('hidden');
                        panel.style.opacity = '0';
                        panel.style.transform = 'translateY(10px)';
                        
                        setTimeout(() => {
                            panel.style.opacity = '1';
                            panel.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        panel.classList.add('hidden');
                    }
                });
            }
        });
    });
}

/**
 * Add subtle animations to charts
 */
function initChartAnimations() {
    const chartContainers = document.querySelectorAll('.chart-container');
    
    chartContainers.forEach(container => {
        container.style.opacity = '0';
        container.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.5s ease-in-out';
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
        }, 300);
    });
}

/**
 * Add dropdown animations
 */
function initDropdownAnimations() {
    // Add animation classes to dropdowns
    const dropdowns = document.querySelectorAll('[data-dropdown-toggle]');
    
    dropdowns.forEach(dropdown => {
        const targetId = dropdown.getAttribute('data-dropdown-toggle');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.classList.add('dropdown-animation');
        }
    });
}

/**
 * Check for dark mode preference
 */
function checkDarkMode() {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('color-theme');
    
    // Apply appropriate theme class to html element
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkMode)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}