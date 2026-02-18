import { fetchAllProducts } from "./api.js";

const listEl = document.querySelector("#productList");
const statusEl = document.querySelector("#productsStatus");
const genderEl = document.querySelector("#genderFilter");
const tagEl = document.querySelector("#tagFilter");
const saleEl = document.querySelector("#saleFilter");

let allProducts = [];

function setLoading(isLoading) {
    statusEl.textContent = isLoading ? "Loading products..." : "";
    listEl.setAttribute("aria-busy", isLoading ? "true" : "false");
}

function showError(message) {
statusEl.textContent = `Error: ${message}`;
statusEl.setAttribute("role", "alert");
}

function formatPrice(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function productCard(p) {
    const price = p.onSale ? p.discountedPrice : p.price;
    return `
    <div class="product-card">
        <img src="${p.image?.url}" alt="${p.image?.alt || p.title}">
        <p>${formatPrice(price)}<br>${p.title}</p>
        <a href="product/index.html?id=${p.id}" class="btn">View</a>
    </div>
    `;

}

function renderProducts(products) {
    if (products.length === 0) {
        listEl.innerHTML = "<p>No products found.</p>";
        return;
    }
    listEl.innerHTML = products.map(productCard).join("");
}

function populateTags() {
    const set = new Set();
    for (const p of allProducts) {
        if (Array.isArray(p.tags)) p.tags.forEach(t => set.add(t));
    }

    const tags = ["all", ...Array.from(set)];
    tagEl.innerHTML = tags.map(t => `<option value="${t}">${t}</option>`).join("");

}

function applyFilters() {
    const gender = genderEl.value;
    const tag = tagEl.value;
    const onSale = saleEl.checked;

    let filtered = allProducts;

    if (gender !== "all") {
        filtered = filtered.filter(p => p.gender === gender);
    }

    if (tag !== "all") {
        filtered = filtered.filter(p => Array.isArray(p.tags) && p.tags.includes(tag));
    }

    if (onSale) {
        filtered = filtered.filter((p) => p.onSale === true);
    }
    renderProducts(filtered);
}

async function init() {
    if (!listEl || !statusEl) return;

    setLoading(true);

    try {
        allProducts = await fetchAllProducts();
        setLoading(false);

        populateTags();
        applyFilters();

        genderEl.addEventListener("change", applyFilters);
        tagEl.addEventListener("change", applyFilters);
        saleEl.addEventListener("change", applyFilters);
    } catch (error) {
        setLoading(false);
        showError("Failed to load products. Please refresh the page."); 
    }
}

init();