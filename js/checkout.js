import { getCart, removeFromCart, clearCart } from "./cart.js";

const statusEl = document.querySelector("#cartStatus");
const itemsEl = document.querySelector("#cartItems");
const subtotalEl = document.querySelector("#subtotalAmount");
const shippingEl = document.querySelector("#shippingAmount");
const totalEl = document.querySelector("#cartTotal");

const paymentForm = document.querySelector("#paymentForm");
const paymentErrorEl = document.querySelector("#paymentError");


function formatPrice(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);
}

function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => {
        const unitPrice = item.onSale ? item.discountedPrice : item.price;
        return sum + unitPrice * item.quantity; 
    }, 0);
    const shipping = 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
}

function renderCart() {
    const cart = getCart();
    const payNowBtn = document.querySelector("#payNowBtn");
    if (cart.length === 0) {
        statusEl.textContent = "Your cart is empty.";
        itemsEl.innerHTML = "";
        totalEl.textContent = formatPrice(0);
        subtotalEl.textContent = formatPrice(0);
        shippingEl.textContent = formatPrice(0);

        payNowBtn.disabled = true;
        return;
    }

    statusEl.textContent = "";
    

    itemsEl.innerHTML = cart.map(item => {
        const unitPrice = item.onSale ? item.discountedPrice : item.price;
        const lineTotal = unitPrice * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image?.url}" alt="${item.image?.alt || item.title}">
                <div>
                    <h3>${item.title}</h3>
                    <p>quantity: ${item.quantity}</p>
                    <p>${formatPrice(lineTotal)}</p>
                    <button class="removeBtn" data-id="${item.id}" type="button">Remove</button>
                </div>
            </div>
        `;
    })
    .join("");

    const totals = calculateTotals(cart);
    subtotalEl.textContent = formatPrice(totals.subtotal);
    shippingEl.textContent = formatPrice(totals.shipping);
    totalEl.textContent = formatPrice(totals.total);

    document.querySelectorAll(".removeBtn").forEach(button => {
        button.addEventListener("click", () => {
            removeFromCart(button.dataset.id);
            renderCart();
        });
    });
}

function validatePaymentForm() {
    paymentErrorEl.textContent = "";

    const cart = getCart();
    if (cart.length === 0) {
        paymentErrorEl.textContent = "Your cart is empty. Add a product first.";
        return false;
    }

    const requiredIds = ["fullName", "email", "address", "city", "postalCode", "cardNumber"];
    for (const id of requiredIds) {
        const el = document.querySelector(`#${id}`);
        if (!el.value.trim()) {
            paymentErrorEl.textContent = "Please fill out all required fields.";
            return false;
        }
     }

     const email = document.querySelector("#email").value.trim();
     const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
     if (!ok) {
        paymentErrorEl.textContent = "Please enter a valid email address.";
        return false;
        }

        return true;
    }

    renderCart();

    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validatePaymentForm()) {
            clearCart();
            window.location.href = "./confirmation/index.html";
        }
    });

    
