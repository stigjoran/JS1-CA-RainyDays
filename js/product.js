import { fetchProductById } from "./api.js";
import { addToCart } from "./cart.js";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const statusEl = document.querySelector("#productStatus");
const detailEl = document.querySelector("#productDetail");
 
async function init() {
    if (!id) {
        statusEl.textContent = "No product ID specified.";
        return;
    }
    statusEl.textContent = "Loading product...";
    try {
        const product = await fetchProductById(id);
        renderProduct(product);
        statusEl.textContent = "";
    } catch (error) {
        detailEl.innerHTML = "";
        statusEl.textContent = `Could not load product. Please try again.: ${error.message}`;
    }
}

function formatPrice(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function renderProduct(product) {
    const price = product.onSale ? product.discountedPrice : product.price;
    detailEl.innerHTML = `
        <img 
        src="${product.image?.url}"
        alt="${product.image?.alt || product.title}" 
        class="detail-img">

        <div class="detail-info">
            <h2>${product.title}</h2>
            <p class="price">${formatPrice(price)}</p>
            <p>${product.description}</p>

            <div class="actions">
             <button class="btn" id="addToCartBtn" type="button">
            Add to Cart
            </button>
            <a href="../checkout/index.html" class="btn">
            Go to Cart</a>
        </div>
    <a href="../index.html" class="back-link">
     Back to Shop</a>
   </div>
    `;

    const button = document.querySelector("#addToCartBtn");
    button.addEventListener("click", () => {
    addToCart(product);
    button.textContent = "Added!";
    button.disabled = true;
});
}
init();