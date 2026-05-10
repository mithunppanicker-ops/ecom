const products = [
  {
    id: "linen-pack",
    name: "Washed Linen Travel Set",
    category: "Lifestyle",
    price: 64,
    rating: 4.8,
    badge: "New",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "desk-lamp",
    name: "Arc LED Desk Lamp",
    category: "Home",
    price: 89,
    rating: 4.7,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "city-bag",
    name: "Commuter City Backpack",
    category: "Travel",
    price: 118,
    rating: 4.9,
    badge: "Best seller",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "coffee-kit",
    name: "Compact Pour Over Kit",
    category: "Kitchen",
    price: 52,
    rating: 4.6,
    badge: "Deal",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "speaker",
    name: "Portable Room Speaker",
    category: "Tech",
    price: 136,
    rating: 4.8,
    badge: "New",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "ceramic-set",
    name: "Matte Ceramic Dinner Set",
    category: "Kitchen",
    price: 74,
    rating: 4.5,
    badge: "Limited",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "throw",
    name: "Merino Texture Throw",
    category: "Home",
    price: 96,
    rating: 4.7,
    badge: "Cozy",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "headphones",
    name: "Noise Control Headphones",
    category: "Tech",
    price: 149,
    rating: 4.9,
    badge: "Top rated",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  }
];

const state = {
  category: "All",
  search: "",
  sort: "featured",
  cart: JSON.parse(localStorage.getItem("cartlane-cart") || "{}")
};

const productGrid = document.querySelector("#productGrid");
const categoryTabs = document.querySelector("#categoryTabs");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const cartToggle = document.querySelector("#cartToggle");
const cartClose = document.querySelector("#cartClose");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartSubtotal = document.querySelector("#cartSubtotal");
const shippingLabel = document.querySelector("#shippingLabel");
const checkoutButton = document.querySelector("#checkoutButton");
const toast = document.querySelector("#toast");
const themeToggle = document.querySelector("#themeToggle");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function saveCart() {
  localStorage.setItem("cartlane-cart", JSON.stringify(state.cart));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function getFilteredProducts() {
  const term = state.search.trim().toLowerCase();
  let list = products.filter((product) => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const matchesSearch = product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  if (state.sort === "price-low") {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (state.sort === "price-high") {
    list = [...list].sort((a, b) => b.price - a.price);
  } else if (state.sort === "rating") {
    list = [...list].sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function renderCategories() {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  categoryTabs.innerHTML = categories.map((category) => `
    <button class="category-tab ${category === state.category ? "active" : ""}" type="button" data-category="${category}">
      ${category}
    </button>
  `).join("");
}

function renderProducts() {
  const list = getFilteredProducts();
  resultCount.textContent = list.length === 1 ? "Showing 1 product" : `Showing ${list.length} products`;

  if (!list.length) {
    productGrid.innerHTML = `<p class="cart-empty">No products match your filters.</p>`;
    return;
  }

  productGrid.innerHTML = list.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="badge">${product.badge}</span>
      </div>
      <div class="product-info">
        <div>
          <h3>${product.name}</h3>
          <div class="product-meta">
            <span>${product.category}</span>
            <span>${product.rating.toFixed(1)} stars</span>
          </div>
        </div>
        <div class="price-row">
          <span class="price">${currency.format(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

function getCartLines() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);
}

function renderCart() {
  const lines = getCartLines();
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  cartCount.textContent = quantity;
  cartSubtotal.textContent = currency.format(subtotal);
  shippingLabel.textContent = subtotal === 0 ? "Calculated at checkout" : subtotal >= 75 ? "Free" : currency.format(8);
  checkoutButton.disabled = subtotal === 0;

  if (!lines.length) {
    cartItems.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    return;
  }

  cartItems.innerHTML = lines.map((line) => `
    <article class="cart-item">
      <img src="${line.image}" alt="${line.name}">
      <div>
        <h3>${line.name}</h3>
        <div class="cart-line">
          <span>${currency.format(line.price)}</span>
          <div class="qty-controls" aria-label="Quantity controls for ${line.name}">
            <button class="qty-button" type="button" data-dec="${line.id}" aria-label="Decrease quantity">-</button>
            <strong>${line.quantity}</strong>
            <button class="qty-button" type="button" data-inc="${line.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  renderCart();
  const product = products.find((item) => item.id === id);
  showToast(`${product.name} added to cart`);
}

function updateQuantity(id, change) {
  const next = (state.cart[id] || 0) + change;
  if (next <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id] = next;
  }
  saveCart();
  renderCart();
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle("open", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
}

categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategories();
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const inc = event.target.closest("[data-inc]");
  const dec = event.target.closest("[data-dec]");
  if (inc) updateQuantity(inc.dataset.inc, 1);
  if (dec) updateQuantity(dec.dataset.dec, -1);
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

cartToggle.addEventListener("click", () => setCartOpen(true));
cartClose.addEventListener("click", () => setCartOpen(false));
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) setCartOpen(false);
});

checkoutButton.addEventListener("click", () => {
  showToast("Checkout is ready to connect to your payment provider.");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("cartlane-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("cartlane-theme") === "dark") {
  document.body.classList.add("dark");
}

renderCategories();
renderProducts();
renderCart();
