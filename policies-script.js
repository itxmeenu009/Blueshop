 // Policy Navigation
        document.querySelectorAll('.policy-nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.policy-nav-link').forEach(l => {
                    l.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Scroll to target section
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, null, targetId);
                }
            });
        });

        // Track order form handler
        document.getElementById('trackOrderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const orderNumber = document.getElementById('order-number').value;
            const email = document.getElementById('tracking-email').value;
            
            alert(`Tracking order ${orderNumber} for ${email}`);
            this.reset();
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('.policy-section');
            const navLinks = document.querySelectorAll('.policy-nav-link');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    currentSection = '#' + section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentSection) {
                    link.classList.add('active');
                }
            });
        });

        // Check URL hash on page load
        document.addEventListener('DOMContentLoaded', function() {
            if (window.location.hash) {
                const targetLink = document.querySelector(`.policy-nav-link[href="${window.location.hash}"]`);
                if (targetLink) {
                    targetLink.click();
                }
            }
        });