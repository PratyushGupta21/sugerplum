// app.js - Main application logic for Sugar Plum Bakery

// Global variables
let currentPage = 'home';

// Page routing function
function showPage(pageName) {
    // Update current page
    currentPage = pageName;

    // Update navbar active state
    updateNavbar();

    // Load page content
    loadPageContent(pageName);
}

// Update navbar to show active page
function updateNavbar() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.onclick.toString().includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Load page content dynamically
async function loadPageContent(pageName) {
    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById('main-content').innerHTML = html;

        // Execute any scripts in the loaded content
        executeScripts(html);

        // Update page title
        updatePageTitle(pageName);

    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('main-content').innerHTML = '<h1>Error loading page</h1>';
    }
}

// Execute scripts in dynamically loaded HTML
function executeScripts(html) {
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
        try {
            eval(match[1]);
        } catch (error) {
            console.error('Error executing script:', error);
        }
    }
}

// Update page title
function updatePageTitle(pageName) {
    const titles = {
        home: 'Home - Sugar Plum Bakery',
        menu: 'Menu - Sugar Plum Bakery',
        cart: 'Cart - Sugar Plum Bakery'
    };
    document.title = titles[pageName] || 'Sugar Plum Bakery';
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
});

// Add CSS for active nav links
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--rose-pink) !important;
        font-weight: bold;
    }
`;
document.head.appendChild(style);