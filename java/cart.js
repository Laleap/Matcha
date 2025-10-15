let cartItems = []; 

const cartOverlay = document.getElementById('cart-overlay');
const cartCountElement = document.getElementById('cart-item-count'); 
const cartContent = document.getElementById('cart-content');
const cartTotalElement = document.getElementById('cart-total');
const openCartLink = document.getElementById('cart-icon-link'); 
const closeCartButton = document.getElementById('close-cart');


function getPriceValue(priceText) {
    const strippedPrice = (priceText || '').replace('$', '').trim();
    return parseFloat(strippedPrice) || 0;
}

function addItemToCart(id, name, price, imageUrl) {
    const existingItem = cartItems.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({
            id: id,
            name: name,
            price: parseFloat(price),
            quantity: 1,
            imageUrl: imageUrl 
        });
    }
    
}

function removeItem(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    
    // Update UI
    updateCartDisplay();
    
    // Close the cart if it becomes empty
    if (cartItems.length === 0) {
        toggleCartOverlay(false);
    }
    // NO saveCart() CALL HERE
}

function updateCartDisplay() {
    let total = 0;
    let itemCount = 0;
    let listHTML = ''; 
    const matchaGreen = 'var(--matcha-green)'; 

    if (cartItems.length === 0) {
        listHTML = `<p class="empty-message">YOUR CART IS EMPTY!</p><p class="empty-message">Add your favorite items to your cart.</p>`;
    } else {
        cartItems.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            total += itemSubtotal;
            itemCount += item.quantity;
            
            // product info image, name, price, quantity, and remove button
            listHTML += `
                <div class="cart-item" style="display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee;">
                    
                    <img src="${item.imageUrl}" alt="${item.name}" 
                         style="width: 70px; height: 70px; object-fit: cover; border-radius: 4px;">

                    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <strong style="color: #333; font-size: 15px;">${item.name}</strong> 
                            <span style="font-weight: bold; color: ${matchaGreen}; font-size: 15px;">$${itemSubtotal.toFixed(2)}</span>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                            
                            <span style="font-size: 13px; color: #666;">Qty: ${item.quantity}</span>
                            
                            <button class="remove-item-btn" data-id="${item.id}" 
                                    style="background: none; border: none; cursor: pointer; color: #d63031; font-size: 14px; text-decoration: underline; padding: 0;">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    cartContent.innerHTML = listHTML;
    cartCountElement.textContent = itemCount;
    cartTotalElement.textContent = `$${total.toFixed(2)}`;

    // product remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.getAttribute('data-id');
            removeItem(productId);
        });
    });
}

// slide cart overlay
function toggleCartOverlay(show) {
    if (cartOverlay) {
        if (show) {
            cartOverlay.classList.remove('hidden');
        } else {
            cartOverlay.classList.add('hidden');
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay(); 

    // (Open/Close Cart) ---
    if (openCartLink) {
        openCartLink.addEventListener('click', (e) => {
            e.preventDefault(); 
            updateCartDisplay(); 
            toggleCartOverlay(true);
        });
    }

    if (closeCartButton) {
        closeCartButton.addEventListener('click', () => {
            toggleCartOverlay(false);
        });
    }
    
    // ---Qtantity ---
    const qtyInput = document.querySelector('.qty-input');
    const minusBtn = document.querySelector('.qty-btn:first-child');
    const plusBtn = document.querySelector('.qty-btn:nth-child(3)');

    if (qtyInput && minusBtn && plusBtn) {
        minusBtn.addEventListener('click', () => {
            let currentValue = parseInt(qtyInput.value);
            let minValue = parseInt(qtyInput.min) || 1; 
            if (currentValue > minValue) {
                qtyInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let currentValue = parseInt(qtyInput.value);
            qtyInput.value = currentValue + 1;
        });
    }

    //  Product Detail Page ADD TO CART ---
    const addToCartDetailButton = document.getElementById('add-to-cart-detail');

    if (addToCartDetailButton) {
        addToCartDetailButton.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Capture Data from the page elements
            const productId = document.getElementById('product-id').textContent.trim() || 'NO-SKU'; 
            const productName = document.getElementById('product-name').textContent.trim() || 'Unknown Product';
            const priceText = document.getElementById('product-price').textContent.trim();
            const productPrice = getPriceValue(priceText);
            const quantity = parseInt(qtyInput.value) || 1; 
            // Get the image source from the main product image element
            const productImageUrl = document.getElementById('main-product-image').src; 

            // 2. Add item(s) and update UI
            if (productPrice > 0 && productId !== 'NO-SKU') {
                for (let i = 0; i < quantity; i++) {
                    // Pass the image URL here
                    addItemToCart(productId, productName, productPrice, productImageUrl); 
                }
                
                updateCartDisplay(); 
                toggleCartOverlay(true);
            } else {
                console.error("Add to Cart failed: Product data is missing or invalid.");
            }
        });
    }
});