let order = JSON.parse(localStorage.getItem('restaurantOrder')) || [];
let favorites = JSON.parse(localStorage.getItem('restaurantFavorites')) || [];
document.addEventListener('DOMContentLoaded', function () {
    loadFavoritesPage();
    updateOrderCount();
    updateFavoritesCount();
});

function loadFavoritesPage() {
    const favoritesContent = document.getElementById('favorites-content');

    if (favorites.length === 0) {
        favoritesContent.innerHTML = `
                    <div class="empty-favorites">
                        <h3>No favorite dishes yet</h3>
                        <p>Save your favorite dishes here for quick ordering later.</p>
                        <a href="../index.html" class="btn">Browse Menu</a>
                    </div>
                `;
        return;
    }

    let favoritesItemsHTML = '';

    favorites.forEach(item => {
        favoritesItemsHTML += `
                    <div class="favorite-item">
                        <div class="item-image">${item.image}</div>
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-description">${item.description}</div>
                            <div class="item-price">$${item.price}</div>
                            <div class="item-actions">
                                <button class="btn btn-secondary" onclick="addToOrder(${item.id})">Add to Order</button>
                                <button class="btn btn-danger" onclick="removeFromFavorites(${item.id})">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
    });

    favoritesContent.innerHTML = `
    <div class="favorites-grid">
        ${favoritesItemsHTML}
    </div>
    <div class="favorites-actions">
        <button class="clear-favorites" onclick="clearFavorites()">Clear All Favorites</button>
    </div>
    `;
}

function addToOrder(itemId) {
    const item = favorites.find(favItem => favItem.id === itemId);
    const existingOrderItem = order.find(orderItem => orderItem.id === itemId);

    if (existingOrderItem) {
        existingOrderItem.quantity += 1;
    } else {
        order.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('restaurantOrder', JSON.stringify(order));
    updateOrderCount();
    showSuccessMessage(`${item.name} added to order!`);
}
function removeFromFavorites(itemId) {
    const item = favorites.find(favItem => favItem.id === itemId);
    favorites = favorites.filter(favItem => favItem.id !== itemId);
    localStorage.setItem('restaurantFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
    loadFavoritesPage();
    showSuccessMessage(`${item.name} removed from favorites!`);
}
function clearFavorites() {
    if (confirm('Are you sure you want to clear all your favorite dishes?')) {
        favorites = [];
        localStorage.setItem('restaurantFavorites', JSON.stringify(favorites));
        updateFavoritesCount();
        loadFavoritesPage();
        showSuccessMessage('All favorites cleared!');
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
