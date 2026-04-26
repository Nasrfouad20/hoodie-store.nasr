// منتجات المتجر
const products = [
    {
        id: 1,
        name: 'هودي كلاسيك أسود',
        price: 299,
        description: 'هودي كلاسيك بتصميم عصري وجودة عالية',
        image: 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Black+Hoodie'
    },
    {
        id: 2,
        name: 'هودي جرافيتي',
        price: 399,
        description: 'تصميم جرافيتي فريد يعبر عن شخصيتك',
        image: 'https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Graffiti+Hoodie'
    },
    {
        id: 3,
        name: 'هودي أنمي',
        price: 449,
        description: 'تصميم مستوحى من شخصيات الأنمي المفضلة',
        image: 'https://via.placeholder.com/400x400/ffd93d/1a1a1a?text=Anime+Hoodie'
    },
    {
        id: 4,
        name: 'هودي مينيمال',
        price: 259,
        description: 'تصميم بسيط وأنيق للمناسبات اليومية',
        image: 'https://via.placeholder.com/400x400/4ecdc4/ffffff?text=Minimal+Hoodie'
    }
];

// سلة التسوق
let cart = [];

// عناصر DOM
const productsGrid = document.getElementById('products-grid');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.getElementById('cart-total');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');

// عرض المنتجات
function displayProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        أضف إلى السلة
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${product.price} ج.م</p>
                <p class="product-description">${product.description}</p>
            </div>
        </div>
    `).join('');
}

// إضافة منتج للسلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('تمت إضافة المنتج إلى السلة');
}

// إزالة منتج من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// تغيير كمية المنتج
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// تحديث السلة
function updateCart() {
    // تحديث عداد السلة
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // تحديث إجمالي السعر
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${total} ج.م`;
    
    // عرض عناصر السلة
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.price} ج.م</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff6b6b; color: white;">×</button>
                </div>
            </div>
        </div>
    `).join('');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">السلة فارغة</p>';
    }
}

// إظهار نافذة السلة
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

// إغلاق نافذة السلة
closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// إغلاق السلة عند الضغط خارجها
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// إظهار إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #ffd93d);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// بدء التطبيق
displayProducts();

// إضافة تأثيرات سموث سكرول للروابط
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// إضافة تأثير ظهور العناصر عند التمرير
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .about-content, .about-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});