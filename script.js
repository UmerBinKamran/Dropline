console.log("This is Working");
console.log("app.js loaded");
import { saveOrder } from "./firebase.js";
// CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSidebar = document.getElementById("cartSidebar");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");

if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartSidebar.classList.add("open");
    renderCart();
  });
}

if (closeCart) {
  closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
  });
}

window.addToCart = function (name, price) {
  const item = cart.find((i) => i.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart();
  renderCart();
};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  if (!cartCountEl) return;
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      "<p class='text-center mt-3'>Your cart is empty</p>";
    if (cartTotalEl) cartTotalEl.textContent = "Total: $0";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.className =
      "cart-item d-flex justify-content-between align-items-start mb-3";

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>$${item.price} x ${item.qty}</small>
        <div class="qty-controls mt-1">
          <button onclick="changeQty(${index}, -1)">−</button>
          ${item.qty}
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
      <span class="remove-item" onclick="removeItem(${index})">❌</span>
    `;

    cartItemsEl.appendChild(div);
  });

  if (cartTotalEl) {
    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
  }
}

window.changeQty = function (index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
};

window.removeItem = function (index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
};

updateCartCount();

//Checkout System
const checkoutItemsEl = document.getElementById("checkout-cart-items");
const checkoutTotalEl = document.getElementById("checkout-total");

function renderCheckoutCart() {
  if (!checkoutItemsEl || !checkoutTotalEl) return;

  checkoutItemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    checkoutItemsEl.innerHTML =
      "<p class='text-muted text-center'>Your cart is empty</p>";
    checkoutTotalEl.textContent = "$0.00";
    return;
  }

  cart.forEach((item) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item mb-3 d-flex justify-content-between";

    div.innerHTML = `
      <div>
        <p class="mb-1">${item.name}</p>
        <small>$${item.price} x ${item.qty}</small>
      </div>
      <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
    `;

    checkoutItemsEl.appendChild(div);
  });

  checkoutTotalEl.textContent = `$${total.toFixed(2)}`;
}

renderCheckoutCart();

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      customer: {
        name: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
      },
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      status: "pending",
    };

    try {
      const orderId = await saveOrder(orderData);

      await Swal.fire({
        icon: "success",
        title: "Order Placed!",
        html: `Your order has been placed successfully.<br><b>Order ID:</b> ${orderId}`,
        confirmButtonText: "OK",
      });

      cart = [];
      localStorage.removeItem("cart");
      saveCart();
      renderCart();
      renderCheckoutCart();
      checkoutForm.reset();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to place order. Please try again.",
        confirmButtonText: "OK",
      });
    }
  });
}
