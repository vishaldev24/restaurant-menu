document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        darkModeToggle: document.getElementById('darkModeToggle'),
        searchInput: document.getElementById('searchInput'),
        menuItems: document.getElementById('menuItems'),
        cartList: document.getElementById('cartList'),
        totalAmount: document.getElementById('totalAmount'),
        checkout: document.getElementById('checkout'),
        fab: document.getElementById('fab'),
        categoryDialer: document.getElementById('categoryDialer'),
        voiceText: document.getElementById('voiceText')
    };

    let cart = {};
    let total = 0;
    let activeCategory = 'All';
    let isDialerOpen = false;

    // Expanded Menu Data with Famous Dishes
    const menuData = [
        // Indian
        { country: 'Indian', category: 'Starters', name: 'Samosa', price: 50, image: 'https://images.unsplash.com/photo-1601050690597-df0563f85136' },
        { country: 'Indian', category: 'Starters', name: 'Paneer Tikka', price: 150, image: 'https://images.unsplash.com/photo-1596797038530-2c107179d478' },
        { country: 'Indian', category: 'Starters', name: 'Chicken 65', price: 180, image: 'https://images.unsplash.com/photo-1606502572005-8e1653e45e19' },
        { country: 'Indian', category: 'Meals', name: 'Butter Chicken', price: 300, image: 'https://images.unsplash.com/photo-1603894584373-2d63e81eb3dc' },
        { country: 'Indian', category: 'Meals', name: 'Palak Paneer', price: 250, image: 'https://images.unsplash.com/photo-1631452181840-c47e42a84102' },
        { country: 'Indian', category: 'Biryanis', name: 'Chicken Biryani', price: 280, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' },
        { country: 'Indian', category: 'Biryanis', name: 'Vegetable Biryani', price: 200, image: 'https://images.unsplash.com/photo-1581599548460-6f6bf05d9375' },
        { country: 'Indian', category: 'Desserts', name: 'Gulab Jamun', price: 100, image: 'https://images.unsplash.com/photo-1624194201968-5586f8c6e4c1' },
        { country: 'Indian', category: 'Desserts', name: 'Rasmalai', price: 120, image: 'https://images.unsplash.com/photo-1606753503640-c207d8d7e61b' },
        { country: 'Indian', category: 'Beverages', name: 'Masala Chai', price: 40, image: 'https://images.unsplash.com/photo-1576092768241-d516a48b5e79' },
        { country: 'Indian', category: 'Beverages', name: 'Lassi', price: 60, image: 'https://images.unsplash.com/photo-1626502421748-7b8647830b33' },
        // Chinese
        { country: 'Chinese', category: 'Starters', name: 'Spring Rolls', price: 100, image: 'https://images.unsplash.com/photo-1617297209067-a139068ff6ed' },
        { country: 'Chinese', category: 'Starters', name: 'Manchurian', price: 180, image: 'https://images.unsplash.com/photo-1626593111855-2c5d2a7e62ef' },
        { country: 'Chinese', category: 'Meals', name: 'Fried Rice', price: 120, image: 'https://images.unsplash.com/photo-1603133872878-684f5c7d25e4' },
        { country: 'Chinese', category: 'Meals', name: 'Chow Mein', price: 150, image: 'https://images.unsplash.com/photo-1585033581517-ecb3990c4d82' },
        { country: 'Chinese', category: 'Desserts', name: 'Honey Noodles', price: 130, image: 'https://images.unsplash.com/photo-1606755971980-5934ebfa72eb' },
        { country: 'Chinese', category: 'Beverages', name: 'Jasmine Tea', price: 50, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f' },
        // Continental
        { country: 'Continental', category: 'Starters', name: 'Bruschetta', price: 120, image: 'https://images.unsplash.com/photo-1590759487471-7694e9174880' },
        { country: 'Continental', category: 'Meals', name: 'Grilled Chicken', price: 280, image: 'https://images.unsplash.com/photo-1604901354522-71e55b6dbfb6' },
        { country: 'Continental', category: 'Meals', name: 'Fish and Chips', price: 300, image: 'https://images.unsplash.com/photo-1626645738190-6f9f06c56170' },
        { country: 'Continental', category: 'Desserts', name: 'Cheesecake', price: 150, image: 'https://images.unsplash.com/photo-1570476916978-ef48c3242f40' },
        { country: 'Continental', category: 'Beverages', name: 'Lemonade', price: 60, image: 'https://images.unsplash.com/photo-1624282605370-1f8f0f4e23af' },
        // French
        { country: 'French', category: 'Starters', name: 'French Onion Soup', price: 140, image: 'https://images.unsplash.com/photo-1454433528319-0d81d20b3db0' },
        { country: 'French', category: 'Meals', name: 'Ratatouille', price: 300, image: 'https://images.unsplash.com/photo-1593251448733-38ea0d81d4b7' },
        { country: 'French', category: 'Meals', name: 'Coq au Vin', price: 350, image: 'https://images.unsplash.com/photo-1612969334515-ebe8ed9c8cb8' },
        { country: 'French', category: 'Desserts', name: 'Croissant', price: 80, image: 'https://images.unsplash.com/photo-1549931319-a848dcf462c5' },
        { country: 'French', category: 'Desserts', name: 'Crème Brûlée', price: 160, image: 'https://images.unsplash.com/photo-1615898368183-778ec568e8f2' },
        { country: 'French', category: 'Beverages', name: 'Espresso', price: 70, image: 'https://images.unsplash.com/photo-1572449043416-240f128b4d7e' },
        // Italian
        { country: 'Italian', category: 'Starters', name: 'Caprese Salad', price: 130, image: 'https://images.unsplash.com/photo-1590226839977-3ca875f7eb0e' },
        { country: 'Italian', category: 'Meals', name: 'Margherita Pizza', price: 200, image: 'https://images.unsplash.com/photo-1574071318508-1cdab4d7f8dc' },
        { country: 'Italian', category: 'Meals', name: 'Pasta Alfredo', price: 220, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9' },
        { country: 'Italian', category: 'Desserts', name: 'Tiramisu', price: 150, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9' },
        { country: 'Italian', category: 'Beverages', name: 'Limoncello', price: 90, image: 'https://images.unsplash.com/photo-1606913046850-d540686dcef9' },
        // Japanese
        { country: 'Japanese', category: 'Starters', name: 'Miso Soup', price: 80, image: 'https://images.unsplash.com/photo-1616391208370-5d12e687b98e' },
        { country: 'Japanese', category: 'Meals', name: 'Sushi', price: 250, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351' },
        { country: 'Japanese', category: 'Meals', name: 'Ramen', price: 200, image: 'https://images.unsplash.com/photo-1617093727340-8030e1e1e476' },
        { country: 'Japanese', category: 'Desserts', name: 'Mochi', price: 100, image: 'https://images.unsplash.com/photo-1619441206518-946428a50292' },
        { country: 'Japanese', category: 'Beverages', name: 'Green Tea', price: 60, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f' },
        // Mexican
        { country: 'Mexican', category: 'Starters', name: 'Guacamole', price: 90, image: 'https://images.unsplash.com/photo-1603217098672-6bff7026b2ad' },
        { country: 'Mexican', category: 'Meals', name: 'Tacos', price: 180, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a14705' },
        { country: 'Mexican', category: 'Meals', name: 'Enchiladas', price: 200, image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed' },
        { country: 'Mexican', category: 'Desserts', name: 'Churros', price: 110, image: 'https://images.unsplash.com/photo-1603487742118-c25cdef6b1a2' },
        { country: 'Mexican', category: 'Beverages', name: 'Horchata', price: 70, image: 'https://images.unsplash.com/photo-1593827791199-e86a5d5fd422' },
        // Thai
        { country: 'Thai', category: 'Starters', name: 'Tom Yum', price: 140, image: 'https://images.unsplash.com/photo-1617096700755-494b04d0e2c6' },
        { country: 'Thai', category: 'Meals', name: 'Pad Thai', price: 220, image: 'https://images.unsplash.com/photo-1582293691387-7d5b636c0e62' },
        { country: 'Thai', category: 'Meals', name: 'Green Curry', price: 250, image: 'https://images.unsplash.com/photo-1617098900591-3f90928e8c21' },
        { country: 'Thai', category: 'Desserts', name: 'Mango Sticky Rice', price: 130, image: 'https://images.unsplash.com/photo-1605091929385-e3909d897e5f' },
        { country: 'Thai', category: 'Beverages', name: 'Thai Iced Tea', price: 80, image: 'https://images.unsplash.com/photo-1615176161339-ecdc3a69260a' }
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
    function populateMenu(searchFilter = '', countryFilter = activeCategory) {
        elements.menuItems.innerHTML = '';
        const filteredItems = menuData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase());
            const matchesCountry = countryFilter === 'All' || item.country === countryFilter;
            return matchesSearch && matchesCountry;
        });
        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <h3>${item.name}</h3>
                <p class="category">${item.category}</p>
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
                showAlert('added', `${name} added!`);
            });
        });
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                if (cart[name] > 0) {
                    cart[name]--;
                    if (cart[name] === 0) delete cart[name];
                    updateCart();
                    showAlert('removed', `${name} removed!`);
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
        elements.categoryDialer.classList.remove('show');
        isDialerOpen = false;
    }, 300));

    // FAB & Voice Ordering with Dialer
    elements.fab.addEventListener('click', () => {
        if (!isDialerOpen) {
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
                        showAlert('error', 'Dish not found!');
                        toggleDialer();
                    }
                };
                recognition.onend = () => elements.voiceText.textContent = 'Say a dish to add';
            } else {
                showAlert('error', 'Voice not supported!');
                toggleDialer();
            }
        } else {
            toggleDialer();
        }
    });

    // Dialer Setup & Categories
    const countries = [...new Set(menuData.map(item => item.country))];
    countries.forEach((country, index) => {
        const angle = (index / countries.length) * 360 - 90;
        const radius = 120;
        const x = radius * Math.cos(angle * Math.PI / 180);
        const y = radius * Math.sin(angle * Math.PI / 180);
        const btn = document.createElement('button');
        btn.className = 'menu-category';
        btn.dataset.country = country;
        btn.textContent = country;
        btn.style.left = `calc(50% + ${x}px - 40px)`;
        btn.style.top = `calc(50% + ${y}px - 20px)`;
        elements.categoryDialer.appendChild(btn);
        btn.addEventListener('click', () => {
            activeCategory = country;
            populateMenu(elements.searchInput.value, activeCategory);
            toggleDialer();
        });
    });

    function toggleDialer() {
        isDialerOpen = !isDialerOpen;
        elements.categoryDialer.classList.toggle('show', isDialerOpen);
    }

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