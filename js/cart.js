const CART_KEY = "rainydays_cart";

export function getCart() {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            discountedPrice: product.discountedPrice,
            onSale: product.onSale,
            image: product.image,
            quantity: 1 
        });
    }
    saveCart(cart);
}

export function removeFromCart(productId) {
    const cart = getCart();
    const updated = cart.filter(item => item.id !== productId);
    saveCart(updated);
}

export function clearCart() {
    saveCart([]);
}