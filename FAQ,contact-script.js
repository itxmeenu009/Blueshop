// Mobile Menu Toggle
        document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
            document.querySelector('.main-nav').classList.toggle('active');
        });

        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-btn')) {
                document.querySelector('.main-nav').classList.remove('active');
            }
        });

        // Navigation scroll functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Get all navigation links
            const navLinks = document.querySelectorAll('.main-nav a, .footer-links a, .top-bar-links a');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Check if it's an internal hash link
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        
                        const targetId = href.substring(1); // Remove the # symbol
                        const targetSection = document.getElementById(targetId);
                        const header = document.querySelector('header');
                        const headerOffset = header ? header.offsetHeight : 0;
                        
                        // Close mobile menu if open
                        document.querySelector('.main-nav').classList.remove('active');
                        
                        if (targetSection) {
                            const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - headerOffset - 20;
                            
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                            
                            // Update URL hash
                            window.history.pushState(null, null, href);
                        } else if (href === '#home') {
                            // Scroll to top for home
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            window.history.pushState(null, null, '#home');
                        }
                    }
                });
            });

            // Check URL hash on page load and scroll to section
            if (window.location.hash) {
                setTimeout(() => {
                    const hash = window.location.hash;
                    const targetId = hash.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const header = document.querySelector('header');
                        const headerOffset = header ? header.offsetHeight : 0;
                        const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - headerOffset - 20;
                        
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                }, 500);
            }
        });