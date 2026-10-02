const loader = document.getElementById('loader');

setTimeout(function() {
    loader.classList.add('hide');
    console.log('⏳ Loader hidden - page is ready!');
}, 2000);

console.log('☕ Coffee Shop JavaScript is loading...');




const savedCart = localStorage.getItem('coffeeCart');
if (savedCart) {  
    cart = JSON.parse(savedCart);  
} else {
    cart = [];
}

let cartTotal = 0; 


const addButtons = document.querySelectorAll('.add-btn');


const cartElement = document.getElementById('cart-btn');


const cartCountElement = document.querySelector('.cart-count');

console.log('Found ' + addButtons.length + ' products');
console.log('Cart element found?', cartElement ? 'Yes ✅' : 'No ❌');








const cartDropdown = document.createElement('div');


cartDropdown.className = 'cart-dropdown';





cartDropdown.innerHTML = `
    <h3>🛒 Your Order</h3>
    <div class="cart-items"></div>
    
    <div class="coupon-section">
        <input type="text" id="couponInput" placeholder="Enter coupon code" class="coupon-input">
        <button id="applyCoupon" class="coupon-btn">Apply</button>
    </div>
    <div id="couponMessage" class="coupon-message" style="display: none;"></div>
    
    <div class="cart-total">Total: $<span class="total-amount">0.00</span></div>
    <div id="discountRow" class="discount-row" style="display: none;">
        <span>Discount:</span>
        <span id="discountAmount">-$0.00</span>
    </div>
    <div id="finalTotal" class="final-total" style="display: none;">
        Final Total: $<span id="finalAmount">0.00</span>
    </div>
    
    <!-- ============================================================
    PAYMENT METHOD SELECTOR - NEW!
    ============================================================ -->
    <div class="payment-method-selector">
        <h4>💰 Payment Method</h4>
        <div class="payment-options">
            <button type="button" class="payment-option active" data-method="cash">
                <span class="payment-option-icon">💵</span>
                <span class="payment-option-label">Cash</span>
                <span class="payment-option-check">✓</span>
            </button>
            <button type="button" class="payment-option" data-method="card">
                <span class="payment-option-icon">💳</span>
                <span class="payment-option-label">Card</span>
                <span class="payment-option-check">✓</span>
            </button>
        </div>
    </div>
    
    <!-- ============================================================
    CASH PAYMENT INFO (shown when Cash selected)
    ============================================================ -->
    <div id="cashPaymentInfo" class="cash-payment-info">
        <div class="cash-info-box">
            <span class="cash-icon">💵</span>
            <p><strong>Pay at the counter</strong></p>
            <p class="cash-subtext">Your order will be prepared and you can pay when you pick it up.</p>
        </div>
    </div>
    
    <!-- ============================================================
    CARD PAYMENT FORM (shown when Card selected)
    ============================================================ -->
    <div id="paymentSection" class="payment-section" style="display: none;">
        <h4>💳 Card Details</h4>
        
        <div class="card-preview">
            <div class="card-preview-chip">💳</div>
            <div class="card-preview-number" id="previewNumber">•••• •••• •••• ••••</div>
            <div class="card-preview-bottom">
                <div>
                    <small>CARD HOLDER</small>
                    <div id="previewName">YOUR NAME</div>
                </div>
                <div>
                    <small>EXPIRES</small>
                    <div id="previewExpiry">MM/YY</div>
                </div>
            </div>
        </div>
        
        <div class="payment-field">
            <label>Card Number</label>
            <input type="text" id="cardNumber" class="payment-input" placeholder="1234 5678 9012 3456" maxlength="19" inputmode="numeric" autocomplete="cc-number">
        </div>
        
        <div class="payment-field">
            <label>Cardholder Name</label>
            <input type="text" id="cardName" class="payment-input" placeholder="John Doe" autocomplete="cc-name">
        </div>
        
        <div class="payment-row">
            <div class="payment-field">
                <label>Expiry Date</label>
                <input type="text" id="cardExpiry" class="payment-input" placeholder="MM/YY" maxlength="5" inputmode="numeric" autocomplete="cc-exp">
            </div>
            <div class="payment-field">
                <label>CVV</label>
                <input type="text" id="cardCVV" class="payment-input" placeholder="123" maxlength="4" inputmode="numeric" autocomplete="cc-csc">
            </div>
        </div>
        
        <div class="payment-methods">
            <span class="payment-icon">💳 Visa</span>
            <span class="payment-icon">💳 Mastercard</span>
            <span class="payment-icon">💳 Amex</span>
        </div>
    </div>
    
    <button class="checkout-btn">Checkout</button>
`;



















document.body.appendChild(cartDropdown);
console.log('✅ Cart added to page');









cartElement.addEventListener('click', function(e) {
    e.stopPropagation();
    cartDropdown.classList.toggle('active');
    updateCartDisplay();
});

document.addEventListener('click', function() {
    cartDropdown.classList.remove('active');
});

cartDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
});











addButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const name = this.dataset.name;
        const price = parseFloat(this.dataset.price);
        
        console.log('Added: ' + name + ' ($' + price + ')');
        
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        updateCart();
        showAddedFeedback(this);
    });
});






function updateCart() {
    const totalItems = cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);
    
    cartCountElement.textContent = totalItems;
    
    cartTotal = cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);
    
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    
    if (cartDropdown.classList.contains('active')) {
        updateCartDisplay();
    }
}







function updateCartDisplay() {
    const cartItemsContainer = cartDropdown.querySelector('.cart-items');
    const totalAmountElement = cartDropdown.querySelector('.total-amount');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart">Your cart is empty ☕</div>`;
    } else {
        let html = '';
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const itemTotal = (item.price * item.quantity).toFixed(2);
            
            html += `
                <div class="cart-item">
                    <span class="item-name">${item.name} × ${item.quantity}</span>
                    <span>
                        <span class="item-price">$${itemTotal}</span>
                        <button class="remove-btn" data-index="${i}">✕</button>
                    </span>
                </div>
            `;
        }
        cartItemsContainer.innerHTML = html;
        
        cartItemsContainer.querySelectorAll('.remove-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCart();
                updateCartDisplay();
            });
        });
    }
    
    totalAmountElement.textContent = cartTotal.toFixed(2);
}


const checkoutBtn = cartDropdown.querySelector('.checkout-btn');
checkoutBtn.addEventListener('click', function(e) {
    
    if (cart.length === 0) {
        alert('Your cart is empty! Add some items first. ☕');
        return;
    }





const orderData = {
    items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
    })),
    total: cartTotal,
    paymentMethod: typeof selectedPaymentMethod !== 'undefined' ? selectedPaymentMethod : 'cash'
};

console.log('📤 Sending order to backend:', orderData);

fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
})
.then(response => response.json())
.then(data => {
    console.log('✅ Order saved in MongoDB:', data);
})
.catch(error => {
    console.error('❌ Error sending order:', error);
});




































fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: cartTotal,
        paymentMethod: typeof selectedPaymentMethod !== 'undefined' ? selectedPaymentMethod : 'cash'
    })
})
.then(response => response.json())
.then(data => {
    console.log('✅ Order sent to backend!', data);
})
.catch(error => {
    console.error('❌ Error sending order:', error);
});





























































    
    if (typeof selectedPaymentMethod !== 'undefined' && selectedPaymentMethod === 'card') {
        const cardNum = document.getElementById('cardNumber');
        const cardNameInput = document.getElementById('cardName');
        const cardExp = document.getElementById('cardExpiry');
        const cardCvv = document.getElementById('cardCVV');
        
        if (!cardNum || cardNum.value.replace(/\s/g, '').length < 13) {
            e.stopImmediatePropagation();
            alert('⚠️ Please enter a valid card number');
            return;
        }
        
        if (!cardNameInput || cardNameInput.value.trim().length < 3) {
            e.stopImmediatePropagation();
            alert('⚠️ Please enter the cardholder name');
            return;
        }
        
        if (!cardExp || !cardExp.value.match(/^\d{2}\/\d{2}$/)) {
            e.stopImmediatePropagation();
            alert('⚠️ Please enter a valid expiry date (MM/YY)');
            return;
        }
        
        if (!cardCvv || cardCvv.value.length < 3) {
            e.stopImmediatePropagation();
            alert('⚠️ Please enter a valid CVV');
            return;
        }
    }
    
    const confirmationData = {
        items: cart.map(function(item) {
            return {
                name: item.name,
                price: item.price,
                quantity: item.quantity
            };
        }),
        total: cartTotal,
        paymentMethod: typeof selectedPaymentMethod !== 'undefined' ? selectedPaymentMethod : 'cash'
    };
    
    const waitTime = (typeof selectedPaymentMethod !== 'undefined' && selectedPaymentMethod === 'card') ? 2000 : 500;
    
    setTimeout(function() {
        if (typeof showOrderConfirmation === 'function') {
            showOrderConfirmation(confirmationData);
        }
        
        cart = [];
        localStorage.removeItem('coffeeCart');
        updateCart();
        updateCartDisplay();
        
        if (cartDropdown) cartDropdown.classList.remove('active');
        
    }, waitTime);
});

















































const orderBtn = document.querySelector('.order-btn');


