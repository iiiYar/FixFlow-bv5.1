// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');

if (sidebar) {
    // Mobile toggle function
    const toggleSidebarMobile = (sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose) => {
        sidebar.classList.toggle('hidden');
        sidebarBackdrop.classList.toggle('hidden');
        toggleSidebarMobileHamburger.classList.toggle('hidden');
        toggleSidebarMobileClose.classList.toggle('hidden');
    }

    // Desktop toggle function
    const toggleSidebarDesktop = () => {
        sidebar.classList.toggle('w-16');
        sidebar.classList.toggle('w-64');
        document.querySelectorAll('.sidebar-item-text').forEach(el => {
            el.classList.toggle('hidden');
        });
    }

    // Get elements
    const toggleSidebarMobileEl = document.getElementById('toggleSidebarMobile');
    const toggleSidebarDesktopEl = document.getElementById('toggleSidebarDesktop');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const toggleSidebarMobileHamburger = document.getElementById('toggleSidebarMobileHamburger');
    const toggleSidebarMobileClose = document.getElementById('toggleSidebarMobileClose');
    const toggleSidebarMobileSearch = document.getElementById('toggleSidebarMobileSearch');

    // Mobile event listeners
    toggleSidebarMobileSearch.addEventListener('click', () => {
        toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
    });

    toggleSidebarMobileEl.addEventListener('click', () => {
        toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
    });

    sidebarBackdrop.addEventListener('click', () => {
        toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
    });

    // Desktop event listener
    if (toggleSidebarDesktopEl) {
        toggleSidebarDesktopEl.addEventListener('click', toggleSidebarDesktop);
    }
}