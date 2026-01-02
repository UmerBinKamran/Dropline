function addToCart(name, price) {
  const item = cart.find((i) => i.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
}
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSidebar = document.getElementById("cartSidebar");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");

cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("open");
  renderCart();
});

closeCart.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
});

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty</p>";
    cartTotalEl.textContent = "Total: $0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small>$${item.price}</small>
          <div class="qty-controls">
            <button onclick="changeQty(${index}, -1)">−</button>
            ${item.qty}
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>
        <span class="remove-item" onclick="removeItem(${index})">❌</span>
      `;

    cartItemsEl.appendChild(div);
  });

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function changeQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

updateCartCount();