if (orderBtn) {

  
    orderBtn.addEventListener('click', function(e) {
        // Stop the link from doing its default behavior
        e.preventDefault();

        // Find the menu section
        const menuSection = document.getElementById('menu');

        if (menuSection) {
        
            menuSection.scrollIntoView({ behavior: 'smooth' });
            console.log('  → Scrolled to menu');
        }
    });
}


function showAddedFeedback(button) {

    // Save the original text of the button
    const originalText = button.textContent;

    // Change the button text to "✅ Added!"
    button.textContent = '✅ Added!';

    // Change the button color to green
    button.style.backgroundColor = '#4CAF50';

    // After 1.5 seconds...
    setTimeout(function() {
        // Change the text back to original
        button.textContent = originalText;

        // Change the color back to brown
        button.style.backgroundColor = '#3e2723';
    }, 1500);
}

// ------------------------------------------------------------
// STEP 14: Navigation links smooth scroll
// ------------------------------------------------------------

// Find all the links in the navigation menu
const navLinks = document.querySelectorAll('.nav-links a');

// For each link...
navLinks.forEach(function(link) {

    // When a link is clicked...
    link.addEventListener('click', function(e) {

        // Get the href attribute (e.g., "#menu" or "#")
        const href = this.getAttribute('href');

        // If it's "#" (Home link)...
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('  → Scrolled to top');
        }
        // If it starts with "#" (e.g., "#menu")...
        else if (href.startsWith('#')) {
            e.preventDefault();

            // Find the element with that ID
            const target = document.querySelector(href);

            // If it exists...
            if (target) {
                // Scroll to it smoothly
                target.scrollIntoView({ behavior: 'smooth' });
                console.log('  → Scrolled to ' + href);
            }
        }
    });
});

// ------------------------------------------------------------
// STEP 15: Done! Print a success message
// ------------------------------------------------------------

console.log('☕ Coffee Shop is ready! Enjoy! 🎉');

// ============================================================
// CONTACT FORM
// ============================================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage'); // ✅ FIXED: was "fromMessage"

if (contactForm) {

    // ✅ FIXED: was "addEventListner"
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (name === '' || email === '' || message === '') {
            formMessage.style.display = 'block';
            formMessage.className = 'error'; // ✅ FIXED: removed extra space
            formMessage.textContent = '⚠️ Please fill in all fields!';
            return;
        }

        formMessage.style.display = 'block';
        formMessage.className = 'success';
        formMessage.textContent = '✅ Thank you ' + name + '! Your message has been sent. We will get back to you soon! ☕';

        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';

        console.log('📧 Message sent from: ' + name + ' (' + email + ')');
        console.log('📝 Message: ' + message);

        setTimeout(function() {
            formMessage.style.display = 'none';
        }, 5000);
    });
}

console.log('📧 Contact form is ready!');
console.log('☕ Coffee Shop website is fully complete! 🎉');

// ============================================================
// BACK TO TOP BUTTON
// ============================================================

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > window.innerHeight) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

console.log('🔝 Back to top button is ready!');

// ============================================================
// SEARCH AND FILTER
// ============================================================

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const noResults = document.getElementById('noResults');

let currentCategory = 'all';

function filterProducts() {
    const searchText = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    productCards.forEach(function(card) {
        const category = card.dataset.category;
        const matchesCategory = (currentCategory === 'all') || (category === currentCategory);
        const productName = card.querySelector('.product-info h3').textContent.toLowerCase();
        const matchesSearch = productName.includes(searchText) || searchText === '';

        if (matchesCategory && matchesSearch) {
            card.classList.remove('hidden');
            card.classList.add('show');
            visibleCount++;
        } else {
            card.classList.remove('show');
            card.classList.add('hidden');
        }
    });

    if (visibleCount === 0) {
        noResults.style.display = 'block';
        if (searchText !== '') {
            noResults.querySelector('p').textContent = `😕 No products found for "${searchInput.value}". Try a different search!`;
        } else {
            noResults.querySelector('p').textContent = '😕 No products found in this category.';
        }
    } else {
        noResults.style.display = 'none';
    }
}

searchInput.addEventListener('input', function() {
    filterProducts();
});

searchButton.addEventListener('click', function() {
    filterProducts();
});

searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        filterProducts();
    }
});

filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        filterButtons.forEach(function(btn) {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        currentCategory = this.dataset.category;
        filterProducts();
    });
});

filterProducts();

console.log('🔍 Search and filter are ready!');
console.log('📦 Found ' + productCards.length + ' products');
console.log('📂 Categories: Hot Drinks, Cold Drinks, Food');


















// ============================================================
// 🆕 DARK MODE TOGGLE
// ============================================================

const darkModeToggle = document.getElementById('darkModeToggle');
const toggleIcon = darkModeToggle.querySelector('.toggle-icon');

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    toggleIcon.textContent = '☀️';
    darkModeToggle.classList.add('dark');
}

darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        toggleIcon.textContent = '☀️';
        this.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    } else {
        toggleIcon.textContent = '🌙';
        this.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    }
});

console.log('🌙 Dark mode is ready!');

// ============================================================
//

































// ============================================================
// 🚀 FLYING PRODUCT ANIMATION
// ============================================================

console.log('🚀 Setting up flying animation...');

// ============================================================
// FUNCTION 1: Fly product to cart
// ============================================================

function flyToCart(button) {
    console.log('✈️ Animation started!');
    
    // ============================================================
    // STEP 1: Get the product card
    // ============================================================
    
    const card = button.closest('.product-card');
    if (!card) {
        console.log('❌ No product card found');
        return;
    }
    
    // ============================================================
    // STEP 2: Get the product image
    // ============================================================
    
    const img = card.querySelector('.product-image img');
    if (!img) {
        console.log('❌ No image found');
        return;
    }
    
    console.log('✅ Image found:', img.src);
    
    // ============================================================
    // STEP 3: Get the cart element
    // ============================================================
    
    const cartElement = document.getElementById('cart-btn');
    if (!cartElement) {
        console.log('❌ No cart found');
        return;
    }
    
    console.log('✅ Cart found');
    
    // ============================================================
    // STEP 4: Get positions on screen
    // ============================================================
    
    // Get image position
    const imgRect = img.getBoundingClientRect();
    const startX = imgRect.left + imgRect.width / 2 - 35;
    const startY = imgRect.top + imgRect.height / 2 - 35;
    
    // Get cart position
    const cartRect = cartElement.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2 - 30;
    const endY = cartRect.top + cartRect.height / 2 - 30;
    
    console.log('📍 Start:', startX, startY);
    console.log('📍 End:', endX, endY);
    
    // ============================================================
    // STEP 5: Create flying image
    // ============================================================
    
    const flyingImg = document.createElement('img');
    flyingImg.src = img.src;
    flyingImg.alt = 'Flying product';
    flyingImg.className = 'flying-product';
    
    // Position at start
    flyingImg.style.left = startX + 'px';
    flyingImg.style.top = startY + 'px';
    flyingImg.style.width = '70px';
    flyingImg.style.height = '70px';
    flyingImg.style.borderRadius = '12px';
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
    flyingImg.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // Add to page
    document.body.appendChild(flyingImg);
    console.log('✈️ Flying image created');
    
    // ============================================================
    // STEP 6: Force browser to render
    // ============================================================
    
    // This makes sure the browser registers the starting position
    void flyingImg.offsetWidth;
    
    // ============================================================
    // STEP 7: Fly to cart!
    // ============================================================
    
    setTimeout(function() {
        flyingImg.style.left = endX + 'px';
        flyingImg.style.top = endY + 'px';
        flyingImg.style.width = '40px';
        flyingImg.style.height = '40px';
        flyingImg.style.borderRadius = '50%';
        flyingImg.style.transform = 'scale(0.8)';
        flyingImg.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
        flyingImg.style.opacity = '0.9';
        
        console.log('✈️ Flying to cart!');
    }, 50);
    
    // ============================================================
    // STEP 8: Bounce cart and remove image
    // ============================================================
    
    setTimeout(function() {
        // Bounce the cart
        cartElement.classList.add('cart-bounce');
        console.log('💥 Cart bouncing!');
        
        // Remove bounce after animation
        setTimeout(function() {
            cartElement.classList.remove('cart-bounce');
        }, 600);
        
        // Create particle burst
        createParticles(endX, endY);
        
        // Remove flying image
        if (flyingImg && flyingImg.parentNode) {
            flyingImg.remove();
            console.log('✈️ Flying image removed');
        }
    }, 1000);
}

// ============================================================
// FUNCTION 2: Create particles
// ============================================================

function createParticles(x, y) {
    console.log('💥 Creating particles!');
    
    const colors = ['#d7a86e', '#c4955a', '#f5d6b3', '#3e2723', '#e8c08a', '#4CAF50', '#e74c3c'];
    
    for (let i = 0; i < 16; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 120;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 4 + Math.random() * 10;
        
        // Position at cart
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
        
        // Calculate flight path
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        // Add to page
        document.body.appendChild(particle);
        
        // Remove after animation
        setTimeout(function() {
            if (particle && particle.parentNode) {
                particle.remove();
            }
        }, 900);
    }
}

// ============================================================
// FUNCTION 3: Connect to Add to Order buttons
// ============================================================

