document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const searchInput = document.getElementById('searchInput');
    const menuItemsContainer = document.querySelector('.menu-items');
    const categories = document.querySelectorAll('.menu-category');
    const cartList = document.getElementById('cartList');
    const totalAmountElement = document.getElementById('totalAmount');
    const checkoutButton = document.getElementById('checkout');
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceText = document.getElementById('voiceText');

    // State
    let isDarkMode = false;
    let cart = {};
    let totalAmount = 0;

    // Menu Data (replace with backend API in production)
    const menuItems = [
        { category: 'Starters', name: 'Samosa', price: 50, image: 'samosa.jpg' },
        { category: 'Starters', name: 'Paneer Tikka', price: 150, image: 'paneer_tikka.jpg' },
        { category: 'Main Course', name: 'Butter Chicken', price: 300, image: 'butter_chicken.jpg' },
        { category: 'Desserts', name: 'Gulab Jamun', price: 100, image: 'gulab_jamun.jpg' },
        { category: 'Beverages', name: 'Lassi', price: 60, image: 'lassi.jpg' }
    ];

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        body.classList.toggle('dark-mode');
        darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDarkMode); // Persist preference
    });

    // Restore Dark Mode Preference
    if (localStorage.getItem('darkMode') === 'true') {
        isDarkMode = true;
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    // Search Functionality
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.toLowerCase();
        const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(query));
        displayMenuItems(filteredItems);
    }, 300));

    // Category Filtering
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const selectedCategory = category.textContent;
            const filteredItems = selectedCategory === 'All' 
                ? menuItems 
                : menuItems.filter(item => item.category === selectedCategory);
            displayMenuItems(filteredItems);
        });
    });

    // Display Menu Items
    function displayMenuItems(items) {
        menuItemsContainer.innerHTML = '';
        items.forEach(item => {
            const menuItemElement = document.createElement('div');
            menuItemElement.classList.add('menu-card');
            menuItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price}</p>
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-name="${item.name}">-</button>
                    <span id="qty-${item.name}" class="quantity">${cart[item.name] || 0}</span>
                    <button class="quantity-btn increase" data-name="${item.name}">+</button>
                </div>
            `;
            menuItemsContainer.appendChild(menuItemElement);
        });
        attachCartListeners();
    }

    // Attach Cart Event Listeners
    function attachCartListeners() {
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', () => {
                addToCart(button.dataset.name);
            });
        });
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', () => {
                removeFromCart(button.dataset.name);
            });
        });
    }

    // Add to Cart
    function addToCart(itemName) {
        if (!cart[itemName]) cart[itemName] = 0;
        cart[itemName]++;
        updateCart();
        showAlert(`${itemName} added to cart!`);
    }

    // Remove from Cart
    function removeFromCart(itemName) {
        if (cart[itemName] && cart[itemName] > 0) {
            cart[itemName]--;
            if (cart[itemName] === 0) delete cart[itemName];
            updateCart();
            showAlert(`${itemName} removed from cart!`);
        }
    }

    // Update Cart UI
    function updateCart() {
        cartList.innerHTML = '';
        totalAmount = 0;
        for (const item in cart) {
            const menuItem = menuItems.find(m => m.name === item);
            const itemTotal = menuItem.price * cart[item];
            totalAmount += itemTotal;
            cartList.innerHTML += `<li>${item} x ${cart[item]} - ₹${itemTotal}</li>`;
            const qtyElement = document.getElementById(`qty-${item}`);
            if (qtyElement) qtyElement.textContent = cart[item];
        }
        totalAmountElement.textContent = totalAmount;
    }

    // Checkout
    checkoutButton.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            showAlert('Your cart is empty!');
        } else {
            showAlert(`Order placed successfully! Total: ₹${totalAmount}`);
            cart = {};
            updateCart();
        }
    });

    // Voice Ordering
    voiceBtn.addEventListener('click', () => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.start();
            voiceText.textContent = 'Listening...';
            recognition.onresult = (event) => {
                const voiceOrder = event.results[0][0].transcript.toLowerCase();
                voiceText.textContent = `You said: ${voiceOrder}`;
                const matchedItem = menuItems.find(item => 
                    item.name.toLowerCase().includes(voiceOrder)
                );
                if (matchedItem) {
                    addToCart(matchedItem.name);
                } else {
                    showAlert('Item not found. Try again!');
                }
            };
            recognition.onerror = () => {
                voiceText.textContent = 'Voice recognition failed.';
                showAlert('Voice recognition error!');
            };
            recognition.onend = () => {
                voiceText.textContent = 'Say a food name to add to cart.';
            };
        } else {
            showAlert('Voice recognition not supported in your browser.');
        }
    });

    // Alert Popup
    function showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 2000);
    }

    // Debounce Function for Search
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    // Initial Load
    displayMenuItems(menuItems);

    // PWA Service Worker Registration (Add sw.js in production)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.error('Service Worker Registration Failed:', err));
    }
});
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('foodrush-v1').then(cache => {
            return cache.addAll(['/index.html', '/styles.css', '/script.js']);
        })
    );
});
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});