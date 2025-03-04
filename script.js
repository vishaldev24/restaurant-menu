document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        darkModeToggle: document.getElementById('darkModeToggle'),
        searchInput: document.getElementById('searchInput'),
        menuItems: document.getElementById('menuItems'),
        categories: document.querySelectorAll('.menu-category'),
        cartList: document.getElementById('cartList'),
        totalAmount: document.getElementById('totalAmount'),
        checkout: document.getElementById('checkout'),
        voiceBtn: document.getElementById('voiceBtn'),
        voiceText: document.getElementById('voiceText')
    };

    let cart = {};
    let total = 0;

    const menuData = [
        { category: 'Starters', name: 'Samosa', price: 50, image: 'https://images.unsplash.com/photo-1601050690597-df0563f85136' },
        { category: 'Starters', name: 'Paneer Tikka', price: 150, image: 'https://images.unsplash.com/photo-1596797038530-2c107179d478' },
        { category: 'Main Course', name: 'Butter Chicken', price: 300, image: 'https://images.unsplash.com/photo-1603894584373-2d63e81eb3dc' },
        { category: 'Desserts', name: 'Gulab Jamun', price: 100, image: 'https://images.unsplash.com/photo-1624194201968-5586f8c6e4c1' },
        { category: 'Beverages', name: 'Lassi', price: 60, image: 'https://images.unsplash.com/photo-1626502421748-7b8647830b33' }
    ];

    // Dark Mode
    elements.darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        elements.darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        elements.darkModeToggle.textContent = '☀️';
    }

    // Populate Menu
    function populateMenu(filter = '') {
        elements.menuItems.innerHTML = '';
        menuData
            .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(item => {
                const card = document.createElement('div');
                card.className = 'menu-card';
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price}</p>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" data-name="${item.name}">-</button>
                        <span class="quantity" id="qty-${item.name}">${cart[item.name] || 0}</span>
                        <button class="quantity-btn increase" data-name="${item.name}">+</button>
                    </div>
                `;
                elements.menuItems.appendChild(card);
            });
        attachCartListeners();
    }

    // Cart Listeners
    function attachCartListeners() {
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                cart[name] = (cart[name] || 0) + 1;
                updateCart();
                showAlert(`${name} added to cart!`);
            });
        });
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                if (cart[name] > 0) {
                    cart[name]--;
                    if (cart[name] === 0) delete cart[name];
                    updateCart();
                    showAlert(`${name} removed from cart!`);
                }
            });
        });
    }

    // Update Cart
    function updateCart() {
        elements.cartList.innerHTML = '';
        total = 0;
        for (const item in cart) {
            const menuItem = menuData.find(m => m.name === item);
            const itemTotal = menuItem.price * cart[item];
            total += itemTotal;
            elements.cartList.innerHTML += `<li>${item} x${cart[item]} - ₹${itemTotal}</li>`;
            document.getElementById(`qty-${item}`).textContent = cart[item];
        }
        elements.totalAmount.textContent = total;
    }

    // Search
    elements.searchInput.addEventListener('input', debounce(() => {
        populateMenu(elements.searchInput.value);
    }, 300));

    // Categories
    elements.categories.forEach(category => {
        category.addEventListener('click', () => {
            const cat = category.dataset.category;
            populateMenu(cat === 'All' ? '' : '', cat === 'All' ? null : cat);
        });
    });

    // Checkout
    elements.checkout.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            showAlert('Your cart is empty!');
        } else {
            showAlert(`Order placed! Total: ₹${total}`);
            cart = {};
            updateCart();
            populateMenu();
        }
    });

    // Voice Ordering
    elements.voiceBtn.addEventListener('click', () => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.start();
            elements.voiceText.textContent = 'Listening...';
            recognition.onresult = event => {
                const order = event.results[0][0].transcript.toLowerCase();
                elements.voiceText.textContent = `You said: ${order}`;
                const item = menuData.find(i => i.name.toLowerCase().includes(order));
                if (item) {
                    cart[item.name] = (cart[item.name] || 0) + 1;
                    updateCart();
                    showAlert(`${item.name} added to cart!`);
                } else {
                    showAlert('Item not found!');
                }
            };
            recognition.onend = () => elements.voiceText.textContent = 'Say a food name to add to cart.';
        } else {
            showAlert('Voice recognition not supported.');
        }
    });

    // Alert
    function showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 2000);
    }

    // Debounce
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    // Initial Load
    populateMenu();

    // PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(() => console.log('Service Worker Registered'));
    }
});