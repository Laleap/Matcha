document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product-list-container');
    const template = document.getElementById('product-card-template');

    if (!container || !template) {
        console.error("Initialization error: Missing container or template.");
        return;
    }

    // --- Fetch Data ---
    let products = [];
    try {
        const response = await fetch('products.json');
        products = await response.json();
    } catch (error) {
        console.error("Failed to load products.json:", error);
        container.innerHTML = "<p>Sorry, the product list is currently unavailable.</p>";
        return;
    }

    // Loop through products and create cards
    products.forEach(product => {
        //  Clone the hidden template card
        const newCard = template.cloneNode(true);
        newCard.style.display = 'block'; 
        newCard.removeAttribute('id');

        //  Target elements for data injection
        const link = newCard.querySelector('.product-link');
        const img = newCard.querySelector('.product-img-main');
        const title = newCard.querySelector('.product-title');
        const price = newCard.querySelector('.product-price');
        const viewBtn = newCard.querySelector('.add-to-cart-btn');

        //  Populate Data and Set Links
        const detailUrl = `product-detail.html?id=${product.id}`;
        
        // Link wrapper
        link.href = detailUrl;
        
        // Image details
        img.src = product.image_url;
        img.alt = product.title;
        // Assuming your JSON has hover images:
        if (product.hover_image_url) {
            img.setAttribute('data-hover-src', product.hover_image_url);
        }

        // Text details
        title.textContent = product.title;
        price.textContent = `$${product.variants[0].price.toFixed(2)}`;
        
        // "View Details" button
        viewBtn.href = detailUrl;

        //  Add the card to the shop container
        container.appendChild(newCard);
    });
    //Image swap on hover
    initializeImageSwap(); 
});

// image swap function for completeness:
function initializeImageSwap() {
    const productImages = document.querySelectorAll('.product-img-main');
    productImages.forEach(img => {
        const originalSrc = img.src;
        const hoverSrc = img.getAttribute('data-hover-src');

        if (hoverSrc) { 
            new Image().src = hoverSrc; // Preload
            img.addEventListener('mouseenter', () => {
                img.src = hoverSrc;
            });
            img.addEventListener('mouseleave', () => {
                img.src = originalSrc;
            });
        }
    });
}