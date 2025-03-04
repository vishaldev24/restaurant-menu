document.addEventListener('DOMContentLoaded', () => {
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

    let isDarkMode = false;
    let totalAmount = 0;
    let cart = {};

    const menuItems = [
        { category: 'Starters', name: 'Samosa', price: 50, image: 'samosa.jpg' },
        { category: 'Starters', name: 'Paneer Tikka', price: 150, image: 'paneer_tikka.jpg' },
        { category: 'Main Course', name: 'Butter Chicken', price: 300, image: 'butter_chicken.jpg' },
        { category: 'Desserts', name: 'Gulab Jamun', price: 100, image: 'gulab_jamun.jpg' },
        { category: 'Beverages', name: 'Lassi', price: 60, image: 'lassi.jpg' }
    ];

    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        body.classList.toggle('dark-mode');
        darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(query));
        displayMenuItems(filteredItems);
    });

    categories.forEach(category => {
        category.addEventListener('click', () => {
            const selectedCategory = category.textContent;
            const filteredItems = menuItems.filter(item => item.category === selectedCategory);
            displayMenuItems(filteredItems);
        });
    });

    function displayMenuItems(items) {
        menuItemsContainer.innerHTML = '';
        items.forEach(item => {
            const menuItemElement = document.createElement('div');
            menuItemElement.classList.add('menu-card');
            menuItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
                <div class="quantity-control">
                    <button class="decrease" data-name="${item.name}">-</button>
                    <span id="qty-${item.name}">0</span>
                    <button class="increase" data-name="${item.name}">+</button>
                </div>
            `;
            menuItemsContainer.appendChild(menuItemElement);
        });
        attachCartListeners();
    }

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

    function addToCart(itemName) {
        if (!cart[itemName]) cart[itemName] = 0;
        cart[itemName]++;
        updateCart();
    }

    function removeFromCart(itemName) {
        if (cart[itemName] && cart[itemName] > 0) {
            cart[itemName]--;
            if (cart[itemName] === 0) delete cart[itemName];
        }
        updateCart();
    }

    function updateCart() {
        cartList.innerHTML = '';
        totalAmount = 0;
        for (const item in cart) {
            const menuItem = menuItems.find(m => m.name === item);
            totalAmount += menuItem.price * cart[item];
            cartList.innerHTML += `<li>${item} x ${cart[item]} - ₹${menuItem.price * cart[item]}</li>`;
            document.getElementById(`qty-${item}`).textContent = cart[item];
        }
        totalAmountElement.textContent = totalAmount;
    }

    checkoutButton.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            alert('Your cart is empty!');
        } else {
            alert(`Order placed successfully! Total amount: ₹${totalAmount}`);
            cart = {};
            updateCart();
        }
    });

    voiceBtn.addEventListener('click', () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event) => {
            const voiceOrder = event.results[0][0].transcript;
            voiceText.textContent = `You said: ${voiceOrder}`;
            const matchedItem = menuItems.find(item => item.name.toLowerCase() === voiceOrder.toLowerCase());
            if (matchedItem) {
                addToCart(matchedItem.name);
            } else {
                alert('Item not found on the menu!');
            }
        };
    });

    displayMenuItems(menuItems);
});