function setupFlyingAnimation() {
    console.log('🔧 Setting up buttons...');
    
    // Get all add buttons
    const buttons = document.querySelectorAll('.add-btn');
    console.log('📦 Found ' + buttons.length + ' buttons');
    
    buttons.forEach(function(button, index) {
        // Remove old listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new click listener
        newButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            console.log('🛒 Button clicked: ' + this.dataset.name);
            
            // Get product info
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            
            // Add to cart
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name: name, price: price, quantity: 1 });
            }
            
            // Update cart
            updateCart();
            updateCartDisplay();
            
            // Button feedback
            const originalText = this.textContent;
            this.textContent = '✅ Added!';
            this.style.backgroundColor = '#4CAF50';
            setTimeout(function() {
                this.textContent = originalText;
                this.style.backgroundColor = '#3e2723';
            }.bind(this), 1200);
            
            // 🚀 CALL THE FLYING ANIMATION!
            flyToCart(this);
        });
    });
    
    console.log('✅ Animation setup complete!');
}

// ============================================================
// Run setup when page is ready
// ============================================================

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFlyingAnimation);
} else {
    setupFlyingAnimation();
}

console.log('🚀 Flying animation is ready!');
console.log('💡 Click "Add to Order" to see the magic!');















const statNumbers = document.querySelectorAll('.stat-number') ; 
if (statNumbers.length > 0 ) {
    let animated = false ; 

    const statObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if  (entry.isIntersecting && !animated) {
                animated = true ; 
                animateNumbers(); 
            }
        });
    }, {
        threshold : 0.3 
    });

    const statContainer = document.querySelector('.statistics-container ') ; 
    if (statContainer) {
        statObserver.observe(statContainer); 
    }
}



function animateNumbers() {
    statNumbers.forEach(function(stat){
        const target = parseInt(stat.getAttribute('data-target'));
        if (target === 0) return;
        
        const duration = 2000;
        let current = 0;
        const increment = target / (duration / 16);
        const isLarge = target >= 1000;

        const timer = setInterval(function(){
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            let displayValue = Math.floor(current);
            if (isLarge && current >= 1000) {
                displayValue = (current / 1000).toFixed(1) + 'K';
            }

            stat.textContent = displayValue;

            if (isLarge && current >= target) {
                stat.innerHTML = displayValue + '<span class="plus">+</span>';
            }
        }, 16);
    });
}









// ============================================================
// SCROLL PROGRESS BAR
// ============================================================

const progressFill = document.getElementById('progressFill');

if (progressFill) {
    window.addEventListener('scroll', function() {
        // Calculate how far you've scrolled
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.pageYOffset;
        const scrolled = (scrollTop / scrollHeight) * 100;
        
        // Update the progress bar
        progressFill.style.width = scrolled + '%';
        
        // Change color when at 100%
        if (scrolled >= 100) {
            progressFill.style.background = '#4CAF50';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #d7a86e, #c4955a, #d7a86e)';
            progressFill.style.backgroundSize = '200% 100%';
        }
    });
    
    console.log('📊 Scroll progress bar is ready!');
}















const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

if (hamburger && navLinksMenu) {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinksMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinksMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    overlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinksMenu.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    navLinksMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinksMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    console.log('📱 Hamburger menu is ready!');
}


















// ============================================================
// LIVE SEARCH SUGGESTIONS
// ============================================================

// ============================================================
// STEP 1: Get the suggestions container
// ============================================================

const searchSuggestions = document.getElementById('searchSuggestions');

// ============================================================
// STEP 2: Get all product data
// ============================================================

const allProducts = [];
document.querySelectorAll('.product-card').forEach(function(card) {
    const name = card.querySelector('.product-info h3').textContent.trim();
    const price = card.querySelector('.price').textContent.trim();
    const category = card.dataset.category;
    const img = card.querySelector('.product-image img');
    
    // Get icon based on category
    let icon = '🍽️';
    if (category === 'hot') icon = '☕';
    if (category === 'cold') icon = '🧊';
    if (category === 'food') icon = '🍰';
    
    // Get category name
    let categoryName = 'Food';
    if (category === 'hot') categoryName = 'Hot';
    if (category === 'cold') categoryName = 'Cold';
    
    allProducts.push({
        name: name,
        price: price,
        category: category,
        categoryName: categoryName,
        icon: icon,
        img: img ? img.src : '',
        element: card
    });
});

console.log('🔍 Found', allProducts.length, 'products for suggestions');

// ============================================================
// STEP 3: Show suggestions as you type
// ============================================================

if (searchSuggestions && searchInput) {
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        // Clear suggestions
        searchSuggestions.innerHTML = '';
        
        // Hide if empty
        if (query === '') {
            searchSuggestions.classList.remove('active');
            return;
        }
        
        // Find matching products
        const matches = allProducts.filter(function(product) {
            return product.name.toLowerCase().includes(query);
        });
        
        // Show suggestions
        if (matches.length === 0) {
            searchSuggestions.innerHTML = `
                <div class="search-suggestion-empty">
                    😕 No products found for "${this.value}"
                </div>
            `;
            searchSuggestions.classList.add('active');
            return;
        }
        
        // Limit to 6 suggestions
        const limitedMatches = matches.slice(0, 6);
        
        limitedMatches.forEach(function(product) {
            const item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.innerHTML = `
                <span class="suggestion-icon">${product.icon}</span>
                <span class="suggestion-name">${product.name}</span>
                <span class="suggestion-category">${product.categoryName}</span>
                <span class="suggestion-price">${product.price}</span>
            `;
            
            // When clicked, scroll to product
            item.addEventListener('click', function() {
                searchInput.value = product.name;
                searchSuggestions.classList.remove('active');
                
                // Scroll to product
                product.element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Highlight product
                product.element.style.transition = 'box-shadow 0.3s ease';
                product.element.style.boxShadow = '0 0 0 4px rgba(215, 168, 110, 0.5)';
                
                setTimeout(function() {
                    product.element.style.boxShadow = '';
                }, 2000);
                
                // Filter to show only this product
                filterProducts();
            });
            
            searchSuggestions.appendChild(item);
        });
        
        // Show suggestions
        searchSuggestions.classList.add('active');
    });
    
    // ============================================================
    // STEP 4: Hide suggestions when clicking outside
    // ============================================================
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchSuggestions.classList.remove('active');
        }
    });
    
    // ============================================================
    // STEP 5: Hide suggestions when pressing Enter
    // ============================================================
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            searchSuggestions.classList.remove('active');
        }
    });
    
    console.log('🎯 Search suggestions are ready!');
}













