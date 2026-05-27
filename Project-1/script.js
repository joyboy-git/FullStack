let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartSummary();
    renderCart();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = Math.round(subtotal * 0.025);
    const delivery = subtotal > 0 ? 300 : 0; 
    const total = subtotal + gst + delivery;

    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('tax').textContent = `₹${gst.toLocaleString('en-IN')}`;
    document.getElementById('delivery').textContent = `₹${delivery.toLocaleString('en-IN')}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString('en-IN')}`;
    
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalQty;

    const cartFooter = document.getElementById('cartFooter');
    const cartEmpty = document.getElementById('cartEmpty');
    if (cart.length > 0) {
        cartFooter.style.display = 'block';
        cartEmpty.style.display = 'none';
    } else {
        cartFooter.style.display = 'none';
        cartEmpty.style.display = 'block';
    }
}

function renderProducts(category = 'all', searchQuery = '') {
    const grid = document.getElementById('productsGrid');
    
    let filteredProducts = window.products || [];
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    const noResults = document.getElementById('noResults');
    if (filteredProducts.length === 0) {
        noResults.style.display = 'block';
        grid.innerHTML = '';
        return;
    } else {
        noResults.style.display = 'none';
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image || product.img || 'https://via.placeholder.com/300'}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                ${product.specs ? `<p class="specs">${product.specs}</p>` : ''}
                <div class="price">₹${product.price.toLocaleString('en-IN')}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const cartEl = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartEl.innerHTML = '';
        return;
    }
    cartEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image || item.img || 'https://via.placeholder.com/50'}" alt="${item.name}">
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>₹${item.price.toLocaleString('en-IN')}</span>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `).join('');
}

function addToCart(id) {
    const productList = window.products || [];
    const product = productList.find(p => p.id === id);
    if (!product) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
        saveCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartSummary();
    renderCart();

    const productsGrid = document.getElementById('productsGrid');
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            addToCart(parseInt(e.target.dataset.id));
        }
    });

    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            const searchInput = document.getElementById('searchInput').value;
            renderProducts(category, searchInput);
        });
    });

    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', () => {
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        renderProducts(activeCategory, searchInput.value);
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
            renderProducts(activeCategory, searchInput.value);
        }
    });
});
