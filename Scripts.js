// Enhanced admin.js
let products = JSON.parse(localStorage.getItem("products")) || [];

const adminProducts = document.getElementById("adminProducts");

document.addEventListener('DOMContentLoaded', function() {
  renderAdmin();
  
  // Add product on Enter key
  document.getElementById('name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addProduct();
  });
  document.getElementById('price').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addProduct();
  });
  document.getElementById('image').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addProduct();
  });
});

function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const image = document.getElementById("image").value.trim();
  
  if (!name || !price || !image) {
    alert("Please fill in all fields!");
    return;
  }
  
  const product = {
    id: Date.now(),
    name: name,
    price: parseInt(price),
    image: image,
    category: "all",
    description: ""
  };
  
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
  
  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  
  renderAdmin();
  showAdminNotification("Product added successfully!");
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  
  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  renderAdmin();
  showAdminNotification("Product deleted successfully!");
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  
  // Create edit form
  const editForm = `
    <div class="edit-form">
      <h4>Edit Product</h4>
      <input type="text" id="editName" value="${product.name}" placeholder="Product Name">
      <input type="number" id="editPrice" value="${product.price}" placeholder="Price">
      <input type="text" id="editImage" value="${product.image}" placeholder="Image URL">
      <select id="editCategory">
        <option value="all" ${product.category === 'all' ? 'selected' : ''}>All</option>
        <option value="girls" ${product.category === 'girls' ? 'selected' : ''}>Girls</option>
        <option value="boys" ${product.category === 'boys' ? 'selected' : ''}>Boys</option>
        <option value="accessories" ${product.category === 'accessories' ? 'selected' : ''}>Accessories</option>
      </select>
      <textarea id="editDescription" placeholder="Description">${product.description || ''}</textarea>
      <div class="edit-buttons">
        <button onclick="saveProduct(${id})">Save</button>
        <button onclick="cancelEdit(${id})">Cancel</button>
      </div>
    </div>
  `;
  
  // Find and replace the product element
  const productElement = document.querySelector(`[data-id="${id}"]`);
  productElement.innerHTML = editForm;
}

function saveProduct(id) {
  const product = products.find(p => p.id === id);
  
  product.name = document.getElementById("editName").value;
  product.price = parseInt(document.getElementById("editPrice").value);
  product.image = document.getElementById("editImage").value;
  product.category = document.getElementById("editCategory").value;
  product.description = document.getElementById("editDescription").value;
  
  localStorage.setItem("products", JSON.stringify(products));
  renderAdmin();
  showAdminNotification("Product updated successfully!");
}

function cancelEdit(id) {
  renderAdmin();
}

function renderAdmin() {
  adminProducts.innerHTML = "";
  
  if (products.length === 0) {
    adminProducts.innerHTML = '<p class="no-products">No products yet. Add your first product!</p>';
    return;
  }
  
  products.forEach(p => {
    adminProducts.innerHTML += `
      <div class="admin-product" data-id="${p.id}">
        <div class="product-info">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <p>৳ ${p.price.toLocaleString()} • ${p.category}</p>
          </div>
        </div>
        <div class="product-actions">
          <button class="edit-btn" onclick="editProduct(${p.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="delete-btn" onclick="deleteProduct(${p.id})">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  });
}

function showAdminNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'admin-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add admin-specific CSS
const adminStyle = document.createElement('style');
adminStyle.textContent = `
  body {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h2 {
    color: var(--secondary);
    margin-bottom: 30px;
    font-family: 'Quicksand', sans-serif;
  }
  
  input {
    width: 100%;
    padding: 12px 15px;
    margin-bottom: 15px;
    border: 2px solid var(--light-gray);
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
  }
  
  button {
    background: var(--secondary);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);
    margin-right: 10px;
  }
  
  button:hover {
    background: #5a4fcf;
  }
  
  #adminProducts {
    margin-top: 40px;
  }
  
  .admin-product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow);
    margin-bottom: 15px;
  }
  
  .product-info {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .product-info img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .product-info h4 {
    margin-bottom: 5px;
    color: var(--dark);
  }
  
  .product-info p {
    color: var(--gray);
    font-size: 0.9rem;
  }
  
  .product-actions {
    display: flex;
    gap: 10px;
  }
  
  .edit-btn, .delete-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    font-size: 0.9rem;
  }
  
  .edit-btn {
    background: var(--success);
  }
  
  .edit-btn:hover {
    background: #00a085;
  }
  
  .delete-btn {
    background: var(--primary);
  }
  
  .delete-btn:hover {
    background: var(--primary-dark);
  }
  
  .edit-form {
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow);
    width: 100%;
  }
  
  .edit-form h4 {
    margin-bottom: 20px;
    color: var(--dark);
  }
  
  .edit-form input, .edit-form select, .edit-form textarea {
    width: 100%;
    padding: 10px 15px;
    margin-bottom: 15px;
    border: 2px solid var(--light-gray);
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
  }
  
  .edit-form textarea {
    height: 100px;
    resize: vertical;
  }
  
  .edit-buttons {
    display: flex;
    gap: 10px;
  }
  
  .admin-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--success);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    transform: translateY(100%);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .admin-notification.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .no-products {
    text-align: center;
    padding: 40px;
    color: var(--gray);
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow);
  }
`;
document.head.appendChild(adminStyle);