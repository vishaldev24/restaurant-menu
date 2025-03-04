document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        darkModeToggle: document.getElementById('darkModeToggle'),
        searchInput: document.getElementById('searchInput'),
        menuItems: document.getElementById('menuItems'),
        cartList: document.getElementById('cartList'),
        totalAmount: document.getElementById('totalAmount'),
        checkout: document.getElementById('checkout'),
        fab: document.getElementById('fab'),
        categoryPopup: document.getElementById('categoryPopup'),
        categories: document.querySelectorAll('.menu-category'),
        voiceText: document.getElementById('voiceText')
    };

    let cart = {};
    let total = 0;
    let activeCategory = 'All';
    let isPopupOpen = false;

    const menuData = [
        { category: 'Indian', name: 'Samosa', price: 50, image: 'https://images.unsplash.com/photo-1601050690597-df0563f85136' },
        { category: 'Indian', name: 'Paneer Tikka', price: 150, image: 'https://images.unsplash.com/photo-1596797038530-2c107179d478' },
        { category: 'Indian', name: 'Butter Chicken', price: 300, image: 'https://images.unsplash.com/photo-1603894584373-2d63e81eb3dc' },
        { category: 'Indian', name: 'Biryani', price: 250, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' },
        { category: 'Chinese', name: 'Manchurian', price: 180, image: 'https://images.unsplash.com/photo-1626593111855-2c5d2a7e62ef' },
        { category: 'Chinese', name: 'Fried Rice', price: 120, image: 'https://images.unsplash.com/photo-1603133872878-684f5c7d25e4' },
        { category: 'Continental', name: 'Grilled Chicken', price: 280, image: 'https://images.unsplash.com/photo-1604901354522-71e55b6dbfb6' },
        { category: 'Continental', name: 'Caesar Salad', price: 150, image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74' },
        { category: 'Italian', name: 'Margherita Pizza', price: 200, image: 'https://images.unsplash.com/photo-1574071318508-1cdab4d7f8dc' },
        { category: 'Italian', name: 'Pasta Alfredo', price: 220, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9' },
        { category: 'French', name: 'Croissant', price: 80, image: 'https://images.unsplash.com/photo-1549931319-a848dcf462c5' },
        { category: 'French', name: 'Ratatouille', price: 300, image: 'https://images.unsplash.com/photo-1593251448733-38ea0d81d4b7' },
        { category: 'Desserts', name: 'Gulab Jamun', price: 100, image: 'https://images.unsplash.com/photo-1624194201968-5586f8c6e4c1' },
        { category: 'Desserts', name: 'Tiramisu', price: 150, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9' },
        { category: 'Beverages', name: 'Lassi', price: 60, image: 'https://images.unsplash.com/photo-1626502421748-7b8647830b33' },
        { category: 'Beverages', name: 'Espresso', price: 70, image: 'https://images.unsplash.com/photo-1572449043416-240f128b4d7e' }
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
    function populateMenu(searchFilter = '', categoryFilter = activeCategory) {
        elements.menuItems.innerHTML = '';
        const filteredItems = menuData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
        filteredItems.forEach(item => {
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
                showAlert('added', `${name} added to cart!`);
            });
        });
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                if (cart[name] > 0) {
                    cart[name]--;
                    if (cart[name] === 0) delete cart[name];
                    updateCart();
                    showAlert('removed', `${name} removed from cart!`);
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
            const qty = document.getElementById(`qty-${item}`);
            if (qty) qty.textContent = cart[item];
        }
        elements.totalAmount.textContent = total;
    }

    // Search
    elements.searchInput.addEventListener('input', debounce(() => {
        populateMenu(elements.searchInput.value, activeCategory);
        elements.categoryPopup.classList.remove('show');
        isPopupOpen = false;
    }, 300));

    // FAB & Voice Ordering
    elements.fab.addEventListener('click', () => {
        if (!isPopupOpen) {
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
                        showAlert('added', `${item.name} added!`);
                    } else {
                        showAlert('error', 'Item not found!');
                        elements.categoryPopup.classList.add('show');
                        isPopupOpen = true;
                    }
                };
                recognition.onend = () => elements.voiceText.textContent = 'Say a food name to add to cart';
            } else {
                showAlert('error', 'Voice not supported!');
            }
        } else {
            elements.categoryPopup.classList.remove('show');
            isPopupOpen = false;
        }
    });

    // Categories
    elements.categories.forEach(category => {
        category.addEventListener('click', () => {
            elements.categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            activeCategory = category.dataset.category;
            populateMenu(elements.searchInput.value, activeCategory);
            elements.categoryPopup.classList.remove('show');
            isPopupOpen = false;
        });
    });

    // Checkout
    elements.checkout.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            showAlert('error', 'Cart is empty!');
        } else {
            showAlert('ordered', `Order placed! Total: ₹${total}`);
            cart = {};
            updateCart();
            populateMenu();
        }
    });

    // Alert
    function showAlert(type, message) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
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
});