document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");

  // Check login state
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    logoutLink.style.display = "inline";
    loginLink.style.display = "none";

    logoutLink.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
  } else {
    loginLink.style.display = "inline";
    logoutLink.style.display = "none";
  }

  // Search bar functionality
  document.getElementById("searchBtn").addEventListener("click", () => {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    if (searchQuery) {
      alert(`Searching for: ${searchQuery}`);
    }
  });

  // Cart functionality
  const cartCountElement = document.getElementById("cart-count");

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
  }
  updateCartCount();

  // Modal and Order Form functionality
  const modal = document.getElementById("orderModal");
  const closeModal = document.getElementById("closeModal");
  const orderForm = document.getElementById("orderForm");
  const paymentMethodSelect = document.getElementById("paymentMethod");
  const onlinePaymentDetails = document.getElementById("onlinePaymentDetails");
  const contactNumberField = document.getElementById("contactNumberField");

  const deliveryRadio = document.getElementById("delivery");
  const pickupRadio = document.getElementById("pickup");
  const deliveryFee = 20.0;

  // Calculate and update order details dynamically
  function calculateAndUpdateOrderDetails(productDetails = null) {
    const productName = productDetails?.name || "Coca-Cola";
    const quantity = productDetails?.quantity || 1;
    const pricePerItem = productDetails?.price || 10.0;
    const totalAmount = quantity * pricePerItem;

    let finalDetails = `
      <strong>Product Name:</strong> ${productName}<br>
      <strong>Quantity:</strong> ${quantity}<br>
      <strong>Price per Item:</strong> ₱${pricePerItem.toFixed(2)}<br>
    `;

    if (deliveryRadio.checked) {
      finalDetails += `
        <strong>Delivery Fee:</strong> ₱${deliveryFee.toFixed(2)}<br>
        <strong>Total Amount:</strong> ₱${(totalAmount + deliveryFee).toFixed(2)}
      `;
    } else if (pickupRadio.checked) {
      finalDetails += `
        <strong>Total Amount:</strong> ₱${totalAmount.toFixed(2)}
      `;
    }

    document.getElementById("orderDetails").innerHTML = finalDetails;
  }

  // Initialize payment method settings
  function initializePaymentMethod() {
    paymentMethodSelect.value = ""; // Default to no selection
    onlinePaymentDetails.style.display = "none";
    contactNumberField.style.display = "none";
  }
  initializePaymentMethod();

  // Show/hide fields based on the selected payment method
  paymentMethodSelect.addEventListener("change", () => {
    if (paymentMethodSelect.value === "gcash" || paymentMethodSelect.value === "maya") {
      onlinePaymentDetails.style.display = "block";
      contactNumberField.style.display = "none";
    } else if (paymentMethodSelect.value === "cash") {
      onlinePaymentDetails.style.display = "none";
      contactNumberField.style.display = "block";
    } else {
      onlinePaymentDetails.style.display = "none";
      contactNumberField.style.display = "none";
    }
  });

  // Update order details on delivery/pickup option change
  deliveryRadio.addEventListener("change", () => calculateAndUpdateOrderDetails());
  pickupRadio.addEventListener("change", () => calculateAndUpdateOrderDetails());

  // Close modal when the user clicks the close button
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Order form submission
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const deliveryAddress = document.getElementById("deliveryAddress").value.trim();
    const orderOption = document.querySelector("input[name='orderOption']:checked")?.value;
    const paymentMethod = paymentMethodSelect.value;

    const contactNumber = document.getElementById("contactNumber").value.trim();
    const walletSenderName = document.getElementById("walletSenderName").value.trim();
    const senderNumber = document.getElementById("senderNumber").value.trim();

    // Validation
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (!orderOption) {
      alert("Please select an order option (Delivery or Pickup).");
      return;
    }

    if (orderOption === "delivery" && (!deliveryAddress || !deliveryAddress.toLowerCase().includes("cotabato city"))) {
      alert("Delivery address must be in Cotabato City!");
      return;
    }

    if (paymentMethod === "cash" && !contactNumber) {
      alert("Please provide a contact number for Cash on Delivery.");
      return;
    }

    // GCash and PayMaya specific validation
    if (paymentMethod === "gcash" || paymentMethod === "maya") {
      if (!walletSenderName || !senderNumber) {
        alert("Please fill in both the Name of Sender and Sender's Number for GCash or PayMaya.");
        return;
      }
    }

    // Success message based on payment method
    if (paymentMethod === "cash") {
      alert("Order placed successfully with Cash on Delivery!");
    } else {
      alert("Order placed successfully with Online Payment!");
    }

    // Reset form and modal
    orderForm.reset();
    initializePaymentMethod();
    modal.style.display = "none";
  });

  // Close the modal when clicked outside of it
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Add to Cart and Buy Now functionality
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const buyButtons = document.querySelectorAll(".buy-btn");

  function addToCart(productCard) {
    const productName = productCard.querySelector("h4").innerText;
    const productPrice = parseFloat(productCard.querySelector("p").innerText.replace("₱", ""));
    const productFlavor = productCard.querySelector(".product-flavor")?.value || "Default";
    const productQuantity = parseInt(productCard.querySelector(".quantity-input")?.value || 1);
    const productImage = productCard.querySelector("img")?.src;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
      name: productName,
      price: productPrice,
      flavor: productFlavor,
      quantity: productQuantity,
      image: productImage,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${productName} added to cart!`);
  }

  function showModal(productDetails) {
    calculateAndUpdateOrderDetails(productDetails);
    modal.style.display = "block";
  }

  function buyNow(productCard) {
    const productName = productCard.querySelector("h4").innerText;
    const productPrice = parseFloat(productCard.querySelector("p").innerText.replace("₱", ""));
    const productQuantity = parseInt(productCard.querySelector(".quantity-input")?.value || 1);

    const productDetails = {
      name: productName,
      price: productPrice,
      quantity: productQuantity,
    };

    showModal(productDetails);
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target.closest(".product-card");
      addToCart(productCard);
    });
  });

  buyButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target.closest(".product-card");
      buyNow(productCard);
    });
  });

  // Category filtering functionality
  const categories = document.querySelectorAll(".category-item");
  const productGrid = document.getElementById("product-grid");
  const allProducts = Array.from(productGrid.children);

  function filterCategory(category) {
    allProducts.forEach((product) => {
      const productCategory = product.getAttribute("data-category");
      product.style.display = category === "All" || productCategory === category ? "block" : "none";
    });
  }

  categories.forEach((categoryItem) => {
    categoryItem.addEventListener("click", (event) => {
      event.preventDefault();
      const category = categoryItem.getAttribute("data-category");
      filterCategory(category);
    });
  });

  // Display all products by default
  filterCategory("All");
});