document.addEventListener('click', function(e) {



    if (window.innerWidth <= 600) {
        
        const cartDropdown = document.querySelector('.cart-dropdown');
        if (cartDropdown && cartDropdown.classList.contains('active')) {
            const rect = cartDropdown.getBoundingClientRect();
            const clickX = e.clientX;
            const clickY = e.clientY;
            
            
            const closeAreaX = rect.right - 60;
            const closeAreaY = rect.top + 30;
            
            if (clickX > closeAreaX && clickY < closeAreaY) {
                cartDropdown.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    }
});


console.log('📱 Mobile cart is optimized!')

















// ============================================================
// PRODUCT RATINGS
// ============================================================

// Define ratings directly (no need for external file)
const productRatings = {
    'Espresso': { stars: 5, count: 128 },
    'Cappuccino': { stars: 5, count: 156 },
    'Latte': { stars: 4, count: 98 },
    'Green Tea': { stars: 4, count: 76 },
    'Iced Coffee': { stars: 5, count: 187 },
    'Iced Tea': { stars: 4, count: 65 },
    'Fruit Smoothie': { stars: 4, count: 89 },
    'Cheesecake': { stars: 5, count: 234 },
    'Chocolate Croissant': { stars: 5, count: 145 },
    'Blueberry Muffin': { stars: 4, count: 112 },
    'Bagel with Cream Cheese': { stars: 4, count: 78 },
    'Turkey Sandwich': { stars: 4, count: 92 },
    'Garden Salad': { stars: 4, count: 67 },
    'Pizza fruits de mer': { stars: 5, count: 156 }
};

document.querySelectorAll('.product-card').forEach(function(card) {
    const name = card.querySelector('.product-info h3').textContent.trim();
    const rating = productRatings[name];
    
    if (!rating) return;
    
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        starsHtml += i < rating.stars ? '⭐' : '☆';
    }
    
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'product-rating';
    ratingDiv.innerHTML = `
        <span class="stars">${starsHtml}</span>
        <span class="rating-count">(${rating.count})</span>
    `;
    
    const price = card.querySelector('.price');
    if (price) {
        price.parentNode.insertBefore(ratingDiv, price);
    }
});

console.log('⭐ Product ratings are ready!');























    // ============================================================
// COUPON CODES
// ============================================================

// ============================================================
// STEP 1: Define available coupons
// ============================================================

const coupons = {
    'COFFEE10': { discount: 10, type: 'percent', description: '10% off' },
    'COFFEE20': { discount: 20, type: 'percent', description: '20% off' },
    'WELCOME5': { discount: 5, type: 'fixed', description: '$5 off' },
    'FREESHIP': { discount: 0, type: 'shipping', description: 'Free shipping' },
    'FIRSTORDER': { discount: 15, type: 'percent', description: '15% off first order' }
};

// ============================================================
// STEP 2: Coupon state
// ============================================================

let appliedCoupon = null;
let discountAmount = 0;

// ============================================================
// STEP 3: Apply coupon function
// ============================================================

function applyCoupon() {
    const input = document.getElementById('couponInput');
    const message = document.getElementById('couponMessage');
    const discountRow = document.getElementById('discountRow');
    const finalTotal = document.getElementById('finalTotal');
    
    if (!input || !message) return;
    
    const code = input.value.trim().toUpperCase();
    
    // Check if empty
    if (code === '') {
        message.textContent = '⚠️ Please enter a coupon code';
        message.className = 'coupon-message error';
        message.style.display = 'block';
        return;
    }
    
    // Check if already applied
    if (appliedCoupon) {
        message.textContent = '⚠️ Coupon already applied. Remove it first.';
        message.className = 'coupon-message error';
        message.style.display = 'block';
        return;
    }
    
    // Check if coupon exists
    if (!coupons[code]) {
        message.textContent = '❌ Invalid coupon code';
        message.className = 'coupon-message error';
        message.style.display = 'block';
        
        // Shake animation
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
        return;
    }
    
    // Apply coupon
    const coupon = coupons[code];
    appliedCoupon = code;
    
    // Calculate discount
    if (coupon.type === 'percent') {
        discountAmount = (cartTotal * coupon.discount) / 100;
    } else if (coupon.type === 'fixed') {
        discountAmount = Math.min(coupon.discount, cartTotal);
    } else if (coupon.type === 'shipping') {
        discountAmount = 0;
    }
    
    // Update UI
    message.textContent = `✅ Coupon applied! ${coupon.description}`;
    message.className = 'coupon-message success';
    message.style.display = 'block';
    
    // Show discount row
    discountRow.style.display = 'flex';
    document.getElementById('discountAmount').textContent = `-$${discountAmount.toFixed(2)}`;
    
    // Show final total
    finalTotal.style.display = 'block';
    document.getElementById('finalAmount').textContent = (cartTotal - discountAmount).toFixed(2);
    
    // Clear input
    input.value = '';
    
    // Update cart
    updateCartDisplayWithDiscount();
    
    console.log('🏷️ Coupon applied:', code, '-$' + discountAmount.toFixed(2));
}

// ============================================================
// STEP 4: Shake animation for invalid coupon
// ============================================================

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// ============================================================
// STEP 5: Connect the apply button
// ============================================================

// Wait for cart dropdown to exist
setTimeout(function() {
    const applyBtn = document.getElementById('applyCoupon');
    const couponInput = document.getElementById('couponInput');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyCoupon);
    }
    
    if (couponInput) {
        couponInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCoupon();
            }
        });
    }
    
    console.log('🏷️ Coupon system is ready!');
    console.log('💡 Available codes: COFFEE10, COFFEE20, WELCOME5, FIRSTORDER');
}, 100);

// ============================================================
// STEP 6: Update cart display with discount
// ============================================================

function updateCartDisplayWithDiscount() {
    const totalElement = document.querySelector('.total-amount');
    const discountRow = document.getElementById('discountRow');
    const finalTotal = document.getElementById('finalTotal');
    
    if (!totalElement) return;
    
    const finalAmount = cartTotal - discountAmount;
    
    // Update total display
    totalElement.textContent = cartTotal.toFixed(2);
    
    // Update discount row
    if (appliedCoupon) {
        if (discountRow) {
            discountRow.style.display = 'flex';
            const discountEl = document.getElementById('discountAmount');
            if (discountEl) {
                discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
            }
        }
        
        if (finalTotal) {
            finalTotal.style.display = 'block';
            const finalEl = document.getElementById('finalAmount');
            if (finalEl) {
                finalEl.textContent = finalAmount.toFixed(2);
            }
        }
    }
}

// ============================================================
// STEP 7: Reset coupon on checkout
// ============================================================

// Override checkout to include discount
document.addEventListener('click', function(e) {
    if (e.target.closest('.checkout-btn')) {
        const finalAmount = cartTotal - discountAmount;
        
        if (appliedCoupon) {
            console.log('🏷️ Order with coupon:', appliedCoupon);
            console.log('💰 Discount:', discountAmount.toFixed(2));
            console.log('💰 Final Total:', finalAmount.toFixed(2));
        }
    }
});













// ============================================================
// ADMIN DASHBOARD
// ============================================================

// ============================================================
// STEP 1: Get elements
// ============================================================

const adminDashboard = document.getElementById('adminDashboard');
const adminClose = document.getElementById('adminClose');

// ============================================================
// STEP 2: Open dashboard with Ctrl+Shift+A
// ============================================================

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdminDashboard();
    }
});

function openAdminDashboard() {
    if (!adminDashboard) return;
    
    // Update all stats
    updateAdminStats();
    
    // Show dashboard
    adminDashboard.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('📊 Admin Dashboard opened');
}

// ============================================================
// STEP 3: Close dashboard
// ============================================================

