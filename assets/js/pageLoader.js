/**
 * Page Navigation Loader
 * Provides smooth loading transitions when navigating between pages
 */

class PageLoader {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    init() {
        console.log('🔧 Initializing page loader components...');
        this.createLoader();
        this.attachEventListeners();
        console.log('✅ Page loader components ready');
    }

    // Create loader element
    createLoader() {
        if (document.getElementById('pageLoader')) return;

        const loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="circle-spinner"></div>
            </div>
        `;

        document.body.appendChild(loader);
    }

    // Show loader
    show() {
        if (this.isLoading) return;
        this.isLoading = true;
        console.log('🔄 Page loader showing...');
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('✅ Loader element found and activated');
        } else {
            console.log('❌ Loader element not found');
        }
    }

    // Hide loader
    hide() {
        this.isLoading = false;
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Navigate to page with loader
    navigateTo(url) {
        if (this.isLoading) return;

        this.show();

        // Simulate minimum loading time for smooth UX (increased to 800ms)
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    }

    // Attach event listeners to navigation links
    attachEventListeners() {
        // Handle all navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');

            // Skip if not a link or if it's an external link
            if (!link || !link.href) return;

            const href = link.getAttribute('href');

            // Skip if external link, email, tel, or anchor link
            if (!href ||
                href.startsWith('http') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                href.startsWith('#') ||
                href === '') return;

            // Skip if it's the current page
            const currentPath = window.location.pathname;
            const linkPath = href.startsWith('/') ? href : new URL(href, window.location.href).pathname;
            if (currentPath === linkPath) return;

            // Skip if opening in new tab
            if (link.target === '_blank' || e.ctrlKey || e.metaKey) return;

            console.log('🔗 Navigation intercepted:', href);
            e.preventDefault();
            this.navigateTo(href);
        });

        // Hide loader when page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 100);
        });

        // Hide loader if page becomes visible (back/forward navigation)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.hide();
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('pageshow', () => {
            this.hide();
        });
    }

    // Preload a page
    preloadPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    // Preload common pages
    preloadCommonPages() {
        // Determine if we're in a subdirectory
        const isInSubdirectory = window.location.pathname.includes('/pages/');
        const basePath = isInSubdirectory ? '../pages/' : 'pages/';

        const commonPages = [
            'about.html',
            'services.html',
            'contact.html',
            'projects.html'
        ];

        commonPages.forEach(page => {
            this.preloadPage(basePath + page);
        });
    }
}

// Initialize page loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing page loader...');
    window.pageLoader = new PageLoader();
    console.log('✅ Page loader initialized');

    // Preload common pages after a short delay
    setTimeout(() => {
        window.pageLoader.preloadCommonPages();
    }, 2000);
});

// Expose for manual use
window.PageLoader = PageLoader;

// Test function for debugging
window.testLoader = function() {
    console.log('🧪 Testing page loader...');
    if (window.pageLoader) {
        window.pageLoader.show();
        setTimeout(() => {
            window.pageLoader.hide();
            console.log('✅ Loader test completed');
        }, 2000);
    } else {
        console.log('❌ Page loader not found');
    }
};