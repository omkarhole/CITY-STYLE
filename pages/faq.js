// FAQ Page Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            const isOpen = navLinks.classList.contains('open');
            navLinks.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', !isOpen);
        });
    }

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq__item');
    const searchInput = document.getElementById('faq-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const categoryButtons = document.querySelectorAll('.category__btn');
    const faqSections = document.querySelectorAll('.faq__section');

    // Initialize FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq__question');
                    const otherAnswer = otherItem.querySelector('.faq__answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.hidden = true;
                    otherAnswer.classList.remove('expanding');
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.add('collapsing');
                setTimeout(() => {
                    answer.hidden = true;
                    answer.classList.remove('collapsing');
                }, 300);
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.hidden = false;
                answer.classList.add('expanding');
                setTimeout(() => {
                    answer.classList.remove('expanding');
                }, 300);
            }
        });
    });

    // Search functionality
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const allItems = document.querySelectorAll('.faq__item');
        let visibleCount = 0;
        
        if (searchTerm === '') {
            // Show all items and sections
            allItems.forEach(item => {
                item.style.display = 'block';
            });
            faqSections.forEach(section => {
                section.style.display = 'block';
            });
            clearSearchBtn.classList.remove('visible');
            showCategory('all');
            return;
        }
        
        clearSearchBtn.classList.add('visible');
        
        // Hide all sections initially
        faqSections.forEach(section => {
            section.style.display = 'none';
        });
        
        allItems.forEach(item => {
            const question = item.querySelector('.faq__question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq__answer').textContent.toLowerCase();
            const keywords = item.getAttribute('data-keywords') || '';
            
            const matches = question.includes(searchTerm) || 
                          answer.includes(searchTerm) || 
                          keywords.toLowerCase().includes(searchTerm);
            
            if (matches) {
                item.style.display = 'block';
                // Show parent section
                const parentSection = item.closest('.faq__section');
                if (parentSection) {
                    parentSection.style.display = 'block';
                }
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message
        showNoResultsMessage(visibleCount === 0, searchTerm);
        
        // Update category buttons state
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
    }

    function showNoResultsMessage(show, searchTerm = '') {
        let noResultsEl = document.querySelector('.no-results');
        
        if (show) {
            if (!noResultsEl) {
                noResultsEl = document.createElement('div');
                noResultsEl.className = 'no-results';
                noResultsEl.innerHTML = `
                    <h3>No results found</h3>
                    <p>We couldn't find any FAQs matching "${searchTerm}"</p>
                    <p>Try different keywords or <a href="#" id="contact-support" style="color: var(--primary-color); text-decoration: underline;">contact our support team</a> for help.</p>
                `;
                document.querySelector('.faq__content').appendChild(noResultsEl);
                
                // Add click handler for contact support
                document.getElementById('contact-support').addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector('.faq__contact').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                });
            } else {
                noResultsEl.querySelector('p').innerHTML = `We couldn't find any FAQs matching "${searchTerm}"`;
            }
            noResultsEl.style.display = 'block';
        } else {
            if (noResultsEl) {
                noResultsEl.style.display = 'none';
            }
        }
    }

    // Search input event listeners
    searchInput.addEventListener('input', performSearch);
    
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        performSearch();
        searchInput.focus();
    });

    // Category filtering
    function showCategory(category) {
        const allItems = document.querySelectorAll('.faq__item');
        
        if (category === 'all') {
            faqSections.forEach(section => {
                section.style.display = 'block';
            });
            allItems.forEach(item => {
                item.style.display = 'block';
            });
        } else {
            faqSections.forEach(section => {
                if (section.getAttribute('data-category') === category) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
        
        showNoResultsMessage(false);
        
        // Clear search
        if (searchInput.value) {
            searchInput.value = '';
            clearSearchBtn.classList.remove('visible');
        }
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update button states
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            showCategory(category);
        });
    });

    // Keyboard navigation for FAQ items
    document.addEventListener('keydown', function(e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.focus();
        }
        
        // ESC key to clear search
        if (e.key === 'Escape' && searchInput === document.activeElement) {
            if (searchInput.value) {
                searchInput.value = '';
                performSearch();
            } else {
                searchInput.blur();
            }
        }
    });

    // Live chat functionality
    const liveChatBtn = document.getElementById('live-chat');
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', function() {
            // Simulate opening live chat
            alert('Live chat feature would open here. For now, please use our contact form or call us directly.');
            
            // In a real implementation, this would open a chat widget
            // Example: window.ChatWidget && window.ChatWidget.open();
        });
    }

    // Back to top functionality
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="ri-arrow-up-line"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: var(--text-dark);
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    // Add hover effects for back to top button
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    // Print functionality
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="ri-printer-line"></i> Print FAQ';
    printBtn.className = 'print-btn btn';
    printBtn.style.cssText = `
        margin: 1rem 0;
        background-color: var(--text-light);
    `;
    
    printBtn.addEventListener('click', function() {
        // Expand all FAQ items before printing
        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            const answer = item.querySelector('.faq__answer');
            question.setAttribute('aria-expanded', 'true');
            answer.hidden = false;
        });
        
        window.print();
    });
    
    const faqHeader = document.querySelector('.faq__header');
    if (faqHeader) {
        faqHeader.appendChild(printBtn);
    }

    // Auto-expand FAQ from URL hash
    function handleURLHash() {
        const hash = window.location.hash;
        if (hash) {
            // Look for FAQ item with matching ID or keywords
            const targetElement = document.querySelector(hash);
            if (targetElement && targetElement.closest('.faq__item')) {
                const faqItem = targetElement.closest('.faq__item');
                const question = faqItem.querySelector('.faq__question');
                const answer = faqItem.querySelector('.faq__answer');
                
                question.setAttribute('aria-expanded', 'true');
                answer.hidden = false;
                
                setTimeout(() => {
                    faqItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }
        }
    }

    // Handle URL hash on page load
    handleURLHash();

    // Handle browser back/forward
    window.addEventListener('popstate', handleURLHash);

    // Analytics tracking (optional)
    function trackFAQInteraction(action, question) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_interaction', {
                event_category: 'FAQ',
                event_label: question,
                value: action
            });
        }
        
        // Alternative: Google Analytics 4
        if (typeof ga !== 'undefined') {
            ga('send', 'event', 'FAQ', action, question);
        }
        
        console.log('FAQ Interaction:', action, question);
    }

    // Track FAQ expansions
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        question.addEventListener('click', function() {
            const questionText = this.querySelector('span').textContent;
            const isExpanding = this.getAttribute('aria-expanded') === 'false';
            trackFAQInteraction(isExpanding ? 'expand' : 'collapse', questionText);
        });
    });

    // Track search usage
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.value.length > 2) {
                trackFAQInteraction('search', this.value);
            }
        }, 1000);
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('FAQ Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }

    // Accessibility improvements
    
    // Announce search results to screen readers
    function announceSearchResults(count, searchTerm) {
        const announcement = count === 0 
            ? `No results found for "${searchTerm}"`
            : `${count} result${count === 1 ? '' : 's'} found for "${searchTerm}"`;
        
        // Create or update aria-live region
        let liveRegion = document.getElementById('search-results-announcement');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'search-results-announcement';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = announcement;
    }

    // Update the search function to announce results
    const originalPerformSearch = performSearch;
    performSearch = function() {
        originalPerformSearch();
        
        const visibleItems = document.querySelectorAll('.faq__item[style*="block"], .faq__item:not([style*="none"])');
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm) {
            announceSearchResults(visibleItems.length, searchTerm);
        }
    };
});

// Helper function to debounce search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}