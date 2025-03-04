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

    // Menu Data remains the same as previous response for brevity
    const menuData = [
        { country: 'Indian', category: 'Starters', name: 'Samosa', price: 50, image: 'https://media.istockphoto.com/id/1400734838/photo/samosa-indian-popular-street-food-or-snacks-served-with-green-and-red-chutney.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Starters', name: 'Paneer Tikka', price: 150, image: 'https://media.istockphoto.com/id/1214659508/photo/paneer-tikka-at-skewers-in-black-background.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Starters', name: 'Chicken 65', price: 180, image: 'https://media.istockphoto.com/id/1363305118/photo/chicken-65-fry-is-a-spicy-fried-chicken-dish-from-south-india.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Meals', name: 'Butter Chicken', price: 300, image: 'https://media.istockphoto.com/id/1345624940/photo/butter-chicken-curry-with-tender-chicken-breast-cream-butter-tomato-served-with-roti-paratha.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Meals', name: 'Palak Paneer', price: 250, image: 'https://media.istockphoto.com/id/1154723698/photo/palak-paneer-or-spinach-and-cottage-cheese-curry-traditional-indian-food.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Biryanis', name: 'Chicken Biryani', price: 280, image: 'https://media.istockphoto.com/id/1192094401/photo/dum-chicken-biryani-in-porcelain-bowl-on-rustic-table-popular-indian-non-vegetarian-food.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Biryanis', name: 'Vegetable Biryani', price: 200, image: 'https://media.istockphoto.com/id/1325125393/photo/vegetable-fried-rice-or-veg-biryani-or-pulav-served-in-a-bowl-with-cucumber-and-onion-slices.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Desserts', name: 'Gulab Jamun', price: 100, image: 'https://media.istockphoto.com/id/1278670699/photo/gulab-jamun-indian-sweet-dish.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Desserts', name: 'Rasmalai', price: 120, image: 'https://media.istockphoto.com/id/1264191415/photo/rasmalai-or-ras-malai-a-famous-indian-sweet-dish.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Beverages', name: 'Masala Chai', price: 40, image: 'https://media.istockphoto.com/id/1161938279/photo/indian-tea-or-masala-chai-with-spices.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Indian', category: 'Beverages', name: 'Lassi', price: 60, image: 'https://media.istockphoto.com/id/1314325926/photo/lassi-or-mango-lassi-a-traditional-indian-cold-drink.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        // Chinese
        { country: 'Chinese', category: 'Starters', name: 'Spring Rolls', price: 100, image: 'https://media.istockphoto.com/id/1053426948/photo/spring-rolls-with-vegetables-and-sauce.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Chinese', category: 'Starters', name: 'Manchurian', price: 180, image: 'https://media.istockphoto.com/id/1256113048/photo/veg-manchurian-or-manchurian-dry-a-popular-indo-chinese-dish.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Chinese', category: 'Meals', name: 'Fried Rice', price: 120, image: 'https://media.istockphoto.com/id/1217026252/photo/veg-fried-rice-or-vegetable-fried-rice.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Chinese', category: 'Meals', name: 'Chow Mein', price: 150, image: 'https://media.istockphoto.com/id/1368529336/photo/veg-chow-mein-or-vegetable-fried-noodles.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Chinese', category: 'Desserts', name: 'Honey Noodles', price: 130, image: 'https://media.istockphoto.com/id/1187253546/photo/noodles-with-sesame-seeds-and-sauce-in-a-plate-on-dark-background.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        { country: 'Chinese', category: 'Beverages', name: 'Jasmine Tea', price: 50, image: 'https://media.istockphoto.com/id/1227587352/photo/jasmine-tea-in-traditional-chinese-teacup-on-dark-background.jpg?s=612x612&w=0&k=20&c=8S8Y6t2x9zIGvF_vtWnM8kN8r5L8l08Y8Y8Y8Y8Y8Y8=' },
        // Add more countries and dishes as before...
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
        filteredItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.style.animationDelay = `${index * 0.05}s`;
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/160x120?text=${item.name}'">
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
                recognition.onend = () => elements.voiceText.textContent = 'Tap to speak or explore';
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