// Enhanced UI and UX Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced UI components
    initEnhancedCards();
    initEnhancedTabs();
    initEnhancedCharts();
    initProductListAnimations();
    initTimelineAnimations();
    initDropdownEnhancements();
});

/**
 * Initialize enhanced card animations and interactions
 */
function initEnhancedCards() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    // Create observer for entrance animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach((card, index) => {
        // Add entrance animation class
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Add visible class for animation
        card.addEventListener('transitionend', () => {
            card.classList.add('animation-complete');
        });
        
        // Observe card
        observer.observe(card);
        
        // Add subtle hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add animation to stat values
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(value => {
        value.addEventListener('mouseenter', () => {
            value.style.transform = 'scale(1.05)';
        });
        
        value.addEventListener('mouseleave', () => {
            value.style.transform = 'scale(1)';
        });
    });
}

/**
 * Initialize enhanced tab navigation with smooth transitions
 */
function initEnhancedTabs() {
    const tabButtons = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    
    if (!tabButtons.length || !tabPanels.length) return;
    
    // Add click event listeners to tabs with enhanced animations
    tabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            tabButtons.forEach(btn => {
                btn.setAttribute('aria-selected', 'false');
                btn.classList.remove('text-blue-600', 'border-blue-600');
                btn.classList.add('text-gray-500', 'hover:text-gray-900');
            });
            
            tab.setAttribute('aria-selected', 'true');
            tab.classList.remove('text-gray-500', 'hover:text-gray-900');
            tab.classList.add('text-blue-600', 'border-blue-600');
            
            // Animate tab panel transition
            const targetPanel = document.getElementById(tab.getAttribute('aria-controls'));
            if (targetPanel) {
                // Hide all panels with fade out
                tabPanels.forEach(panel => {
                    if (panel === targetPanel) {
                        panel.classList.remove('hidden');
                        panel.style.opacity = '0';
                        panel.style.transform = 'translateY(10px)';
                        
                        setTimeout(() => {
                            panel.style.opacity = '1';
                            panel.style.transform = 'translateY(0)';
                            panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        }, 50);
                    } else {
                        panel.style.opacity = '0';
                        panel.style.transform = 'translateY(10px)';
                        panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        
                        setTimeout(() => {
                            panel.classList.add('hidden');
                        }, 300);
                    }
                });
            }
        });
    });
}

/**
 * Add enhanced animations and interactions to charts
 */
function initEnhancedCharts() {
    const chartContainer = document.getElementById('main-chart');
    
    if (!chartContainer) return;
    
    // Add pulse animation to chart on load
    chartContainer.classList.add('animate-pulse');
    
    setTimeout(() => {
        chartContainer.classList.remove('animate-pulse');
    }, 1500);
    
    // Create a more visually appealing chart if ApexCharts is available
    if (typeof ApexCharts !== 'undefined') {
        const options = {
            chart: {
                height: 435,
                type: 'area',
                fontFamily: 'Inter, sans-serif',
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            colors: ['#1A56DB', '#FDBA8C'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [3, 3],
                curve: 'smooth'
            },
            grid: {
                show: true,
                strokeDashArray: 5,
                borderColor: '#E2E8F0',
            },
            series: [
                {
                    name: 'Sales',
                    data: [6500, 6800, 7800, 8400, 10900, 12200, 15900]
                },
                {
                    name: 'Revenue',
                    data: [5200, 5700, 6500, 7200, 9100, 10500, 14500]
                }
            ],
            xaxis: {
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                labels: {
                    style: {
                        colors: '#64748B',
                        fontSize: '14px',
                        fontWeight: 500
                    }
                },
                axisBorder: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#64748B',
                        fontSize: '14px',
                        fontWeight: 500
                    },
                    formatter: function (value) {
                        return '$' + value;
                    }
                }
            },
            tooltip: {
                enabled: true,
                theme: 'light',
                style: {
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                },
                y: {
                    formatter: function(value) {
                        return '$' + value;
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#1A56DB', '#FDBA8C'],
                    inverseColors: false,
                    opacityFrom: 0.7,
                    opacityTo: 0.2,
                }
            },
            legend: {
                show: true,
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '14px',
                fontWeight: 500,
                markers: {
                    width: 12,
                    height: 12,
                    radius: 12
                }
            }
        };

        // Initialize chart
        const chart = new ApexCharts(chartContainer, options);
        chart.render();

        // Add dark mode support
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateChartTheme = (isDarkMode) => {
            const newOptions = {
                grid: {
                    borderColor: isDarkMode ? '#374151' : '#E2E8F0'
                },
                xaxis: {
                    labels: {
                        style: {
                            colors: isDarkMode ? '#9CA3AF' : '#64748B'
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: isDarkMode ? '#9CA3AF' : '#64748B'
                        }
                    }
                },
                tooltip: {
                    theme: isDarkMode ? 'dark' : 'light'
                }
            };
            
            chart.updateOptions(newOptions);
        };

        // Initial theme setup
        if (document.documentElement.classList.contains('dark')) {
            updateChartTheme(true);
        }

        // Listen for theme changes
        darkModeMediaQuery.addEventListener('change', e => {
            updateChartTheme(e.matches);
        });

        // Listen for manual theme toggle
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDarkMode = document.documentElement.classList.contains('dark');
                    updateChartTheme(isDarkMode);
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
    }
}

/**
 * Add animations to product and user lists
 */
function initProductListAnimations() {
    const listItems = document.querySelectorAll('.product-list-item, .user-list-item');
    
    listItems.forEach((item, index) => {
        // Add staggered entrance animation
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + index * 50);
        
        // Add hover interaction
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
}

/**
 * Add animations to timeline elements
 */
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.border-l li');
    
    // Create observer for entrance animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach((item, index) => {
        // Add entrance animation class
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        
        // Add visible class for animation
        item.addEventListener('transitionend', () => {
            item.classList.add('animation-complete');
        });
        
        // Observe item
        observer.observe(item);
    });
}

/**
 * Add enhanced dropdown animations and interactions
 */
function initDropdownEnhancements() {
    // Add animation classes to dropdowns
    const dropdowns = document.querySelectorAll('[data-dropdown-toggle]');
    
    dropdowns.forEach(dropdown => {
        const targetId = dropdown.getAttribute('data-dropdown-toggle');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Add enhanced animation class
            targetElement.classList.add('dropdown-animation');
            
            // Add hover effect to dropdown items
            const dropdownItems = targetElement.querySelectorAll('a');
            dropdownItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateX(5px)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateX(0)';
                });
            });
        }
    });
}