const menuItems = [
    { id: 1, name: "Caesar Salad", price: 12.99, image: "🥗", category: "appetizers", description: "Fresh romaine lettuce with parmesan cheese and croutons" },
    { id: 2, name: "Chicken Wings", price: 14.99, image: "🍗", category: "appetizers", description: "Spicy buffalo wings served with ranch dressing" },
    { id: 3, name: "Mozzarella Sticks", price: 9.99, image: "🧀", category: "appetizers", description: "Golden fried mozzarella with marinara sauce" },
    { id: 4, name: "Grilled Salmon", price: 24.99, image: "🐟", category: "mains", description: "Fresh Atlantic salmon with lemon butter sauce" },
    { id: 5, name: "Beef Steak", price: 28.99, image: "🥩", category: "mains", description: "Premium ribeye steak cooked to perfection" },
    { id: 6, name: "Chicken Pasta", price: 18.99, image: "🍝", category: "mains", description: "Creamy alfredo pasta with grilled chicken" },
    { id: 7, name: "Margherita Pizza", price: 16.99, image: "🍕", category: "mains", description: "Classic pizza with fresh mozzarella and basil" },
    { id: 8, name: "Beef Burger", price: 15.99, image: "🍔", category: "mains", description: "Juicy beef patty with lettuce, tomato, and fries" },
    { id: 9, name: "Chocolate Cake", price: 8.99, image: "🍰", category: "desserts", description: "Rich chocolate cake with vanilla ice cream" },
    { id: 10, name: "Cheesecake", price: 7.99, image: "🍰", category: "desserts", description: "New York style cheesecake with berry sauce" },
    { id: 11, name: "Ice Cream", price: 5.99, image: "🍨", category: "desserts", description: "Three scoops of vanilla, chocolate, and strawberry" },
    { id: 12, name: "Fresh Orange Juice", price: 4.99, image: "🍊", category: "drinks", description: "Freshly squeezed orange juice" },
    { id: 13, name: "Coffee", price: 3.99, image: "☕", category: "drinks", description: "Premium roasted coffee beans" },
    { id: 14, name: "Soft Drinks", price: 2.99, image: "🥤", category: "drinks", description: "Coca-Cola, Pepsi, Sprite, and more" },
    { id: 15, name: "Wine", price: 8.99, image: "🍷", category: "drinks", description: "House red or white wine" }
];

let order = JSON.parse(localStorage.getItem('restaurantOrder')) || [];
let favorites = JSON.parse(localStorage.getItem('restaurantFavorites')) || [];
let currentFilter = 'all';

let slideIndex = 1;

function showSlides(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');
}

function currentSlide(n) {
    slideIndex = n;
    showSlides(slideIndex);
}

function nextSlide() {
    slideIndex++;
    showSlides(slideIndex);
}

setInterval(nextSlide, 5000);

document.addEventListener('DOMContentLoaded', function () {
    loadMenu();
    updateOrderCount();
    updateFavoritesCount();
});

function filterMenu(category) {
    currentFilter = category;

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    loadMenu();
}

function loadMenu() {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    const filteredItems = currentFilter === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === currentFilter);

    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
    <div class="item-image">
        ${item.image}
        <div class="item-overlay">
            <div class="quick-actions">
                <button class="quick-btn" onclick="addToOrder(${item.id})" title="Add to Order">🛒</button>
                <button class="quick-btn" onclick="addToFavorites(${item.id})" title="Add to Favorites">❤️</button>
            </div>
        </div>
    </div>
    <div class="item-info">
        <h3 class="item-name">${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <div class="item-price">$${item.price}</div>
        <div class="item-actions">
            <button class="btn btn-small" onclick="addToOrder(${item.id})">Add to Order</button>
            <button class="btn btn-secondary btn-small" onclick="addToFavorites(${item.id})">❤️</button>
        </div>
    </div>
    `;
        menuGrid.appendChild(menuItem);
    });
}

function addToOrder(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = order.find(orderItem => orderItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        order.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('restaurantOrder', JSON.stringify(order));
    updateOrderCount();
    showSuccessMessage(`${item.name} added to order!`);
}

function addToFavorites(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = favorites.find(favItem => favItem.id === itemId);

    if (!existingItem) {
        favorites.push(item);
        localStorage.setItem('restaurantFavorites', JSON.stringify(favorites));
        updateFavoritesCount();
        showSuccessMessage(`${item.name} added to favorites!`);
    } else {
        showSuccessMessage(`${item.name} is already in favorites!`);
    }
}

function updateOrderCount() {
    const count = order.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('order-count').textContent = count;
}

function updateFavoritesCount() {
    document.getElementById('favorites-count').textContent = favorites.length;
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