if (adminClose) {
    adminClose.addEventListener('click', function() {
        adminDashboard.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close on outside click
if (adminDashboard) {
    adminDashboard.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Close on Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && adminDashboard.classList.contains('active')) {
        adminDashboard.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ============================================================
// STEP 4: Update admin statistics
// ============================================================

function updateAdminStats() {
    // Get analytics
    const analytics = JSON.parse(localStorage.getItem('shopAnalytics') || '{"totalOrders":0,"totalRevenue":0,"itemsSold":{}}');
    
    // Get subscribers
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    
    // Get wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Get orders
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    // Update stat cards
    const totalOrdersEl = document.getElementById('adminTotalOrders');
    const totalRevenueEl = document.getElementById('adminTotalRevenue');
    const cartItemsEl = document.getElementById('adminCartItems');
    const subscribersEl = document.getElementById('adminSubscribers');
    const wishlistEl = document.getElementById('adminWishlist');
    const topProductEl = document.getElementById('adminTopProduct');
    
    if (totalOrdersEl) totalOrdersEl.textContent = analytics.totalOrders;
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + analytics.totalRevenue.toFixed(2);
    if (cartItemsEl) cartItemsEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (subscribersEl) subscribersEl.textContent = subscribers.length;
    if (wishlistEl) wishlistEl.textContent = wishlist.length;
    
    // Find top product
    let topProduct = '-';
    let topCount = 0;
    Object.keys(analytics.itemsSold).forEach(function(product) {
        if (analytics.itemsSold[product] > topCount) {
            topCount = analytics.itemsSold[product];
            topProduct = product;
        }
    });
    
    if (topProductEl) {
        topProductEl.textContent = topProduct;
        topProductEl.style.fontSize = topProduct !== '-' ? '16px' : '24px';
    }
    
    // Show recent orders
    const recentOrdersEl = document.getElementById('adminRecentOrders');
    if (recentOrdersEl) {
        if (orders.length === 0) {
            recentOrdersEl.innerHTML = '<p class="admin-empty">No orders yet</p>';
        } else {
            let html = '';
            orders.slice(0, 5).forEach(function(order) {
                html += `
                    <div style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>Order #${String(order.id).slice(-6)}</strong>
                            <span style="color: #d7a86e; font-weight: 700;">$${order.total.toFixed(2)}</span>
                        </div>
                        <div style="font-size: 12px; color: #888;">${order.date}</div>
                    </div>
                `;
            });
            recentOrdersEl.innerHTML = html;
        }
    }
    
    console.log('📊 Admin stats updated');
}

// ============================================================
// STEP 5: Clear data button
// ============================================================

const clearDataBtn = document.getElementById('adminClearData');
if (clearDataBtn) {
    clearDataBtn.addEventListener('click', function() {
        if (confirm('⚠️ Are you sure? This will delete ALL data!')) {
            localStorage.clear();
            alert('✅ All data cleared!');
            location.reload();
        }
    });
}

// ============================================================
// STEP 6: Export data button
// ============================================================

const exportDataBtn = document.getElementById('adminExportData');
if (exportDataBtn) {
    exportDataBtn.addEventListener('click', function() {
        const data = {
            analytics: JSON.parse(localStorage.getItem('shopAnalytics') || '{}'),
            orders: JSON.parse(localStorage.getItem('orderHistory') || '[]'),
            subscribers: JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]'),
            wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]'),
            cart: JSON.parse(localStorage.getItem('coffeeCart') || '[]')
        };
        
        // Create downloadable file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'coffee-shop-data-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📥 Data exported!');
    });
}

console.log('📊 Admin Dashboard is ready!');
console.log('💡 Press Ctrl+Shift+A to open');









// ============================================================
// 💳 PAYMENT CARD FORM
// ============================================================

console.log('💳 Setting up payment system...');

// ============================================================
// STEP 1: Get all payment elements
// ============================================================

const paymentSection = document.getElementById('paymentSection');
const cardNumber = document.getElementById('cardNumber');
const cardName = document.getElementById('cardName');
const cardExpiry = document.getElementById('cardExpiry');
const cardCVV = document.getElementById('cardCVV');
const previewNumber = document.getElementById('previewNumber');
const previewName = document.getElementById('previewName');
const previewExpiry = document.getElementById('previewExpiry');

// ============================================================
// STEP 2: Show payment form when items are added
// ============================================================

function showPaymentForm() {
    if (paymentSection && cart.length > 0) {
        paymentSection.style.display = 'block';
    } else if (paymentSection) {
        paymentSection.style.display = 'none';
    }
}

// ============================================================
// STEP 3: Card Number - Auto-format with spaces
// ============================================================

if (cardNumber) {
    cardNumber.addEventListener('input', function(e) {
        // Remove all non-digits
        let value = this.value.replace(/\D/g, '');
        
        // Limit to 16 digits
        value = value.substring(0, 16);
        
        // Add spaces every 4 digits
        value = value.replace(/(.{4})/g, '$1 ').trim();
        
        // Update input
        this.value = value;
        
        // Update preview
        if (previewNumber) {
            if (value === '') {
                previewNumber.textContent = '•••• •••• •••• ••••';
            } else {
                previewNumber.textContent = value.padEnd(19, '•');
            }
        }
        
        // Validate as user types
        validateCardNumber();
    });
}

// ============================================================
// STEP 4: Card Name - Update preview
// ============================================================

if (cardName) {
    cardName.addEventListener('input', function() {
        if (previewName) {
            const name = this.value.trim().toUpperCase();
            previewName.textContent = name === '' ? 'YOUR NAME' : name;
        }
    });
}

// ============================================================
// STEP 5: Expiry Date - Auto-format MM/YY
// ============================================================

if (cardExpiry) {
    cardExpiry.addEventListener('input', function(e) {
        // Remove all non-digits
        let value = this.value.replace(/\D/g, '');
        
        // Limit to 4 digits
        value = value.substring(0, 4);
        
        // Add slash after MM
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        
        // Update input
        this.value = value;
        
        // Update preview
        if (previewExpiry) {
            previewExpiry.textContent = value === '' ? 'MM/YY' : value;
        }
    });
}

// ============================================================
// STEP 6: CVV - Only numbers
// ============================================================

if (cardCVV) {
    cardCVV.addEventListener('input', function() {
        // Remove all non-digits
        this.value = this.value.replace(/\D/g, '').substring(0, 4);
    });
}

// ============================================================
// STEP 7: Validate Card Number (Luhn Algorithm)
// ============================================================

function validateCardNumber() {
    if (!cardNumber) return false;
    
    const value = cardNumber.value.replace(/\s/g, '');
    
    // Check if empty
    if (value === '') {
        cardNumber.classList.remove('error');
        return false;
    }
    
    // Check length (must be 13-19 digits)
    if (value.length < 13 || value.length > 19) {
        cardNumber.classList.add('error');
        return false;
    }
    
    // Luhn Algorithm (checks if card number is valid)
    let sum = 0;
    let isEven = false;
    
    for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    const isValid = sum % 10 === 0;
    
    if (!isValid) {
        cardNumber.classList.add('error');
    } else {
        cardNumber.classList.remove('error');
    }
    
    return isValid;
}

// ============================================================
// STEP 8: Detect Card Type
// ============================================================

function detectCardType(number) {
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/
    };
    
    const cleanNumber = number.replace(/\s/g, '');
    
    if (patterns.visa.test(cleanNumber)) return 'Visa';
    if (patterns.mastercard.test(cleanNumber)) return 'Mastercard';
    if (patterns.amex.test(cleanNumber)) return 'Amex';
    if (patterns.discover.test(cleanNumber)) return 'Discover';
    
    return 'Unknown';
}

// ============================================================
// STEP 9: Validate All Payment Fields
// ============================================================

function validatePayment() {
    let isValid = true;
    const errors = [];
    
    // Validate card number
    if (!validateCardNumber()) {
        errors.push('Invalid card number');
        isValid = false;
    }
    
    // Validate name
    if (!cardName || cardName.value.trim().length < 3) {
        if (cardName) cardName.classList.add('error');
        errors.push('Please enter cardholder name');
        isValid = false;
    } else {
        if (cardName) cardName.classList.remove('error');
    }
    
    // Validate expiry (MM/YY format)
    if (cardExpiry) {
        const expiry = cardExpiry.value;
        const match = expiry.match(/^(\d{2})\/(\d{2})$/);
        
        if (!match) {
            cardExpiry.classList.add('error');
            errors.push('Invalid expiry date');
            isValid = false;
        } else {
            const month = parseInt(match[1]);
            const year = parseInt(match[2]);
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            
            if (month < 1 || month > 12) {
                cardExpiry.classList.add('error');
                errors.push('Invalid month');
                isValid = false;
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                cardExpiry.classList.add('error');
                errors.push('Card has expired');
                isValid = false;
            } else {
                cardExpiry.classList.remove('error');
            }
        }
    }
    
    // Validate CVV
    if (cardCVV) {
        const cvv = cardCVV.value;
        if (cvv.length < 3 || cvv.length > 4) {
            cardCVV.classList.add('error');
            errors.push('Invalid CVV');
            isValid = false;
        } else {
            cardCVV.classList.remove('error');
        }
    }
    
    return { isValid, errors };
}

// ============================================================
// STEP 10: Show Payment Form When Cart Has Items
// ============================================================

// Override updateCart to show/hide payment form
const originalUpdateCart = window.updateCart;
window.updateCart = function() {
    if (originalUpdateCart) {
        originalUpdateCart();
    }
    
    // Show payment form if cart has items
    if (paymentSection) {
        if (cart.length > 0) {
            paymentSection.style.display = 'block';
        } else {
            paymentSection.style.display = 'none';
        }
    }
};

// ============================================================
// STEP 11: Update Checkout to Require Payment
// ============================================================

document.addEventListener('click', function(e) {
    if (e.target.closest('.checkout-btn')) {
        // Get the final amount
        const finalAmount = cartTotal - (window.discountAmount || 0);
        
        console.log('💳 Processing payment...');
        console.log('💰 Amount:', finalAmount.toFixed(2));
        
        // Validate payment fields
        const validation = validatePayment();
        
        if (!validation.isValid) {
            // Prevent the checkout from completing
            console.log('❌ Payment validation failed:', validation.errors);
            
            // Show error message
            showPaymentError(validation.errors[0]);
            
            // Prevent the alert from the original checkout
            // (The original checkout runs after this, so we override)
            return;
        }
        
        // Payment is valid
        console.log('✅ Payment validated!');
        console.log('💳 Card Type:', detectCardType(cardNumber.value));
        console.log('💳 Last 4 digits:', cardNumber.value.replace(/\s/g, '').slice(-4));
        
        // Show processing message
        showPaymentProcessing();
    }
});

// ============================================================
// STEP 12: Show Error Message
// ============================================================

function showPaymentError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'payment-toast error';
    toast.innerHTML = `
        <span>❌ ${message}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #e74c3c;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 999999;
        font-weight: 600;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================================
// STEP 13: Show Processing Animation
// ============================================================

function showPaymentProcessing() {
    // Create processing overlay
    const overlay = document.createElement('div');
    overlay.className = 'payment-processing';
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner"></div>
            <p style="margin-top: 20px; font-size: 18px; font-weight: 600;">Processing Payment...</p>
            <p style="margin-top: 10px; color: #888; font-size: 14px;">Please wait</p>
        </div>
    `;
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.98);
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add spinner CSS
    const spinnerCSS = document.createElement('style');
    spinnerCSS.textContent = `
        .spinner {
            width: 60px;
            height: 60px;
            border: 5px solid #e8ddd0;
            border-top: 5px solid #d7a86e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinnerCSS);
    
    document.body.appendChild(overlay);
    
    // Complete after 2 seconds
    setTimeout(function() {
        overlay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
                <p style="font-size: 22px; font-weight: 700; color: #4CAF50;">Payment Successful!</p>
                <p style="margin-top: 10px; color: #666;">Your order has been placed</p>
            </div>
        `;
        
        setTimeout(function() {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s ease';
            setTimeout(function() {
                overlay.remove();
                spinnerCSS.remove();
            }, 500);
        }, 1500);
    }, 2000);
}

// ============================================================
// STEP 14: Console message
// ============================================================

console.log('💳 Payment system is ready!');
console.log('📝 Try entering a test card: 4242 4242 4242 4242');







// ============================================================
// 📧 NEWSLETTER SIGNUP
// ============================================================

const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMessage = document.getElementById('newsletterMessage');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = newsletterEmail.value.trim();
        
        // Validate email
        if (email === '' || !email.includes('@') || !email.includes('.')) {
            showNewsletterMsg('Please enter a valid email!', 'error');
            return;
        }
        
        // Get subscribers
        let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        
        // Check if already subscribed
        if (subscribers.includes(email)) {
            showNewsletterMsg('You are already subscribed! 🎉', 'error');
            newsletterEmail.value = '';
            return;
        }
        
        // Add subscriber
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        
        showNewsletterMsg('✅ Thank you for subscribing! ☕', 'success');
        newsletterEmail.value = '';
        
        console.log('📧 New subscriber:', email);
        console.log('📧 Total subscribers:', subscribers.length);
    });
}

function showNewsletterMsg(text, type) {
    newsletterMessage.textContent = text;
    newsletterMessage.className = type;
    newsletterMessage.style.display = 'block';
    
    setTimeout(function() {
        newsletterMessage.style.display = 'none';
    }, 5000);
}

console.log('📧 Newsletter is ready!');











