 document.addEventListener('DOMContentLoaded', function() {
            // Password visibility toggle
            const togglePassword = document.getElementById('togglePassword');
            const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
            
            toggleConfirmPassword.addEventListener('click', function() {
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
            
            // Password strength indicator
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                const strengthBar = document.querySelector('.password-strength-bar');
                const strengthContainer = document.getElementById('passwordStrength');
                
                // Reset classes
                strengthContainer.classList.remove('weak', 'medium', 'strong');
                
                if (password.length === 0) {
                    return;
                }
                
                // Calculate strength
                let strength = 0;
                
                // Length check
                if (password.length >= 8) strength += 1;
                
                // Character variety checks
                if (/[a-z]/.test(password)) strength += 1;
                if (/[A-Z]/.test(password)) strength += 1;
                if (/[0-9]/.test(password)) strength += 1;
                if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
                
                // Apply strength classes
                if (strength <= 2) {
                    strengthContainer.classList.add('weak');
                } else if (strength <= 4) {
                    strengthContainer.classList.add('medium');
                } else {
                    strengthContainer.classList.add('strong');
                }
            });
            
            // Password confirmation check
            confirmPasswordInput.addEventListener('input', function() {
                const password = passwordInput.value;
                const confirmPassword = this.value;
                const matchIndicator = document.getElementById('passwordMatch');
                
                if (confirmPassword.length === 0) {
                    matchIndicator.textContent = '';
                    return;
                }
                
                if (password === confirmPassword) {
                    matchIndicator.textContent = 'Passwords match';
                    matchIndicator.style.color = 'var(--success)';
                } else {
                    matchIndicator.textContent = 'Passwords do not match';
                    matchIndicator.style.color = 'var(--danger)';
                }
            });
            
            // Form submission
            document.getElementById('signupForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const fullName = document.getElementById('fullName').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const agreeTerms = document.getElementById('agreeTerms').checked;
                
                // Validation
                if (!fullName || !email || !password || !confirmPassword) {
                    showNotification('Please fill in all fields', 'error');
                    return;
                }
                
                if (!agreeTerms) {
                    showNotification('Please agree to the terms and conditions', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showNotification('Passwords do not match', 'error');
                    return;
                }
                
                // Password strength validation
                if (password.length < 8) {
                    showNotification('Password must be at least 8 characters long', 'error');
                    return;
                }
                
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password)) {
                    showNotification('Password must contain uppercase, lowercase, number, and special character', 'error');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // In a real application, you would send this data to your backend
                // For demo purposes, we'll store in localStorage
                const users = JSON.parse(localStorage.getItem('blueShopUsers') || '[]');
                
                // Check if user already exists
                const existingUser = users.find(user => user.email === email);
                if (existingUser) {
                    showNotification('An account with this email already exists', 'error');
                    return;
                }
                
                // Add new user
                const newUser = {
                    id: Date.now(),
                    fullName,
                    email,
                    password: btoa(password), // In real app, this should be properly hashed
                    createdAt: new Date().toISOString()
                };
                
                users.push(newUser);
                localStorage.setItem('blueShopUsers', JSON.stringify(users));
                
                // Show success message
                showNotification('Account created successfully! Redirecting to login...', 'success');
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = './Login.html';
                }, 2000);
            });
            
            // Social signup buttons
            document.getElementById('googleSignup').addEventListener('click', function() {
                showNotification('Google signup would be implemented here', 'info');
            });
            
            document.getElementById('facebookSignup').addEventListener('click', function() {
                showNotification('Facebook signup would be implemented here', 'info');
            });
            
            document.getElementById('appleSignup').addEventListener('click', function() {
                showNotification('Apple signup would be implemented here', 'info');
            });
            
            // Notification function
            function showNotification(message, type) {
                const notification = document.getElementById('notification');
                notification.textContent = message;
                notification.className = `notification ${type} show`;
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 4000);
            }
        });