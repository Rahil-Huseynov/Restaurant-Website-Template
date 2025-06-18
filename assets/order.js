let order = JSON.parse(localStorage.getItem('restaurantOrder')) || [];
let favorites = JSON.parse(localStorage.getItem('restaurantFavorites')) || [];
document.addEventListener('DOMContentLoaded', function () {
    loadOrderPage();
    updateOrderCount();
    updateFavoritesCount();
});

function loadOrderPage() {
    const orderContent = document.getElementById('order-content');

    if (order.length === 0) {
        orderContent.innerHTML = `
                    <div class="empty-order">
                        <h3>Your order is empty</h3>
                        <p>Looks like you haven't added anything to your order yet.</p>
                        <a href="../index.html" class="btn">Browse Menu</a>
                    </div>
                `;
        return;
    }

    let subtotal = 0;
    let orderItemsHTML = '';

    order.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        orderItemsHTML += `
                    <div class="order-item">
                        <div class="item-image">${item.image}</div>
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-description">${item.description}</div>
                            <div class="item-price">$${item.price}</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="removeFromOrder(${item.id})">Remove</button>
                    </div>
                `;
    });

    const deliveryFee = subtotal > 25 ? 0 : 3.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    orderContent.innerHTML = `
                <div class="order-container">
                    <div class="order-items">
                        ${orderItemsHTML}
                    </div>
                    <div class="order-summary">
                        <h3 class="summary-title">Order Summary</h3>
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery Fee:</span>
                            <span>${deliveryFee === 0 ? 'Free' : '$' + deliveryFee.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax:</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        
                        <div class="delivery-options">
                            <h4>Delivery Options:</h4>
                            <div class="delivery-option">
                                <input type="radio" id="delivery" name="orderType" value="delivery" checked>
                                <label for="delivery">🚚 Delivery (30-45 min)</label>
                            </div>
                            <div class="delivery-option">
                                <input type="radio" id="pickup" name="orderType" value="pickup">
                                <label for="pickup">🏃 Pickup (15-20 min)</label>
                            </div>
                        </div>
                        
                        <a href="../index.html" class="btn btn-secondary">Continue Ordering</a>
                        <button class="btn" onclick="placeOrder()">Place Order</button>
                    </div>
                </div>
            `;
}

function updateQuantity(itemId, change) {
    const item = order.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromOrder(itemId);
        } else {
            localStorage.setItem('restaurantOrder', JSON.stringify(order));
            updateOrderCount();
            loadOrderPage();
        }
    }
}

function removeFromOrder(itemId) {
    const item = order.find(item => item.id === itemId);
    order = order.filter(item => item.id !== itemId);
    localStorage.setItem('restaurantOrder', JSON.stringify(order));
    updateOrderCount();
    loadOrderPage();
    showSuccessMessage(`${item.name} removed from order!`);
}

function updateOrderCount() {
    const count = order.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('order-count').textContent = count;
}

function updateFavoritesCount() {
    document.getElementById('favorites-count').textContent = favorites.length;
}

function placeOrder() {
    if (order.length === 0) return;

    const total = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = total > 25 ? 0 : 3.99;
    const tax = total * 0.08;
    const finalTotal = total + deliveryFee + tax;

    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const orderTypeText = orderType === 'delivery' ? 'delivery' : 'pickup';

    alert(`Thank you for your order! 
Total: $${finalTotal.toFixed(2)}
Order type: ${orderTypeText}
${orderType === 'delivery' ? 'Estimated delivery: 30-45 minutes' : 'Ready for pickup: 15-20 minutes'}`);

    order = [];
    localStorage.setItem('restaurantOrder', JSON.stringify(order));
    updateOrderCount();
    loadOrderPage();
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}