// ============================================================
// 🌍 MULTI-LANGUAGE SYSTEM
// ============================================================

console.log('🌍 Setting up multi-language...');

// ============================================================
// STEP 1: Define all translations
// ============================================================

const translations = {
    // ============================================================
    // 🇬🇧 ENGLISH
    // ============================================================
    en: {
        // Navigation
        home: 'Home',
        menu: 'Menu',
        about: 'About',
        contact: 'Contact',
        reviews: 'Reviews',
        cart: 'Cart',
        
        // Hero
        heroTitle: 'Start your day with great coffee',
        heroSubtitle: 'Fresh coffee, delicious moments, and a warm place to relax',
        orderNow: 'Order Now',
        
        // Menu
        ourMenu: 'Our Menu ☕',
        searchPlaceholder: '🔍 Search for coffee, tea, cake...',
        searchBtn: 'Search',
        filterAll: 'All',
        filterHot: '☕ Hot Drinks',
        filterCold: '🧊 Cold Drinks',
        filterFood: '🍰 Food',
        sortBy: 'Sort by:',
        sortDefault: 'Default',
        sortPriceLow: 'Price: Low to High',
        sortPriceHigh: 'Price: High to Low',
        sortNameAZ: 'Name: A to Z',
        sortNameZA: 'Name: Z to A',
        showing: 'Showing',
        of: 'of',
        products: 'products',
        addToOrder: 'Add to Order',
        added: '✅ Added!',
        
        // About
        aboutTitle: 'About Our Coffee Shop',
        aboutText1: 'Welcome to our cozy coffee shop! We are passionate about serving the finest coffee made from carefully selected beans.',
        aboutText2: 'Our mission is to create a warm and welcoming space where you can enjoy delicious coffee, tasty treats, and great company.',
        feature1Title: 'Fresh Coffee',
        feature1Text: 'Made from premium beans',
        feature2Title: 'Homemade Treats',
        feature2Text: 'Baked fresh daily',
        feature3Title: 'Cozy Atmosphere',
        feature3Text: 'Perfect for reading and relaxing',
        feature4Title: 'Eco-Friendly',
        feature4Text: 'Committed to sustainability',
        
        // Contact
        contactTitle: 'Contact Us',
        addressTitle: 'Address',
        phoneTitle: 'Phone',
        emailTitle: 'Email',
        hoursTitle: 'Opening Hours',
        
        // Reviews
        reviewsTitle: 'What Our Customers Say',
        
        // Newsletter
        newsletterTitle: '📧 Subscribe to Our Newsletter',
        newsletterText: 'Get the latest updates, special offers, and coffee tips!',
        subscribeBtn: 'Subscribe',
        subscribePlaceholder: 'Enter your email address',
        
        // Footer
        footerTitle: '☕ Coffee Shop',
        footerSlogan: 'Your daily dose of happiness',
        quickLinks: 'Quick Links',
        followUs: 'Follow Us',
        copyright: '© 2026 Coffee Shop. All rights reserved.',
        
        // Cart
        yourOrder: '🛒 Your Order',
        couponPlaceholder: 'Enter coupon code',
        apply: 'Apply',
        total: 'Total:',
        discount: 'Discount:',
        finalTotal: 'Final Total:',
        checkout: 'Checkout',
        cartEmpty: 'Your cart is empty ☕',
        
        // Payment
        paymentDetails: '💳 Payment Details',
        cardNumber: 'Card Number',
        cardholderName: 'Cardholder Name',
        expiryDate: 'Expiry Date',
        cvv: 'CVV',
        cardHolder: 'CARD HOLDER',
        expires: 'EXPIRES',
        yourName: 'YOUR NAME',
        
        // Messages
        cartEmptyMsg: 'Your cart is empty! Add some items first. ☕',
        orderPlaced: '✅ Order placed!',
        thankYou: 'Thank you for your order! ☕',
        couponInvalid: '❌ Invalid coupon code',
        couponApplied: '✅ Coupon applied!'
    },
    
    // ============================================================
    // 🇫🇷 FRENCH
    // ============================================================
    fr: {
        // Navigation
        home: 'Accueil',
        menu: 'Menu',
        about: 'À propos',
        contact: 'Contact',
        reviews: 'Avis',
        cart: 'Panier',
        
        // Hero
        heroTitle: 'Commencez votre journée avec un excellent café',
        heroSubtitle: 'Café frais, moments délicieux et un endroit chaleureux pour se détendre',
        orderNow: 'Commander',
        
        // Menu
        ourMenu: 'Notre Menu ☕',
        searchPlaceholder: '🔍 Rechercher café, thé, gâteau...',
        searchBtn: 'Rechercher',
        filterAll: 'Tout',
        filterHot: '☕ Boissons Chaudes',
        filterCold: '🧊 Boissons Froides',
        filterFood: '🍰 Nourriture',
        sortBy: 'Trier par:',
        sortDefault: 'Par défaut',
        sortPriceLow: 'Prix: Bas à Élevé',
        sortPriceHigh: 'Prix: Élevé à Bas',
        sortNameAZ: 'Nom: A à Z',
        sortNameZA: 'Nom: Z à A',
        showing: 'Affichage',
        of: 'sur',
        products: 'produits',
        addToOrder: 'Ajouter',
        added: '✅ Ajouté!',
        
        // About
        aboutTitle: 'À propos de notre café',
        aboutText1: 'Bienvenue dans notre café chaleureux! Nous sommes passionnés par le service du meilleur café fait à partir de grains soigneusement sélectionnés.',
        aboutText2: 'Notre mission est de créer un espace chaleureux et accueillant où vous pouvez savourer un délicieux café, des friandises savoureuses et une excellente compagnie.',
        feature1Title: 'Café Frais',
        feature1Text: 'Fabriqué à partir de grains premium',
        feature2Title: 'Friandises Maison',
        feature2Text: 'Cuites fraîches chaque jour',
        feature3Title: 'Atmosphère Conviviale',
        feature3Text: 'Parfait pour lire et se détendre',
        feature4Title: 'Écologique',
        feature4Text: 'Engagé pour la durabilité',
        
        // Contact
        contactTitle: 'Contactez-nous',
        addressTitle: 'Adresse',
        phoneTitle: 'Téléphone',
        emailTitle: 'Email',
        hoursTitle: 'Heures d\'ouverture',
        
        // Reviews
        reviewsTitle: 'Ce que disent nos clients',
        
        // Newsletter
        newsletterTitle: '📧 Abonnez-vous à notre newsletter',
        newsletterText: 'Recevez les dernières nouvelles, offres spéciales et conseils café!',
        subscribeBtn: 'S\'abonner',
        subscribePlaceholder: 'Entrez votre adresse email',
        
        // Footer
        footerTitle: '☕ Café',
        footerSlogan: 'Votre dose quotidienne de bonheur',
        quickLinks: 'Liens Rapides',
        followUs: 'Suivez-nous',
        copyright: '© 2026 Café. Tous droits réservés.',
        
        // Cart
        yourOrder: '🛒 Votre Commande',
        couponPlaceholder: 'Entrez le code promo',
        apply: 'Appliquer',
        total: 'Total:',
        discount: 'Réduction:',
        finalTotal: 'Total Final:',
        checkout: 'Commander',
        cartEmpty: 'Votre panier est vide ☕',
        
        // Payment
        paymentDetails: '💳 Détails de Paiement',
        cardNumber: 'Numéro de Carte',
        cardholderName: 'Nom du Titulaire',
        expiryDate: 'Date d\'Expiration',
        cvv: 'CVV',
        cardHolder: 'TITULAIRE',
        expires: 'EXPIRE',
        yourName: 'VOTRE NOM',
        
        // Messages
        cartEmptyMsg: 'Votre panier est vide! Ajoutez des articles d\'abord. ☕',
        orderPlaced: '✅ Commande passée!',
        thankYou: 'Merci pour votre commande! ☕',
        couponInvalid: '❌ Code promo invalide',
        couponApplied: '✅ Code promo appliqué!'
    },
    
    // ============================================================
    // 🇸🇦 ARABIC
    // ============================================================
    ar: {
        // Navigation
        home: 'الرئيسية',
        menu: 'القائمة',
        about: 'من نحن',
        contact: 'اتصل بنا',
        reviews: 'التقييمات',
        cart: 'السلة',
        
        // Hero
        heroTitle: 'ابدأ يومك بقهوة رائعة',
        heroSubtitle: 'قهوة طازجة، لحظات لذيذة، ومكان دافئ للاسترخاء',
        orderNow: 'اطلب الآن',
        
        // Menu
        ourMenu: 'قائمتنا ☕',
        searchPlaceholder: '🔍 ابحث عن قهوة، شاي، كعكة...',
        searchBtn: 'بحث',
        filterAll: 'الكل',
        filterHot: '☕ مشروبات ساخنة',
        filterCold: '🧊 مشروبات باردة',
        filterFood: '🍰 طعام',
        sortBy: 'ترتيب حسب:',
        sortDefault: 'افتراضي',
        sortPriceLow: 'السعر: من الأقل للأعلى',
        sortPriceHigh: 'السعر: من الأعلى للأقل',
        sortNameAZ: 'الاسم: أ إلى ي',
        sortNameZA: 'الاسم: ي إلى أ',
        showing: 'عرض',
        of: 'من',
        products: 'منتجات',
        addToOrder: 'أضف للطلب',
        added: '✅ تمت الإضافة!',
        
        // About
        aboutTitle: 'عن مقهانا',
        aboutText1: 'مرحباً بكم في مقهانا المريح! نحن شغوفون بتقديم أفضل قهوة مصنوعة من حبوب مختارة بعناية.',
        aboutText2: 'مهمتنا هي إنشاء مساحة دافئة ومرحبة حيث يمكنك الاستمتاع بقهوة لذيذة ومعجنات شهية ورفقة رائعة.',
        feature1Title: 'قهوة طازجة',
        feature1Text: 'مصنوعة من أجود الحبوب',
        feature2Title: 'حلويات منزلية',
        feature2Text: 'مخبوزة طازجة يومياً',
        feature3Title: 'أجواء مريحة',
        feature3Text: 'مثالية للقراءة والاسترخاء',
        feature4Title: 'صديقة للبيئة',
        feature4Text: 'ملتزمة بالاستدامة',
        
        // Contact
        contactTitle: 'اتصل بنا',
        addressTitle: 'العنوان',
        phoneTitle: 'الهاتف',
        emailTitle: 'البريد الإلكتروني',
        hoursTitle: 'ساعات العمل',
        
        // Reviews
        reviewsTitle: 'ماذا يقول عملاؤنا',
        
        // Newsletter
        newsletterTitle: '📧 اشترك في نشرتنا الإخبارية',
        newsletterText: 'احصل على آخر التحديثات والعروض الخاصة ونصائح القهوة!',
        subscribeBtn: 'اشترك',
        subscribePlaceholder: 'أدخل بريدك الإلكتروني',
        
        // Footer
        footerTitle: '☕ مقهى',
        footerSlogan: 'جرعتك اليومية من السعادة',
        quickLinks: 'روابط سريعة',
        followUs: 'تابعنا',
        copyright: '© 2026 مقهى. جميع الحقوق محفوظة.',
        
        // Cart
        yourOrder: '🛒 طلبك',
        couponPlaceholder: 'أدخل كود الخصم',
        apply: 'تطبيق',
        total: 'المجموع:',
        discount: 'الخصم:',
        finalTotal: 'المجموع النهائي:',
        checkout: 'إتمام الطلب',
        cartEmpty: 'سلتك فارغة ☕',
        
        // Payment
        paymentDetails: '💳 تفاصيل الدفع',
        cardNumber: 'رقم البطاقة',
        cardholderName: 'اسم حامل البطاقة',
        expiryDate: 'تاريخ الانتهاء',
        cvv: 'CVV',
        cardHolder: 'حامل البطاقة',
        expires: 'ينتهي',
        yourName: 'اسمك',
        
        // Messages
        cartEmptyMsg: 'سلتك فارغة! أضف بعض العناصر أولاً. ☕',
        orderPlaced: '✅ تم تقديم الطلب!',
        thankYou: 'شكراً لطلبك! ☕',
        couponInvalid: '❌ كود خصم غير صالح',
        couponApplied: '✅ تم تطبيق الكود!'
    }
};

