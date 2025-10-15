document.addEventListener('DOMContentLoaded', async () => {
    //  Get the Product ID from the URL 
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-name').textContent = "Product ID Missing. Cannot load details.";
        return;
    }
    //  Fetch Product Data 
    let product;
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        
        // Find the specific product object that matches the ID
        product = products.find(p => p.id === productId);

    } catch (error) {
        console.error("Error fetching or parsing product data:", error);
        document.getElementById('product-name').textContent = "Error loading product data.";
        return;
    }

    if (!product) {
        document.getElementById('product-name').textContent = `Product with ID "${productId}" not found.`;
        return;
    }

    // Populate the HTML Template with Product Data
    
    // Primary Info
    document.getElementById('product-name').textContent = product.title;
    document.getElementById('product-id').textContent = product.variants[0].sku;
    document.getElementById('product-price').textContent = `$${product.variants[0].price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description_short;

    // Breadcrumb and Image
    document.getElementById('breadcrumb-name').textContent = product.title;
    document.getElementById('main-product-image').src = product.image_url;
    document.getElementById('main-product-image').alt = product.title;

    // Set the product ID on the Add to Cart button for purchase logic
    const addToCartBtn = document.getElementById('add-to-cart-detail');
    if (addToCartBtn) {
        addToCartBtn.setAttribute('data-product-id', product.id);
        // Optional: Also set the price/name data if you need it for the cart logic
        addToCartBtn.setAttribute('data-product-name', product.title);
        addToCartBtn.setAttribute('data-product-price', product.variants[0].price.toFixed(2));
    }

    // Dynamic Details List
    const detailsList = document.getElementById('product-details-list');
    detailsList.innerHTML = ''; // Clear previous content
    
    // Using the 'tags' array from the sample JSON for the details list
    if (product.tags && product.tags.length > 0) {
        product.tags.forEach(tag => {
            const li = document.createElement('li');
            li.textContent = ` ${tag}`; // Adding a bullet point for style
            detailsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "No specific details available.";
        detailsList.appendChild(li);
    }
}); 

