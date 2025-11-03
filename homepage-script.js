  // Shared product data (MUST MATCH SHOP PAGE)
        const products = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 79.99,
                originalPrice: 99.99,
                category: "Electronics",
                icon: "fas fa-headphones"
            },
            {
                id: 2,
                name: "Smartphone X",
                price: 599.99,
                originalPrice: 699.99,
                category: "Electronics",
                icon: "fas fa-mobile-alt"
            },
            {
                id: 3,
                name: "Designer Watch",
                price: 149.99,
                category: "Fashion",
                icon: "fas fa-swatchbook"
            },
            {
                id: 4,
                name: "Running Shoes",
                price: 89.99,
                originalPrice: 119.99,
                category: "Sports",
                icon: "fas fa-shoe-prints"
            }
        ];

        // Storage keys (MUST MATCH SHOP PAGE)
        const STORAGE_CART = 'blueShopCart';
        const STORAGE_WISHLIST = 'blueShopWishlist';

        // State management
        let cart = [];
        let wishlist = [];

        // DOM Elements
        const cartBtn = document.getElementById('cart-btn');
        const cartModal = document.getElementById('cart-modal');
        const closeCart = document.getElementById('close-cart');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.getElementById('cart-count');
        const continueShopping = document.getElementById('continue-shopping');
        const checkoutBtn = document.getElementById('checkout-btn');

        const wishlistBtn = document.getElementById('wishlist-btn');
        const wishlistModal = document.getElementById('wishlist-modal');
        const closeWishlist = document.getElementById('close-wishlist');
        const wishlistItems = document.getElementById('wishlist-items');
        const wishlistCount = document.getElementById('wishlist-count');

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadFromStorage();
            setupEventListeners();
            updateAllUI();
            
            // Add event listeners to product buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
            
            document.querySelectorAll('.wishlist-btn').forEach(button => {
                button.addEventListener('click', toggleWishlist);
            });
        });

        // Storage functions
        function loadFromStorage() {
            const savedCart = localStorage.getItem(STORAGE_CART);
            const savedWishlist = localStorage.getItem(STORAGE_WISHLIST);
            
            if (savedCart) cart = JSON.parse(savedCart);
            if (savedWishlist) wishlist = JSON.parse(savedWishlist);
        }

        function saveToStorage() {
            localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
            localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(wishlist));
        }

        // Cart functions
        function addToCart(e) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.id);
            const productName = productCard.dataset.name;
            const productPrice = parseFloat(productCard.dataset.price);
            
            addToCartById(productId, productName, productPrice);
        }

        function addToCartById(productId, productName, productPrice) {
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            updateAllUI();
            saveToStorage();
            showNotification(`${productName} added to cart!`);
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateAllUI();
            saveToStorage();
        }

        function updateCartQuantity(productId, newQuantity) {
            if (newQuantity < 1) {
                removeFromCart(productId);
                return;
            }
            
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
                updateAllUI();
                saveToStorage();
            }
        }

        // Wishlist functions
        function toggleWishlist(e) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.id);
            const productName = productCard.dataset.name;
            const productPrice = parseFloat(productCard.dataset.price);
            
            toggleWishlistById(productId, productName, productPrice, e.target);
        }

        function toggleWishlistById(productId, productName, productPrice, button) {
            const existingItem = wishlist.find(item => item.id === productId);
            
            if (existingItem) {
                wishlist = wishlist.filter(item => item.id !== productId);
                if (button) {
                    button.innerHTML = '<i class="far fa-heart"></i>';
                    button.classList.remove('active');
                }
                showNotification(`${productName} removed from wishlist`);
            } else {
                wishlist.push({
                    id: productId,
                    name: productName,
                    price: productPrice
                });
                if (button) {
                    button.innerHTML = '<i class="fas fa-heart"></i>';
                    button.classList.add('active');
                }
                showNotification(`${productName} added to wishlist!`);
            }
            
            updateAllUI();
            saveToStorage();
        }

        function removeFromWishlist(productId) {
            wishlist = wishlist.filter(item => item.id !== productId);
            updateWishlistButton(productId, false);
            updateAllUI();
            saveToStorage();
        }

        // UI Update functions
        function updateAllUI() {
            updateCartUI();
            updateWishlistUI();
            updateWishlistButtons();
        }

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty</p>';
                cartTotal.textContent = '$0.00';
                return;
            }
            
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <i class="${getProductIcon(item.id)}" style="font-size: 1.5rem; color: var(--primary);"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }

        function updateWishlistUI() {
            wishlistCount.textContent = wishlist.length;
            
            wishlistItems.innerHTML = '';
            
            if (wishlist.length === 0) {
                wishlistItems.innerHTML = '<p>Your wishlist is empty</p>';
                return;
            }
            
            wishlist.forEach(item => {
                const wishlistItem = document.createElement('div');
                wishlistItem.className = 'wishlist-item';
                wishlistItem.innerHTML = `
                    <div class="wishlist-item-img">
                        <i class="${getProductIcon(item.id)}" style="font-size: 2rem; color: var(--primary);"></i>
                    </div>
                    <div class="wishlist-item-info">
                        <div class="wishlist-item-title">${item.name}</div>
                        <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
                        <div class="wishlist-item-actions">
                            <button class="btn btn-primary" onclick="addToCartFromWishlist(${item.id})">Add to Cart</button>
                            <button class="btn btn-outline" onclick="removeFromWishlist(${item.id})">Remove</button>
                        </div>
                    </div>
                `;
                
                wishlistItems.appendChild(wishlistItem);
            });
        }

        function updateWishlistButtons() {
            document.querySelectorAll('.wishlist-btn').forEach(button => {
                const productCard = button.closest('.product-card');
                const productId = parseInt(productCard.dataset.id);
                const isInWishlist = wishlist.find(item => item.id === productId);
                
                if (isInWishlist) {
                    button.innerHTML = '<i class="fas fa-heart"></i>';
                    button.classList.add('active');
                } else {
                    button.innerHTML = '<i class="far fa-heart"></i>';
                    button.classList.remove('active');
                }
            });
        }

        function updateWishlistButton(productId, isInWishlist) {
            const wishlistBtn = document.querySelector(`.product-card[data-id="${productId}"] .wishlist-btn`);
            if (wishlistBtn) {
                if (isInWishlist) {
                    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    wishlistBtn.classList.add('active');
                } else {
                    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
                    wishlistBtn.classList.remove('active');
                }
            }
        }

        // Helper functions
        function getProductIcon(productId) {
            const product = products.find(p => p.id === productId);
            return product ? product.icon : 'fas fa-box';
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background-color: var(--success);
                color: white;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--box-shadow);
                z-index: 3000;
                transition: var(--transition);
                transform: translateX(100%);
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        function addToCartFromWishlist(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            addToCartById(productId, product.name, product.price);
        }

        // Event listener setup
        function setupEventListeners() {
            // Cart modal
            cartBtn.addEventListener('click', () => {
                cartModal.style.display = 'flex';
            });

            closeCart.addEventListener('click', () => {
                cartModal.style.display = 'none';
            });

            continueShopping.addEventListener('click', () => {
                cartModal.style.display = 'none';
            });

            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    showNotification('Your cart is empty!');
                    return;
                }
                showNotification('Proceeding to checkout...');
            });

            // Wishlist modal
            wishlistBtn.addEventListener('click', () => {
                wishlistModal.style.display = 'flex';
            });

            closeWishlist.addEventListener('click', () => {
                wishlistModal.style.display = 'none';
            });

            // Close modals when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.style.display = 'none';
                }
                if (e.target === wishlistModal) {
                    wishlistModal.style.display = 'none';
                }
            });

            // Mobile menu functionality
            document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
                document.querySelector('.main-nav').classList.toggle('active');
            });

            // Smooth scroll to Categories
            const shopNowBtn = document.getElementById('shop-now');
            if (shopNowBtn) {
                shopNowBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.getElementById('categories');
                    if (!target) return;
                    const header = document.querySelector('header');
                    const headerOffset = header ? header.offsetHeight : 0;
                    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 10;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                });
            }

            // Newsletter form submission
            document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                if (email) {
                    showNotification('Thank you for subscribing to our newsletter!');
                    this.reset();
                }
            });
        }

        // Make functions globally available for onclick handlers
        window.addToCartFromWishlist = addToCartFromWishlist;
        window.removeFromWishlist = removeFromWishlist;
        window.updateCartQuantity = updateCartQuantity;
        window.removeFromCart = removeFromCart;