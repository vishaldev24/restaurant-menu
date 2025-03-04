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

    const menuItems = [
        { category: 'Starters', name: 'Samosa', price: 50 },
        { category: 'Starters', name: 'Paneer Tikka', price: 150 },
        { category: 'Starters', name: 'Chicken 65', price: 200 },
        { category: 'Main Course', name: 'Butter Chicken', price: 300 },
        { category: 'Main Course', name: 'Paneer Butter Masala', price: 250 },
        { category: 'Main Course', name: 'Biryani', price: 180 },
        { category: 'Desserts', name: 'Gulab Jamun', price: 100 },
        { category: 'Desserts', name: 'Rasgulla', price: 120 },
        { category: 'Desserts', name: 'Ice Cream', price: 80 },
        { category: 'Beverages', name: 'Lassi', price: 60 },
        { category: 'Beverages', name: 'Masala Chai', price: 40 },
        { category: 'Beverages', name: 'Cold Coffee', price: 100 }
    ];

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            darkModeToggle.textContent = '🌙';
        }
    });

    // Search Functionality
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(query));
        displayMenuItems(filteredItems);
    });

    // Display Menu Items based on category
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
            menuItemElement.classList.add('menu-item');
            menuItemElement.textContent = `${item.name} - ₹${item.price}`;
            menuItemElement.addEventListener('click', () => {
                addToCart(item.name, item.price);
            });
            menuItemsContainer.appendChild(menuItemElement);
        });
    }

    function addToCart(itemName, itemPrice) {
        const cartItemElement = document.createElement('li');
        cartItemElement.textContent = `${itemName} - ₹${itemPrice}`;
        cartList.appendChild(cartItemElement);
        totalAmount += itemPrice;
        totalAmountElement.textContent = totalAmount;
    }

    // Checkout functionality
    checkoutButton.addEventListener('click', () => {
        if (cartList.childNodes.length === 0) {
            alert('Your cart is empty!');
        } else {
            alert(`Order placed successfully! Total amount: ₹${totalAmount}`);
            cartList.innerHTML = '';
            totalAmount = 0;
            totalAmountElement.textContent = totalAmount;
        }
    });

    // Voice Ordering (Example implementation, requires further development)
    voiceBtn.addEventListener('click', () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event) => {
            const voiceOrder = event.results[0][0].transcript;
            voiceText.textContent = `You said: ${voiceOrder}`;
            const matchedItem = menuItems.find(item => item.name.toLowerCase() === voiceOrder.toLowerCase());
            if (matchedItem) {
                addToCart(matchedItem.name, matchedItem.price);
            } else {
                alert('Item not found on the menu!');
            }
        };
    });

    // Initial display of all items
    displayMenuItems(menuItems);
});
