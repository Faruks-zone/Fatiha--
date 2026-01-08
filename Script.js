// Enhanced script.js
let products = JSON.parse(localStorage.getItem("products")) || [
  { 
    id: 1, 
    name: "Girls Party Dress", 
    price: 1850, 
    image: "https://i.imgur.com/JFH6JpZ.jpg",
    category: "girls",
    description: "Beautiful floral dress perfect for special occasions"
  },
  { 
    id: 2, 
    name: "Boys Casual Set", 
    price: 1250, 
    image: "https://i.imgur.com/7bF5X0N.jpg",
    category: "boys",
    description: "Comfortable cotton set for everyday wear"
  },
  { 
    id: 3, 
    name: "Kids Winter Jacket", 
    price: 2200, 
    image: "https://i.imgur.com/vYlY5QX.jpg",
    category: "boys",
    description: "Warm and stylish jacket for cold weather"
  },
  { 
    id: 4, 
    name: "Princess Gown", 
    price: 2500, 
    image: "https://i.imgur.com/mN7F0sk.jpg",
    category: "girls",
    description: "Elegant gown with sequin details"
  },
  { 
    id: 5, 
    name: "Unisex Backpack", 
    price: 850, 
    image: "https://i.imgur.com/QB2L1qj.jpg",
    category: "accessories",
    description: "Durable backpack for school and travel"
  },
  { 
    id: 6, 
    name: "Baby Romper Set", 
    price: 950, 
    image: "https://i.imgur.com/3pWqUJ2.jpg",
    category: "girls",
    description: "Soft and cute romper for toddlers"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("productList");
const cartCountElements = document.querySelectorAll("#cartCount, #cartCountMobile");
const cartModal = document.getElementById("cartModal");
const overlay = document.getElementById("overlay");
const mobileMenu = document.getElementById("mobileMenu");

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  updateCartCount();
  
  // Close cart when clicking outside on mobile
  overlay.addEventListener('click', closeCart);
  
  // Close cart with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCart();
  });
});

function renderProducts(filter = 'all') {
  productList.innerHTML = "";
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);
  
  if (filteredProducts.length === 0) {
    productList.innerHTML = `
      <div class="no-products">
        <i class="fas fa-box-open"></i>
        <h3>No products found</h3>
        <p>Try selecting a different category</p>
      </div>
    `;
    return;
  }
  
  filteredProducts.forEach(p => {
    productList.innerHTML += `
      <div class="card">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p class="description">${p.description || ''}</p>
        <p class="price">৳ ${p.price.toLocaleString()}</p>
        <button onclick="addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

function filterProducts(category) {
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  renderProducts(category);
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existingItem = cart.find(i => i.id === id);
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({...item, quantity: 1});
  }
  
  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  
  updateCartCount();
  
  // Show notification
  showNotification(`${item.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartCountElements.forEach(el => {
    el.innerText = totalItems;
  });
}

function openCart() {
  cartModal.style.display = 'flex';
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  cartModal.style.display = 'none';
  overlay.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const emptyCartMsg = document.getElementById("emptyCartMsg");
  let total = 0;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart-msg" id="emptyCartMsg">Your cart is empty</p>';
    document.getElementById("totalPrice").innerText = "0";
    return;
  }
  
  cartItems.innerHTML = "";
  cart.forEach(item => {
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;
    
    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="price">৳ ${item.price.toLocaleString()} × ${item.quantity || 1}</p>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
  
  document.getElementById("totalPrice").innerText = total.toLocaleString();
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error");
    return;
  }
  
  let msg = "Hello Fatiha Kids! I'd like to place an order:%0A%0A";
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;
    msg += `${index + 1}. ${item.name} - ৳${item.price.toLocaleString()} × ${item.quantity || 1} = ৳${itemTotal.toLocaleString()}%0A`;
  });
  
  msg += `%0ATotal: ৳${total.toLocaleString()}%0A%0APlease contact me to confirm my order.`;
  
  // Use a real WhatsApp number here
  window.open(`https://wa.me/8801XXXXXXXXX?text=${msg}`, '_blank');
  
  // Clear cart after order
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
  closeCart();
  
  showNotification("Order placed successfully! Check WhatsApp.", "success");
}

function showNotification(message, type = "success") {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) existingNotification.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 10000;
    transform: translateX(150%);
    transition: transform 0.3s ease;
    border-left: 4px solid var(--success);
  }
  
  .notification.error {
    border-left-color: var(--primary);
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification i {
    font-size: 1.2rem;
    color: var(--success);
  }
  
  .notification.error i {
    color: var(--primary);
  }
  
  .no-products {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
  }
  
  .no-products i {
    font-size: 3rem;
    color: var(--light-gray);
    margin-bottom: 20px;
  }
  
  .no-products h3 {
    color: var(--gray);
    margin-bottom: 10px;
  }
  
  .no-products p {
    color: var(--gray);
  }
`;
document.head.appendChild(style);