// ============================================
// Mobile Menu Toggle
// ============================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.querySelector('.main-nav');

mobileMenuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-list a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});


// ============================================
// Product Search Functionality (Homepage)
// ============================================

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const productCard = document.querySelectorAll('.product-card');
const noResultsMessage = document.getElementById('noResults');

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let hasResults = false;

    // If empty search → show all products
    if (searchTerm === "") {
        productCards.forEach(card => {
            card.style.display = "block";
        });
        if (noResultsMessage) noResultsMessage.style.display = "none";
        return;
    }

    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();

        if (
            productName.includes(searchTerm) ||
            productDescription.includes(searchTerm)
        ) {
            card.style.display = "block";
            hasResults = true;
        } else {
            card.style.display = "none";
        }
    });

    // Show / hide "no results" message
    if (noResultsMessage) {
        noResultsMessage.style.display = hasResults ? "none" : "block";
    }

    // Smooth scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: "smooth" });
}

// Button click
searchButton.addEventListener('click', performSearch);

// Enter key
searchInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        performSearch();
    }
});

// ============================================
// Hero Carousel Functionality
// ============================================
const carouselTrack = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
const indicatorsContainer = document.getElementById('carouselIndicators');

let currentSlide = 0;
let autoPlayInterval;
const autoPlayDelay = 5000; // 5 seconds

// Create indicators
slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.indicator');

function startAutoPlay() {
    clearInterval(autoPlayInterval);

    autoPlayInterval = setInterval(() => {
        moveToNextSlide();
    }, getSlideDelay());
}

function getSlideDelay() {
    const current = slides[currentSlide];
    const video = current.querySelector('video');

    // If slide contains a video, wait at least 6 seconds
    if (video) {
        return 7000; // 6 seconds
    }

    return 5000; // default for images
}

slides.forEach(slide => {
    const video = slide.querySelector('video');
    if (video) {
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
    }
});


// Function to go to a specific slide
function goToSlide(index) {
    // Remove active class from current slide and indicator
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Pause current video if it's playing
    const currentVideo = slides[currentSlide].querySelector('video');
    if (currentVideo) {
        currentVideo.pause();
    }
    
    // Update current slide
    currentSlide = index;
    
    // Add active class to new slide and indicator
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // Play video if the new slide has one
    const newVideo = slides[currentSlide].querySelector('video');
    if (newVideo) {
        newVideo.play();
    }
    
    // Reset auto-play timer
    resetAutoPlay();
}

// Next slide
function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}

// Previous slide
function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
}

// Event listeners for controls
nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Auto-play functionality
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Start auto-play on load
startAutoPlay();

// Pause auto-play on hover
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', stopAutoPlay);
carouselContainer.addEventListener('mouseleave', startAutoPlay);

// Play first video if it exists
const firstVideo = slides[0].querySelector('video');
if (firstVideo) {
    firstVideo.play();
}

// ============================================
// Product Card Animations on Scroll
// ============================================
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

// Observe all product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    observer.observe(card);
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Header Scroll Effect (Optional)
// ============================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow to header when scrolling
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Newsletter Form Submission
// ============================================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email) {
            // You can replace this with actual newsletter subscription logic
            console.log('Newsletter subscription:', email);
            
            // Show success message
            alert(`Thank you for subscribing!\n\nWe'll send updates to: ${email}`);
            
            // Clear the input
            emailInput.value = '';
        }
    });
}

// ============================================
// Initialize on DOM Content Loaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ellen Luxe Hairs website loaded successfully!');
    
    // Add fade-in animation to page elements
    const elementsToAnimate = document.querySelectorAll('.section-header, .product-card');
    elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

//GemScript
// Use ONE cart key everywhere
const CART_KEY = "ellenLuxeCart";

// Get cart
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Save cart
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Update cart badge in header
function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById("cartCount");
    if (badge) badge.innerText = count;
}

// Add to cart from product cards
function setupAddToCartButtons() {
    document.querySelectorAll(".buy-button").forEach(button => {
        button.addEventListener("click", function () {
            const card = this.closest(".product-card");
            const name = card.querySelector(".product-name").innerText;
            const priceStr = card.querySelector(".product-price").innerText;
            const price = parseFloat(priceStr.replace("$", ""));
            const lengthSelect = card.querySelector(".length-selector");
            const length = lengthSelect ? lengthSelect.value : "Default";

            let cart = getCart();

            const existing = cart.find(
                item => item.name === name && item.length === length
            );

            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, length, qty: 1 });
            }

            saveCart(cart);
            updateCartBadge();

            // Button feedback
            const oldText = this.innerText;
            this.innerText = "Added ✓";
            this.disabled = true;

            setTimeout(() => {
                this.innerText = oldText;
                this.disabled = false;
            }, 1000);
        });
    });
}

// Init on page load
document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    setupAddToCartButtons();
});

//Sales script
const products = [
    {
        id: 'p1',
        name: 'Sleek Ponytail - Brazilian Silk',
        price: 85.00,
        originalPrice: 120.00,
        image: 'ponytail1.jpg', // Replace with your image paths
        category: 'Ponytail'
    },
    {
        id: 'p2',
        name: 'Deep Wave Frontal Wig',
        price: 250.00,
        originalPrice: 310.00,
        image: 'wig1.jpg',
        category: 'Wig'
    }
];

function displayProducts() {
    const grid = document.getElementById('saleProducts');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <span class="sale-badge">SALE</span>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p style="text-decoration: line-through; color: #888; font-size: 0.9rem;">$${product.originalPrice}</p>
            <p style="color: #d4af37; font-weight: bold; font-size: 1.3rem;">$${product.price}</p>
            ${product.category === 'Ponytail' ? '<p style="font-size: 0.7rem; color: #ef6c00;">+ FREE SCRUNCHIE INCLUDED</p>' : ''}
            <button class="btn-add" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('ellenLuxeCart')) || [];
    
    // Check if item already exists
    const existing = cart.find(item => item.id === productId);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1, length: "22" }); // Default length
    }
    
    localStorage.setItem('ellenLuxeCart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to bag!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('ellenLuxeCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').innerText = count;
}

window.onload = () => {
    displayProducts();
    updateCartCount();
};


//Sales script for adding to cart
// Master Add to Cart Function
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('ellenLuxeCart')) || [];
    
    // 1. Check if item is already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            qty: 1,
            length: "22" // Default luxury length
        });
    }
    
    // 2. Save back to LocalStorage
    localStorage.setItem('ellenLuxeCart', JSON.stringify(cart));
    
    // 3. Update the Nav Bar Cart Count
    updateCartCount();
    
    // 4. Handle Special Promo Notification
    if (name.toLowerCase().includes('ponytail')) {
        showPromoToast(); // Triggers the "Free Scrunchie" alert
    }

    // 5. Button Animation (Fancy Feedback)
    const btn = event.target;
    if (btn && btn.classList.contains('btn-add')) {
        const originalText = btn.innerText;
        btn.innerText = "Added to Bag! ✨";
        btn.style.background = "#d4af37";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "#000";
        }, 2000);
    }
}

// Global Cart Counter
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('ellenLuxeCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.innerText = count;
    }
}

// Promo Toast Logic
function showPromoToast() {
    const toast = document.getElementById('promo-toast');
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Initialize on page load
window.onload = () => {
    // If you have a function to draw your products, call it here
    if (typeof displayProducts === "function") {
        displayProducts();
    }
    updateCartCount();
};
