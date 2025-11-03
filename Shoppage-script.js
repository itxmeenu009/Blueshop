 // ======= Product catalog (MUST MATCH HOMEPAGE) =======
    const products = [
        { id: 1, name: "Wireless Headphones", brand: "SoundCo", price: 79.99, originalPrice: 99.99, rating: 4.3, reviews: 128, badge: "New", category: "Electronics", image: "https://i.postimg.cc/Wb99gtQ5/wireless-headphone.jpg", createdAt: 1660000000000 },
        { id: 2, name: "Smartphone X", brand: "TechOne", price: 599.99, originalPrice: 699.99, rating: 4.5, reviews: 256, badge: "Sale", category: "Electronics", image: "https://i.postimg.cc/hjhqBHWx/smartphone-x.jpg", createdAt: 1670000000000 },
        { id: 3, name: "Designer Watch", brand: "LuxTime", price: 149.99, originalPrice: null, rating: 4.9, reviews: 89, badge: null, category: "Fashion", image: "https://i.postimg.cc/V6TPLDm9/designer-watch.jpg", createdAt: 1650000000000 },
        { id: 4, name: "Running Shoes", brand: "Fleet", price: 89.99, originalPrice: 119.99, rating: 4.1, reviews: 174, badge: "Hot", category: "Sports", image: "https://i.postimg.cc/CLF8YNrr/running-shoes.jpg", createdAt: 1680000000000 },
        { id: 5, name: "Laptop Pro", brand: "Compute", price: 899.99, originalPrice: 999.99, rating: 4.7, reviews: 342, badge: "New", category: "Electronics", image: "https://i.postimg.cc/mgxZS2xn/laptop-pro.jpg", createdAt: 1690000000000 },
        { id: 6, name: "Camera DSLR", brand: "PhotoMax", price: 449.99, originalPrice: 549.99, rating: 4.2, reviews: 215, badge: "Sale", category: "Electronics", image: "https://i.postimg.cc/MHQ2cVGp/camera-dslr.jpg", createdAt: 1655000000000 },
        { id: 7, name: "Smart Watch", brand: "TechOne", price: 199.99, originalPrice: 249.99, rating: 4.0, reviews: 167, badge: null, category: "Electronics", image: "https://i.postimg.cc/Y0WK4YSg/smart-watch.jpg", createdAt: 1665000000000 },
        { id: 8, name: "Gaming Console", brand: "PlayMore", price: 299.99, originalPrice: 399.99, rating: 4.8, reviews: 298, badge: "Hot", category: "Electronics", image: "https://i.postimg.cc/tJxQ1WgW/gaming-console.jpg", createdAt: 1695000000000 },
        { id: 9, name: "Blender Pro", brand: "HomeEase", price: 59.99, originalPrice: 79.99, rating: 4.2, reviews: 54, badge: null, category: "Home", image: "https://i.postimg.cc/KY0yCmVT/blender-pro.jpg", createdAt: 1685000000000 },
        { id: 10, name: "Skin Care Kit", brand: "Glow", price: 29.99, originalPrice: null, rating: 4.4, reviews: 77, badge: null, category: "Beauty", image: "https://i.postimg.cc/k47ZwWGJ/Water-Bank-Blue-Hyaluronic-Serum.jpg"},
    ];

    // ======= State & persistence (MUST MATCH HOMEPAGE) =======
    const STORAGE_CART = 'blueShopCart';
    const STORAGE_WISHLIST = 'blueShopWishlist';
    let cart = JSON.parse(localStorage.getItem(STORAGE_CART) || '[]');
    let wishlist = JSON.parse(localStorage.getItem(STORAGE_WISHLIST) || '[]');

    // UI refs
    const productGrid = document.getElementById('productGrid');
    const resultsCount = document.getElementById('resultsCount');
    const cartCountBadge = document.getElementById('cartCount');
    const wishlistCountBadge = document.getElementById('wishlistCount');
    const cartModal = document.getElementById('cartModal');
    const cartItemsEl = document.getElementById('cartItems');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartShippingEl = document.getElementById('cartShipping');
    const cartTotalEl = document.getElementById('cartTotal');
    const wishlistModal = document.getElementById('wishlistModal');
    const wishlistItemsEl = document.getElementById('wishlistItems');
    const overlay = document.getElementById('overlay');
    const paginationEl = document.getElementById('pagination');

    // Filters / search / pagination
    let filters = {
        categories: new Set(),
        brands: new Set(),
        minPrice: 0,
        maxPrice: 2000,
        rating: 0,
        query: '',
        sort: 'featured',
        page: 1,
        perPage: 9
    };

    // derived sets
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const maxProductPrice = Math.max(...products.map(p=>p.price), 2000);

    // init UI
    document.addEventListener('DOMContentLoaded', () => {
        buildFiltersUI();
        bindUI();
        renderProducts();
        updateBadges();
        updateWishlistButtons();
    });

    // ===== Build filters UI =====
    function buildFiltersUI(){
        const catContainer = document.getElementById('categoryFilters');
        categories.forEach(c=>{
            const id = `cat_${c.replace(/\s+/g,'_')}`;
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" data-cat="${c}" id="${id}"> ${c}`;
            catContainer.appendChild(label);
        });

        const brandContainer = document.getElementById('brandFilters');
        brands.forEach(b=>{
            const id = `brand_${b.replace(/\s+/g,'_')}`;
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" data-brand="${b}" id="${id}"> ${b}`;
            brandContainer.appendChild(label);
        });

        // price controls
        const priceRange = document.getElementById('priceRange');
        const maxVal = Math.ceil(maxProductPrice / 50) * 50;
        priceRange.max = maxVal;
        priceRange.value = maxVal;
        document.getElementById('maxPrice').value = maxVal;
        filters.maxPrice = Number(priceRange.value);

        // category/brand listeners
        catContainer.addEventListener('change', e=>{
            if(e.target.dataset.cat !== undefined){
                const cat = e.target.dataset.cat;
                if(e.target.checked) filters.categories.add(cat); else filters.categories.delete(cat);
            }
        });
        brandContainer.addEventListener('change', e=>{
            if(e.target.dataset.brand !== undefined){
                const b = e.target.dataset.brand;
                if(e.target.checked) filters.brands.add(b); else filters.brands.delete(b);
            }
        });

        // price listeners
        const minInput = document.getElementById('minPrice');
        const maxInput = document.getElementById('maxPrice');
        priceRange.addEventListener('input', e=>{
            maxInput.value = e.target.value;
            filters.maxPrice = Number(e.target.value);
        });
        maxInput.addEventListener('change', e=>{
            const v = Number(e.target.value) || 0;
            priceRange.value = Math.max(0,v);
            filters.maxPrice = Number(priceRange.value);
        });
        minInput.addEventListener('change', e=>{
            filters.minPrice = Number(e.target.value) || 0;
        });
    }

    // ===== Bind UI controls =====
    function bindUI(){
        document.getElementById('applyFilters').addEventListener('click', ()=>{
            filters.page = 1;
            applySearchSortAndRender();
        });
        document.getElementById('resetFilters').addEventListener('click', ()=>{
            // reset UI & filters
            document.querySelectorAll('#categoryFilters input, #brandFilters input').forEach(i=>i.checked=false);
            document.getElementById('minPrice').value = 0;
            const priceRange = document.getElementById('priceRange');
            priceRange.value = priceRange.max;
            document.getElementById('maxPrice').value = priceRange.max;
            filters = { ...filters, categories: new Set(), brands: new Set(), minPrice:0, maxPrice:Number(priceRange.max), rating:0, page:1 };
            applySearchSortAndRender();
        });

        document.getElementById('sortSelect').addEventListener('change', e=>{
            filters.sort = e.target.value;
            applySearchSortAndRender();
        });

        document.getElementById('searchBtn').addEventListener('click', ()=> {
            const q = document.getElementById('searchInput').value.trim();
            filters.query = q;
            filters.page = 1;
            applySearchSortAndRender();
        });

        document.getElementById('searchInput').addEventListener('keyup', (e)=>{
            if(e.key === 'Enter'){ document.getElementById('searchBtn').click(); }
        });

        // mobile nav
        document.getElementById('mobileMenuBtn').addEventListener('click', ()=>{
            document.getElementById('mainNav').classList.toggle('open');
        });

        // cart toggle
        document.getElementById('cartBtn').addEventListener('click', openCart);
        document.getElementById('wishlistBtn').addEventListener('click', openWishlist);

        document.getElementById('closeCart').addEventListener('click', closeCart);
        document.getElementById('closeWishlist').addEventListener('click', closeWishlist);
        document.getElementById('overlay').addEventListener('click', closeModals);

        document.getElementById('clearCartBtn').addEventListener('click', ()=>{
            if(confirm('Clear all items from cart?')) { cart=[]; saveToStorage(); renderCart(); updateBadges(); }
        });

        document.getElementById('checkoutBtn').addEventListener('click', ()=>{
            if(cart.length === 0){ alert('Cart is empty'); return; }
            alert('Proceeding to checkout — integrate checkout flow with backend.');
        });

        // product grid event delegation: add to cart, wishlist, details
        productGrid.addEventListener('click', e=>{
            const addBtn = e.target.closest('.add-to-cart');
            if(addBtn){
                const id = Number(addBtn.dataset.id);
                addToCart(id);
                return;
            }
            const wishBtn = e.target.closest('.wishlist-btn');
            if(wishBtn){
                const id = Number(wishBtn.dataset.id);
                toggleWishlist(id, wishBtn);
                return;
            }
        });
    }

    // ===== Filtering / Sorting / Pagination logic =====
    function applySearchSortAndRender(){
        // gather rating radio
        const ratingRadio = document.querySelector('input[name="rating"]:checked');
        filters.rating = ratingRadio ? Number(ratingRadio.value) : 0;
        const q = document.getElementById('searchInput').value.trim();
        filters.query = q;
        renderProducts();
    }

    function filterProducts(){
        let list = products.slice();

        // categories
        if(filters.categories.size) list = list.filter(p => filters.categories.has(p.category));
        // brands
        if(filters.brands.size) list = list.filter(p => filters.brands.has(p.brand));
        // price
        list = list.filter(p => p.price >= (filters.minPrice || 0) && p.price <= (filters.maxPrice || 999999));
        // rating
        if(filters.rating > 0) list = list.filter(p => p.rating >= filters.rating);
        // search
        if(filters.query){
            const q = filters.query.toLowerCase();
            list = list.filter(p => (p.name + ' ' + p.brand + ' ' + p.category).toLowerCase().includes(q));
        }
        // sort
        switch(filters.sort){
            case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
            case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
            case 'rating-desc': list.sort((a,b)=>b.rating-a.rating); break;
            case 'newest': list.sort((a,b)=>b.createdAt - a.createdAt); break;
            default: list.sort((a,b)=>b.id - a.id); break;
        }
        return list;
    }

    function renderProducts(){
        const filtered = filterProducts();
        const total = filtered.length;
        const perPage = filters.perPage;
        const pages = Math.max(1, Math.ceil(total / perPage));
        if(filters.page > pages) filters.page = pages;
        const start = (filters.page - 1) * perPage;
        const pageItems = filtered.slice(start, start + perPage);

        productGrid.innerHTML = '';
        if(pageItems.length === 0){
            productGrid.innerHTML = `<div style="grid-column:1/-1;padding:30px;background:white;border-radius:12px;box-shadow:var(--shadow);text-align:center">No products found.</div>`;
        } else {
            for(const p of pageItems){
                const inWishlist = wishlist.find(item => item.id === p.id);
                const card = document.createElement('article');
                card.className = 'product-card';
                card.setAttribute('role','listitem');
                card.innerHTML = `
                    <div class="product-media">
                        ${p.badge?`<div class="product-badge">${p.badge}</div>`:''}
                        <button class="wishlist-btn ${inWishlist? 'active':''}" data-id="${p.id}" title="${inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}" aria-pressed="${inWishlist}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <img loading="lazy" src="${p.image}" alt="${p.name}">
                    </div>
                    <div class="product-info">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
                            <h4 class="product-title">${p.name}</h4>
                            <div style="text-align:right;color:var(--muted);font-size:0.9rem">${p.brand}</div>
                        </div>
                        <div class="product-price">
                            <div class="current-price">$${p.price.toFixed(2)}</div>
                            ${p.originalPrice ? `<div class="original-price">$${p.originalPrice.toFixed(2)}</div>` : ''}
                        </div>
                        <div class="product-rating">${renderStars(p.rating)} <span style="color:var(--muted)">(${p.reviews})</span></div>
                        <div style="margin-top:auto" class="product-actions">
                            <button class="btn btn-primary add-to-cart" data-id="${p.id}">Add to Cart</button>
                            <button class="btn btn-outline" onclick="alert('Details for ${escapeHtml(p.name)} — integrate product page')">Details</button>
                        </div>
                    </div>
                `;
                productGrid.appendChild(card);
            }
        }

        // update counts & pagination
        resultsCount.textContent = `Showing ${Math.min(total,start+1)} - ${Math.min(total,start+perPage)} of ${total} products`;
        renderPagination(total, perPage);
    }

    function renderStars(rating){
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        let s='';
        for(let i=0;i<full;i++) s += '★';
        if(half) s += '☆';
        while(s.length < 5) s += '☆';
        return `<span style="color:var(--primary-600);font-weight:700">${s}</span>`;
    }

    // ===== Pagination =====
    function renderPagination(total, perPage){
        const pages = Math.max(1, Math.ceil(total / perPage));
        paginationEl.innerHTML = '';
        // prev
        const prevBtn = createPagerButton('«', filters.page>1, ()=>{ if(filters.page>1){ filters.page--; renderProducts(); }});
        paginationEl.appendChild(prevBtn);
        // pages (show up to 7)
        const maxButtons = 7;
        let start = Math.max(1, filters.page - Math.floor(maxButtons/2));
        let end = Math.min(pages, start + maxButtons -1);
        if(end - start < maxButtons -1) start = Math.max(1, end - maxButtons +1);

        for(let i=start;i<=end;i++){
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = i===filters.page ? 'active' : '';
            btn.addEventListener('click', ()=>{ filters.page = i; renderProducts(); });
            paginationEl.appendChild(btn);
        }
        // next
        const nextBtn = createPagerButton('»', filters.page<pages, ()=>{ if(filters.page<pages){ filters.page++; renderProducts(); }});
        paginationEl.appendChild(nextBtn);
    }

    function createPagerButton(label, enabled, onclick){
        const btn = document.createElement('button');
        btn.textContent = label;
        if(!enabled){ btn.disabled = true; btn.style.opacity = '0.5' } else btn.addEventListener('click', onclick);
        return btn;
    }

    // ===== Cart & Wishlist =====
    function saveToStorage() {
        localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
        localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(wishlist));
    }

    function updateBadges(){
        const totalItems = cart.reduce((s,i)=>s+i.qty,0);
        cartCountBadge.textContent = totalItems;
        wishlistCountBadge.textContent = wishlist.length;
    }

    function addToCart(productId, qty = 1){
        const prod = products.find(p=>p.id===productId);
        if(!prod) return;
        const index = cart.findIndex(i=>i.id===productId);
        if(index > -1){ cart[index].qty += qty; }
        else cart.push({ id: productId, qty, name: prod.name, price: prod.price, image: prod.image });
        saveToStorage();
        updateBadges();
        renderCart();
        showToast(`${prod.name} added to cart`);
    }

    function toggleWishlist(productId, btnEl){
        const idx = wishlist.findIndex(item => item.id === productId);
        if(idx > -1){ 
            wishlist.splice(idx,1); 
            btnEl.classList.remove('active'); 
            btnEl.setAttribute('aria-pressed','false'); 
            showToast('Removed from wishlist'); 
        } else { 
            wishlist.push({ id: productId, name: products.find(p=>p.id===productId).name, price: products.find(p=>p.id===productId).price }); 
            btnEl.classList.add('active'); 
            btnEl.setAttribute('aria-pressed','true'); 
            showToast('Added to wishlist'); 
        }
        saveToStorage();
        updateBadges();
        renderWishlist();
    }

    function updateWishlistButtons() {
        document.querySelectorAll('.wishlist-btn').forEach(button => {
            const productId = parseInt(button.dataset.id);
            const isInWishlist = wishlist.find(item => item.id === productId);
            
            if (isInWishlist) {
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.innerHTML = '<i class="far fa-heart"></i>';
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }

    function openCart(){
        renderCart();
        cartModal.classList.add('open');
        cartModal.setAttribute('aria-hidden','false');
        overlay.classList.add('show');
    }

    function openWishlist(){
        renderWishlist();
        wishlistModal.classList.add('open');
        wishlistModal.setAttribute('aria-hidden','false');
        overlay.classList.add('show');
    }

    function closeCart(){
        cartModal.classList.remove('open');
        cartModal.setAttribute('aria-hidden','true');
    }

    function closeWishlist(){
        wishlistModal.classList.remove('open');
        wishlistModal.setAttribute('aria-hidden','true');
    }

    function closeModals(){
        closeCart();
        closeWishlist();
        overlay.classList.remove('show');
    }

    function renderCart(){
        cartItemsEl.innerHTML = '';
        if(cart.length === 0){
            cartItemsEl.innerHTML = `<div style="padding:24px;text-align:center;color:var(--muted)">Your cart is empty</div>`;
            cartSubtotalEl.textContent = '$0.00'; cartShippingEl.textContent = '$0.00'; cartTotalEl.textContent = '$0.00';
            updateBadges();
            return;
        }

        let subtotal = 0;
        for(const item of cart){
            const prod = products.find(p=>p.id===item.id);
            const itemTotal = item.qty * item.price;
            subtotal += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-img"><img src="${item.image}" alt="${escapeHtml(item.name)}" style="max-width:70%;max-height:70%"></div>
                <div class="cart-item-details">
                    <div style="font-weight:700">${item.name}</div>
                    <div style="color:var(--primary-800);font-weight:700;margin-top:6px">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
                        <div style="min-width:24px;text-align:center">${item.qty}</div>
                        <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
                        <button class="remove-item" data-action="remove" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
            cartItemsEl.appendChild(div);
        }

        const shipping = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + shipping;
        cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        cartShippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        cartTotalEl.textContent = `$${total.toFixed(2)}`;

        updateBadges();
    }

    function renderWishlist(){
        wishlistItemsEl.innerHTML = '';
        if(wishlist.length === 0){
            wishlistItemsEl.innerHTML = `<div style="padding:24px;text-align:center;color:var(--muted)">Your wishlist is empty</div>`;
            return;
        }

        for(const item of wishlist){
            const prod = products.find(p=>p.id===item.id);
            if(!prod) continue;

            const div = document.createElement('div');
            div.className = 'wishlist-item';
            div.innerHTML = `
                <div class="wishlist-item-img"><img src="${prod.image}" alt="${escapeHtml(item.name)}" style="max-width:80%;max-height:80%"></div>
                <div class="wishlist-item-info">
                    <div class="wishlist-item-title">${item.name}</div>
                    <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
                    <div class="wishlist-item-actions">
                        <button class="btn btn-primary" onclick="addToCartFromWishlist(${item.id})">Add to Cart</button>
                        <button class="btn btn-outline" onclick="removeFromWishlist(${item.id})">Remove</button>
                    </div>
                </div>
            `;
            wishlistItemsEl.appendChild(div);
        }
    }

    // delegate cart quantity clicks
    cartItemsEl.addEventListener('click', e=>{
        const btn = e.target.closest('button');
        if(!btn) return;
        const action = btn.dataset.action;
        const id = Number(btn.dataset.id);
        if(action === 'inc'){ changeQty(id, +1); }
        else if(action === 'dec'){ changeQty(id, -1); }
        else if(action === 'remove'){ cart = cart.filter(i=>i.id !== id); saveToStorage(); renderCart(); updateBadges(); }
    });

    function changeQty(id, delta){
        const it = cart.find(i=>i.id===id);
        if(!it) return;
        it.qty += delta;
        if(it.qty <= 0) cart = cart.filter(i=>i.id !== id);
        saveToStorage();
        renderCart();
        updateBadges();
    }

    function addToCartFromWishlist(productId){
        const product = products.find(p=>p.id===productId);
        if(!product) return;
        
        addToCart(productId);
        showToast(`${product.name} added to cart!`);
    }

    function removeFromWishlist(productId){
        wishlist = wishlist.filter(item => item.id !== productId);
        saveToStorage();
        updateBadges();
        renderWishlist();
        updateWishlistButtons();
        
        // Update the wishlist button in the product grid
        const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
        if (wishlistBtn) {
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            wishlistBtn.classList.remove('active');
            wishlistBtn.setAttribute('aria-pressed', 'false');
        }
    }

    // ===== Notifications / small helpers =====
    function showToast(msg){
        const n = document.createElement('div');
        n.style.cssText = 'position:fixed;right:20px;top:20px;background:var(--primary);color:white;padding:10px 14px;border-radius:8px;box-shadow:var(--shadow);z-index:2000';
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(()=>{ n.style.opacity = '0'; n.style.transition = 'opacity 300ms'; setTimeout(()=>n.remove(),300); }, 2200);
    }

    function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

    // Make functions globally available
    window.addToCartFromWishlist = addToCartFromWishlist;
    window.removeFromWishlist = removeFromWishlist;

    // a little accessibility: close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const nav = document.getElementById('mainNav');
        const btn = document.getElementById('mobileMenuBtn');
        if(nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)){
            nav.classList.remove('open');
        }
    });