// ============================================================
// STEP 2: Language state
// ============================================================

let currentLanguage = localStorage.getItem('language') || 'en';

// ============================================================
// STEP 3: Translate page function
// ============================================================

function translatePage(lang) {
    const t = translations[lang];
    if (!t) return;
    
    // Translate all elements with data-key
    document.querySelectorAll('[data-key]').forEach(function(element) {
        const key = element.getAttribute('data-key');
        if (t[key]) {
            // For inputs, use placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = t[key];
            } else {
                element.textContent = t[key];
            }
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-key-placeholder]').forEach(function(element) {
        const key = element.getAttribute('data-key-placeholder');
        if (t[key]) {
            element.placeholder = t[key];
        }
    });
    
    // Handle RTL for Arabic
    if (lang === 'ar') {
        document.body.classList.add('rtl');
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        document.body.classList.remove('rtl');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', lang);
    }
    
    // Update current language display
    const currentLang = document.getElementById('currentLang');
    if (currentLang) {
        currentLang.textContent = lang.toUpperCase();
    }
    
    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(function(option) {
        if (option.dataset.lang === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Save preference
    localStorage.setItem('language', lang);
    currentLanguage = lang;
    
    console.log('🌍 Language changed to:', lang);
}

// ============================================================
// STEP 4: Language selector functionality
// ============================================================

const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');

if (langBtn && langDropdown) {
    // Toggle dropdown
    langBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        langDropdown.classList.remove('active');
    });
    
    langDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Language option clicks
    document.querySelectorAll('.lang-option').forEach(function(option) {
        option.addEventListener('click', function() {
            const lang = this.dataset.lang;
            translatePage(lang);
            langDropdown.classList.remove('active');
        });
    });
    
    console.log('🌍 Language selector is ready!');
}

// ============================================================
// STEP 5: Apply saved language on page load
// ============================================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    translatePage(currentLanguage);
});

// Also apply immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    translatePage(currentLanguage);
}

console.log('🌍 Multi-language system is ready!');
console.log('💡 Languages: English (en), French (fr), Arabic (ar)');




// ============================================================
// 💰 PAYMENT METHOD SELECTOR
// ============================================================

console.log('💰 Setting up payment method selector...');

// ============================================================
// STEP 1: Track selected payment method
// ============================================================

let selectedPaymentMethod = 'cash'; // Default: cash

// ============================================================
// STEP 2: Get the payment options
// ============================================================

// Wait for cart dropdown to be created
setTimeout(function() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const cashInfo = document.getElementById('cashPaymentInfo');
    const cardSection = document.getElementById('paymentSection');
    
    console.log('💰 Found', paymentOptions.length, 'payment options');
    
    // ============================================================
    // STEP 3: Handle payment option clicks
    // ============================================================
    
    paymentOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const method = this.dataset.method;
            console.log('💰 Payment method selected:', method);
            
            // Remove active from all
            paymentOptions.forEach(function(opt) {
                opt.classList.remove('active');
            });
            
            // Add active to clicked
            this.classList.add('active');
            
            // Update state
            selectedPaymentMethod = method;
            
            // Show/hide sections
            if (method === 'cash') {
                // Show cash info, hide card form
                if (cashInfo) cashInfo.style.display = 'block';
                if (cardSection) cardSection.style.display = 'none';
            } else if (method === 'card') {
                // Show card form, hide cash info
                if (cashInfo) cashInfo.style.display = 'none';
                if (cardSection) cardSection.style.display = 'block';
            }
            
            console.log('💰 Switched to:', method);
        });
    });
    
    console.log('💰 Payment method selector is ready!');
}, 100);

// ============================================================
// STEP 4: Update checkout to handle both payment methods
// ============================================================

document.addEventListener('click', function(e) {
    if (e.target.closest('.checkout-btn')) {
        console.log('💰 Checkout clicked. Payment method:', selectedPaymentMethod);
        
        if (selectedPaymentMethod === 'card') {
            // Validate card fields
            const cardNum = document.getElementById('cardNumber');
            const cardNameInput = document.getElementById('cardName');
            const cardExp = document.getElementById('cardExpiry');
            const cardCvv = document.getElementById('cardCVV');
            
            // Check card number
            if (!cardNum || cardNum.value.replace(/\s/g, '').length < 13) {
                showPaymentError('Please enter a valid card number');
                return;
            }
            
            // Check name
            if (!cardNameInput || cardNameInput.value.trim().length < 3) {
                showPaymentError('Please enter the cardholder name');
                return;
            }
            
            // Check expiry
            if (!cardExp || !cardExp.value.match(/^\d{2}\/\d{2}$/)) {
                showPaymentError('Please enter a valid expiry date (MM/YY)');
                return;
            }
            
            // Check CVV
            if (!cardCvv || cardCvv.value.length < 3) {
                showPaymentError('Please enter a valid CVV');
                return;
            }
            
            console.log('✅ Card validation passed');
        } else {
            console.log('✅ Cash payment selected');
        }
    }
});

// ============================================================
// STEP 5: Show error message (helper function)
// ============================================================

function showPaymentError(message) {
    // Create toast
    const toast = document.createElement('div');
    toast.innerHTML = `❌ ${message}`;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #e74c3c;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 999999;
        font-weight: 600;
        font-size: 15px;
    `;
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================================
// STEP 6: Reset payment method after checkout
// ============================================================

document.addEventListener('click', function(e) {
    if (e.target.closest('.checkout-btn')) {
        setTimeout(function() {
            // Reset to cash
            selectedPaymentMethod = 'cash';
            
            const paymentOptions = document.querySelectorAll('.payment-option');
            const cashInfo = document.getElementById('cashPaymentInfo');
            const cardSection = document.getElementById('paymentSection');
            
            paymentOptions.forEach(function(opt) {
                opt.classList.remove('active');
                if (opt.dataset.method === 'cash') {
                    opt.classList.add('active');
                }
            });
            
            if (cashInfo) cashInfo.style.display = 'block';
            if (cardSection) cardSection.style.display = 'none';
            
            console.log('💰 Payment method reset to cash');
        }, 2500);
    }
});

console.log('💰 Payment selector is ready!');
console.log('💡 Customers can choose Cash or Card');






// ============================================================
// ✅ ORDER CONFIRMATION PAGE
// ============================================================

console.log('✅ Setting up order confirmation...');

// ============================================================
// STEP 1: Function to show confirmation
// ============================================================

function showOrderConfirmation(orderData) {
    const modal = document.getElementById('orderConfirmation');
    if (!modal) {
        console.log('❌ Confirmation modal not found');
        return;
    }
    
    // ============================================================
    // Generate Order Number
    // ============================================================
    
    const orderNumber = '#' + Date.now().toString().slice(-6);
    document.getElementById('confirmationOrderNumber').textContent = orderNumber;
    
    // ============================================================
    // Build Items List
    // ============================================================
    
    const itemsList = document.getElementById('confirmationItemsList');
    let itemsHTML = '';
    let subtotal = 0;
    
    orderData.items.forEach(function(item) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="confirm-item-row">
                <span>
                    <span class="item-qty">${item.quantity}×</span>
                    ${item.name}
                </span>
                <span class="item-total">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    // Add total
    itemsHTML += `
        <div class="confirm-total-row">
            <span>Total</span>
            <span>$${orderData.total.toFixed(2)}</span>
        </div>
    `;
    
    itemsList.innerHTML = itemsHTML;
    
    // ============================================================
    // Set Payment Method
    // ============================================================
    
    const paymentMethodEl = document.getElementById('confirmationPaymentMethod');
    if (paymentMethodEl) {
        if (orderData.paymentMethod === 'cash') {
            paymentMethodEl.textContent = '💵 Cash at Counter';
        } else {
            paymentMethodEl.textContent = '💳 Card (Paid)';
        }
    }
    
    // ============================================================
    // Set Estimated Time
    // ============================================================
    
    const timeEl = document.getElementById('confirmationTime');
    if (timeEl) {
        // Random time between 10-20 minutes
        const time = Math.floor(Math.random() * 10) + 10;
        timeEl.textContent = time + ' minutes';
    }
    
    // ============================================================
    // Show Modal
    // ============================================================
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Order confirmation shown:', orderNumber);
}

// ============================================================
// STEP 2: Close confirmation modal
// ============================================================

const confirmCloseBtn = document.getElementById('confirmCloseBtn');
if (confirmCloseBtn) {
    confirmCloseBtn.addEventListener('click', function() {
        const modal = document.getElementById('orderConfirmation');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log('✅ Confirmation closed');
    });
}

// Close when clicking outside
const orderConfirmModal = document.getElementById('orderConfirmation');
if (orderConfirmModal) {
    orderConfirmModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Close with Escape key
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('orderConfirmation');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ============================================================
// STEP 3: Print Receipt Button
// ============================================================

const printReceiptBtn = document.getElementById('printReceiptBtn');
if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', function() {
        window.print();
        console.log('🖨️ Printing receipt...');
    });
}

























console.log('✅ Order confirmation is ready!');












// ============================================================
// 🖼️ PRODUCT GALLERY
// ============================================================

console.log('🖼️ Setting up product gallery...');

// ============================================================
// GALLERY DATA - Define multiple images per product
// ============================================================

// Since you only have 1 image per product, we'll use the same
// image multiple times as a placeholder. Replace these with 
// real additional images later!

const galleryImages = {
    'Espresso': ['Espresso.jpg', 'Espresso.jpg', 'Espresso.jpg'],
    'Cappuccino': ['cappuccino.jpg',  'cappuccino2.jpg'],
    'Latte': ['latte.jpg', 'latte.jpg', 'latte.jpg'],
    'Green Tea': ['greentea.jpg', 'greentea.jpg', 'greentea.jpg'],
    'Iced Coffee': ['icedcoffee.jpg', 'icedcoffee.jpg', 'icedcoffee.jpg'],
    'Iced Tea': ['icedtea.png', 'icedtea.png', 'icedtea.png'],
    'Fruit Smoothie': ['smoothie.png', 'smoothie.png', 'smoothie.png'],
    'Cheesecake': ['cheesecake.jpg', 'cheesecake.jpg', 'cheesecake.jpg'],
    'Chocolate Croissant': ['croissant.jpg', 'croissant.jpg', 'croissant.jpg'],
    'Blueberry Muffin': ['muffin.jpg', 'muffin.jpg', 'muffin.jpg'],
    'Bagel with Cream Cheese': ['bagel.jpg', 'bagel.jpg', 'bagel.jpg'],
    'Turkey Sandwich': ['sandwich.jpg', 'sandwich.jpg', 'sandwich.jpg'],
    'Garden Salad': ['salad.jpg', 'salad.jpg', 'salad.jpg'],
    'Pizza fruits de mer': ['pizzafruit.jpg', 'pizzafruit.jpg', 'pizzafruit.jpg']
};

// ============================================================
// GALLERY STATE
// ============================================================

let currentGalleryImages = [];
let currentImageIndex = 0;
let currentProductData = null;

// ============================================================
// OPEN GALLERY FUNCTION
// ============================================================

function openGallery(productName, productPrice, productDesc, card) {
    console.log('🖼️ Opening gallery for:', productName);
    
    // Get images for this product
    currentGalleryImages = galleryImages[productName] || ['Espresso.jpg'];
    currentImageIndex = 0;
    
    // Save product data
    currentProductData = {
        name: productName,
        price: productPrice,
        description: productDesc,
        card: card
    };
    
    // Update title and info
    document.getElementById('galleryTitle').textContent = productName;
    document.getElementById('galleryPrice').textContent = productPrice;
    document.getElementById('galleryDescription').textContent = productDesc;
    
    // Build dots
    buildGalleryDots();
    
    // Build thumbnails
    buildGalleryThumbnails();
    
    // Show first image
    updateGalleryImage();
    
    // Show modal
    const modal = document.getElementById('galleryModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Gallery opened with', currentGalleryImages.length, 'images');
}

// ============================================================
// BUILD DOTS
// ============================================================

function buildGalleryDots() {
    const dotsContainer = document.getElementById('galleryDots');
    dotsContainer.innerHTML = '';
    
    currentGalleryImages.forEach(function(img, index) {
        const dot = document.createElement('div');
        dot.className = 'gallery-dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', function() {
            currentImageIndex = index;
            updateGalleryImage();
        });
        
        dotsContainer.appendChild(dot);
    });
}

// ============================================================
// BUILD THUMBNAILS
// ============================================================

function buildGalleryThumbnails() {
    const thumbsContainer = document.getElementById('galleryThumbnails');
    thumbsContainer.innerHTML = '';
    
    currentGalleryImages.forEach(function(img, index) {
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumbnail';
        if (index === 0) thumb.classList.add('active');
        
        thumb.innerHTML = `<img src="${img}" alt="Thumbnail ${index + 1}">`;
        
        thumb.addEventListener('click', function() {
            currentImageIndex = index;
            updateGalleryImage();
        });
        
        thumbsContainer.appendChild(thumb);
    });
}

// ============================================================
// UPDATE IMAGE
// ============================================================

function updateGalleryImage() {
    // Update main image
    const mainImage = document.getElementById('galleryImage');
    mainImage.src = currentGalleryImages[currentImageIndex];
    
    // Reset animation
    mainImage.style.animation = 'none';
    setTimeout(function() {
        mainImage.style.animation = 'imageFade 0.4s ease';
    }, 10);
    
    // Update dots
    document.querySelectorAll('.gallery-dot').forEach(function(dot, index) {
        if (index === currentImageIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update thumbnails
    document.querySelectorAll('.gallery-thumbnail').forEach(function(thumb, index) {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// ============================================================
// NEXT / PREVIOUS
// ============================================================

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    updateGalleryImage();
    console.log('➡️ Next image:', currentImageIndex + 1);
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateGalleryImage();
    console.log('⬅️ Previous image:', currentImageIndex + 1);
}

// ============================================================
// CLOSE GALLERY
// ============================================================

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    console.log('❌ Gallery closed');
}

// ============================================================
// CONNECT EVENT LISTENERS
// ============================================================

// Wait for page to load
setTimeout(function() {
    const modal = document.getElementById('galleryModal');
    const closeBtn = document.getElementById('galleryClose');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const addBtn = document.getElementById('galleryAddBtn');
    
    if (!modal) {
        console.log('⚠️ Gallery modal not found');
        return;
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeGallery);
    }
    
    // Prev / Next
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            prevImage();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nextImage();
        });
    }
    
    // Add to order from gallery
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            if (currentProductData && currentProductData.card) {
                // Find the add button in the card
                const cardAddBtn = currentProductData.card.querySelector('.add-btn');
                if (cardAddBtn) {
                    cardAddBtn.click();
                }
            }
            closeGallery();
        });
    }
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGallery();
        }
    });
    
 
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
    

    
    document.querySelectorAll('.product-card').forEach(function(card) {
        const img = card.querySelector('.product-image img');
        
        if (img) {
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                

                const name = card.querySelector('.product-info h3').textContent.trim();
                const price = card.querySelector('.price').textContent.trim();
                const desc = card.querySelector('.product-info p').textContent.trim();
                
                openGallery(name, price, desc, card);
            });
        }
    });
    
    console.log('✅ Product gallery is ready!');
    console.log('💡 Click any product image to open gallery');
    
}, 500);

