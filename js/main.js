/* ============================================
   أكاديمية ستيب 2026 - الوظائف الرئيسية
   ============================================ */

'use strict';

// ---- Cart State ----
let cart = JSON.parse(localStorage.getItem('stepCart')) || [];
let uploadedFile = null;
let uploadedFileName = '';

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initParticles();
    initCountdown();
    initScrollEffects();
    initNavbar();
    initAnimations();
    renderCart();
    updateCartCount();
});

/* ============================================
   Loading Screen
   ============================================ */
function initLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2800);
    document.body.style.overflow = 'hidden';
}

/* ============================================
   Particle Canvas (Stars Effect)
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.7 + 0.3,
            color: Math.random() > 0.7
                ? `rgba(240, 192, 64, ${Math.random() * 0.8 + 0.2})`
                : Math.random() > 0.5
                ? `rgba(0, 212, 255, ${Math.random() * 0.6 + 0.2})`
                : `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.03 + 0.01
        };
    }

    function init() {
        resize();
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += p.pulseSpeed;
            const opacityMod = 0.8 + 0.2 * Math.sin(p.pulse);

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity * opacityMod;
            ctx.fill();
        });

        // Draw connections
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(240, 192, 64, ${0.1 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animFrame = requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animFrame);
        init();
        animate();
    });
}

/* ============================================
   Countdown Timer
   ============================================ */
function initCountdown() {
    // Set countdown to 3 days from now, stored in localStorage
    const stored = localStorage.getItem('stepCountdownEnd');
    let endTime;

    if (stored) {
        endTime = parseInt(stored);
    } else {
        endTime = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3 days
        localStorage.setItem('stepCountdownEnd', endTime.toString());
    }

    function update() {
        const now = Date.now();
        let diff = endTime - now;

        if (diff <= 0) {
            // Reset countdown
            endTime = Date.now() + (3 * 24 * 60 * 60 * 1000);
            localStorage.setItem('stepCountdownEnd', endTime.toString());
            diff = endTime - now;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = n => String(n).padStart(2, '0');
        document.getElementById('cdDays').textContent = pad(days);
        document.getElementById('cdHours').textContent = pad(hours);
        document.getElementById('cdMins').textContent = pad(mins);
        document.getElementById('cdSecs').textContent = pad(secs);
    }

    update();
    setInterval(update, 1000);
}

/* ============================================
   Navbar & Scroll Effects
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollTop = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 80;
        navbar.classList.toggle('scrolled', scrolled);

        if (scrollTop) {
            scrollTop.classList.toggle('visible', window.scrollY > 400);
        }
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('mobile-open');
}

// Close mobile menu when link clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('mobile-open');
    });
});

/* ============================================
   Intersection Observer Animations
   ============================================ */
function initAnimations() {
    const elements = document.querySelectorAll(
        '.course-card, .why-card, .testimonial-card, .faq-item, .stats-item, .compare-table'
    );

    elements.forEach(el => {
        el.classList.add('fade-in-up');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current);
    }, 16);
}

function initScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================
   Cart Functions
   ============================================ */
function addToCart(id, name, price, originalPrice) {
    const exists = cart.find(item => item.id === id);

    if (exists) {
        showToast(`✅ "${name}" موجودة بالفعل في السلة!`);
        return;
    }

    cart.push({ id, name, price, originalPrice });
    saveCart();
    renderCart();
    updateCartCount();
    showToast(`🛒 تمت إضافة "${name}" للسلة!`);

    // Open cart sidebar briefly
    setTimeout(() => {
        openCart();
    }, 300);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    updateCartCount();
    showToast('🗑️ تمت إزالة الدورة من السلة');
}

function saveCart() {
    localStorage.setItem('stepCart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.length;
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'flex' : 'none';
        if (count > 0) {
            countEl.classList.add('bounce');
            setTimeout(() => countEl.classList.remove('bounce'), 300);
        }
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>سلتك فارغة</p>
                <small>أضف دورة للبدء</small>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }

    let totalPrice = 0;
    let totalOriginal = 0;

    const itemsHTML = cart.map(item => {
        totalPrice += item.price;
        totalOriginal += item.originalPrice;
        return `
            <div class="cart-item-card">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ريال</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="حذف">✕</button>
            </div>
        `;
    }).join('');

    cartItems.innerHTML = itemsHTML;

    if (cartFooter) {
        cartFooter.style.display = 'block';
        document.getElementById('originalTotal').textContent = `${totalOriginal} ريال`;
        document.getElementById('savingsTotal').textContent = `${totalOriginal - totalPrice} ريال`;
        document.getElementById('cartTotal').textContent = `${totalPrice} ريال`;
    }
}

function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    const isOpen = sidebar.classList.contains('open');

    if (isOpen) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    document.getElementById('cartOverlay').classList.add('active');
    document.getElementById('cartSidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartSidebar').classList.remove('open');
    document.body.style.overflow = '';
}

/* ============================================
   FAQ Accordion
   ============================================ */
function toggleFaq(questionEl) {
    const item = questionEl.parentElement;
    const allItems = document.querySelectorAll('.faq-item');

    allItems.forEach(i => {
        if (i !== item) i.classList.remove('open');
    });

    item.classList.toggle('open');
}

/* ============================================
   Checkout Flow
   ============================================ */
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('⚠️ السلة فارغة! أضف دورة أولاً');
        return;
    }

    closeCart();
    openCheckout();
}

function openCheckout() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset to step 1
    goToStep(1);
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function goToStep(stepNum) {
    // Hide all steps
    document.getElementById('checkoutStep1').classList.add('hidden');
    document.getElementById('checkoutStep2').classList.add('hidden');
    document.getElementById('checkoutStep3').classList.add('hidden');

    // Update stepper indicators
    const steps = [
        document.getElementById('step1Indicator'),
        document.getElementById('step2Indicator'),
        document.getElementById('step3Indicator')
    ];

    const lines = document.querySelectorAll('.step-line');

    steps.forEach((step, i) => {
        step.classList.remove('active', 'completed');
        if (i < stepNum - 1) step.classList.add('completed');
        if (i === stepNum - 1) step.classList.add('active');
    });

    lines.forEach((line, i) => {
        line.classList.toggle('completed', i < stepNum - 1);
    });

    // Show current step
    document.getElementById(`checkoutStep${stepNum}`).classList.remove('hidden');

    // Update bank total on step 2
    if (stepNum === 2) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const bankTotal = document.getElementById('bankTotalAmount');
        if (bankTotal) bankTotal.textContent = `${total} ريال سعودي`;
    }

    // Update order summary on step 3
    if (stepNum === 3) {
        renderOrderSummary();
    }
}

function goToStep1() { goToStep(1); }

function goToStep2() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const target = document.getElementById('custTarget').value;

    if (!name) {
        showToast('⚠️ يرجى إدخال الاسم الكامل');
        document.getElementById('custName').focus();
        return;
    }
    if (!phone || phone.length < 10) {
        showToast('⚠️ يرجى إدخال رقم تواصل صحيح');
        document.getElementById('custPhone').focus();
        return;
    }
    if (!email || !email.includes('@')) {
        showToast('⚠️ يرجى إدخال بريد إلكتروني صحيح');
        document.getElementById('custEmail').focus();
        return;
    }
    if (!target) {
        showToast('⚠️ يرجى اختيار الدرجة المستهدفة');
        document.getElementById('custTarget').focus();
        return;
    }

    goToStep(2);
}

function goToStep3() {
    goToStep(3);
}

function renderOrderSummary() {
    const container = document.getElementById('orderSummaryItems');
    const finalTotal = document.getElementById('orderFinalTotal');

    if (!container) return;

    let total = 0;
    const html = cart.map(item => {
        total += item.price;
        return `
            <div class="order-item-row">
                <span>${item.name}</span>
                <span>${item.price} ريال</span>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    if (finalTotal) finalTotal.textContent = `${total} ريال`;
}

/* ============================================
   File Upload
   ============================================ */
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    uploadedFile = file;
    uploadedFileName = file.name;

    const preview = document.getElementById('filePreview');
    if (preview) {
        preview.classList.remove('hidden');
        preview.innerHTML = `
            <span>📎</span>
            <span>تم رفع: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)</span>
        `;
    }

    const uploadArea = document.getElementById('fileUploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--green-accent)';
        uploadArea.style.background = 'rgba(72,199,142,0.05)';
    }

    showToast('✅ تم رفع الإيصال بنجاح!');
}

/* ============================================
   Copy to Clipboard
   ============================================ */
function copyText(text, btnId) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById(btnId);
        if (btn) {
            const original = btn.textContent;
            btn.textContent = '✓ تم النسخ';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('copied');
            }, 2000);
        }
        showToast('✅ تم نسخ النص بنجاح!');
    }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('✅ تم نسخ النص بنجاح!');
    });
}

/* ============================================
   Confirm Order & Send to Telegram
   ============================================ */
function confirmOrder() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const targetScore = document.getElementById('custTarget').value;

    if (!uploadedFile) {
        showToast('⚠️ يرجى إرفاق إيصال التحويل البنكي');
        return;
    }

    const coursesList = cart.map(item => `• ${item.name}: ${item.price} ريال`).join('\n');
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    const message = `🎓 طلب اشتراك جديد - أكاديمية ستيب 2026

👤 الاسم: ${name}
📱 رقم التواصل: ${phone}
📧 البريد: ${email}
🎯 الدرجة المستهدفة: ${targetScore}

🛒 الدورات المطلوبة:
${coursesList}
💰 المجموع: ${totalAmount} ريال

✅ تم إرفاق إيصال التحويل: ${uploadedFileName}

📌 الرجاء مراجعة الإيصال وتفعيل الاشتراك في أقرب وقت.
شكراً لاختياركم أكاديمية ستيب 2026 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const telegramURL = `https://t.me/Hilm_STEP1?text=${encodedMessage}`;

    // Clear cart
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();

    // Close modal
    closeCheckout();

    // Show success
    showSuccessPage(name, totalAmount, telegramURL);
}

/* ============================================
   Success Page
   ============================================ */
function showSuccessPage(name, total, telegramURL) {
    const successModal = document.createElement('div');
    successModal.className = 'modal-overlay active';
    successModal.id = 'successModal';
    successModal.style.zIndex = '4000';

    successModal.innerHTML = `
        <div class="modal-content" style="text-align:center; max-width:500px;">
            <div style="font-size:4rem; margin-bottom:1rem; animation: pulse 1s ease infinite;">🎉</div>
            <h2 style="color: var(--gold); font-size:1.5rem; margin-bottom:0.5rem;">تم تأكيد طلبك!</h2>
            <p style="color: var(--text-muted); margin-bottom:1.5rem;">شكراً ${name}! طلبك في الطريق. اضغط الزر أدناه لإرسال تفاصيل طلبك عبر تيليجرام لإتمام التفعيل.</p>

            <div style="background: rgba(0,136,204,0.1); border: 1px solid #0088cc; border-radius:12px; padding:1rem; margin-bottom:1.5rem;">
                <p style="font-size:0.9rem; color: #4fc3f7; margin-bottom:0.5rem;">📱 الخطوة التالية:</p>
                <p style="font-size:0.85rem; color: var(--text-muted);">اضغط على الزر أدناه لفتح تيليجرام وإرسال تفاصيل طلبك مع إيصال التحويل. سيتم تفعيل اشتراكك خلال 24 ساعة.</p>
            </div>

            <div style="background: rgba(240,192,64,0.05); border:1px solid var(--border-color); border-radius:12px; padding:1rem; margin-bottom:1.5rem;">
                <p style="font-size:0.85rem; color:var(--text-muted);">💰 المبلغ المدفوع: <strong style="color:var(--gold)">${total} ريال</strong></p>
            </div>

            <a href="${telegramURL}" target="_blank" 
               style="display:flex; align-items:center; justify-content:center; gap:0.7rem; background:#0088cc; color:white; padding:1rem 2rem; border-radius:12px; font-size:1rem; font-weight:800; text-decoration:none; margin-bottom:1rem; transition:all 0.3s;"
               onmouseover="this.style.background='#006aab'"
               onmouseout="this.style.background='#0088cc'">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/></svg>
                أرسل الطلب عبر تيليجرام
            </a>

            <button onclick="document.getElementById('successModal').remove()" 
                    style="background:transparent; border:1px solid rgba(255,255,255,0.2); color:var(--text-muted); padding:0.7rem 2rem; border-radius:8px; cursor:pointer; font-family:'Cairo',sans-serif; font-size:0.9rem; transition:all 0.3s;"
                    onmouseover="this.style.borderColor='var(--text-muted)'; this.style.color='var(--text-white)'"
                    onmouseout="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.color='var(--text-muted)'">
                العودة للموقع
            </button>
        </div>
    `;

    document.body.appendChild(successModal);

    // Confetti effect
    setTimeout(() => launchConfetti(), 100);
}

/* ============================================
   Confetti Effect
   ============================================ */
function launchConfetti() {
    const colors = ['#f0c040', '#00d4ff', '#48c78e', '#ff4757', '#ffffff'];
    const count = 80;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                z-index: 5000;
                animation: confettiFall ${Math.random() * 2 + 1.5}s ease-in forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3500);
        }, i * 30);
    }

    // Add confetti animation CSS
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   Toast Notification
   ============================================ */
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ============================================
   Close modal on overlay click
   ============================================ */
document.addEventListener('click', (e) => {
    const checkoutModal = document.getElementById('checkoutModal');
    if (e.target === checkoutModal) {
        closeCheckout();
    }
});

/* ============================================
   Keyboard Escape
   ============================================ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCheckout();
        closeCart();
    }
});

/* ============================================
   Drag over for file upload
   ============================================ */
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
    e.preventDefault();
    const uploadArea = document.getElementById('fileUploadArea');
    if (uploadArea && e.target.closest('#fileUploadArea')) {
        const file = e.dataTransfer.files[0];
        if (file) {
            const input = document.getElementById('receiptFile');
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            handleFileUpload(input);
        }
    }
});

/* ============================================
   Active nav link on scroll
   ============================================ */
function updateActiveNavLink() {
    const sections = ['home', 'courses', 'compare', 'why-us', 'testimonials', 'faq'];
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 150;

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (!section) return;

        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === `#${id}`
                    ? 'var(--gold)'
                    : '';
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

/* ============================================
   Notification bar: random activity messages
   ============================================ */
const activityMessages = [
    '🔥 15 شخص اشترك اليوم',
    '⭐ أحمد من الرياض اشترك للتو في الدورة المميزة',
    '🎯 سارة من جدة حققت 92 درجة في STEP',
    '🏆 محمد من الدمام اشترك في الدورة المكثفة',
    '🔥 عرض محدود | أسعار حصرية لفترة قصيرة',
    '🎓 +500 طالب يثقون بأكاديمية ستيب 2026',
];

// Update notification bar with random messages
function updateNotificationBar() {
    const notifScroll = document.querySelector('.notif-scroll');
    if (!notifScroll) return;

    const newMsg = activityMessages[Math.floor(Math.random() * activityMessages.length)];
    const span = notifScroll.querySelectorAll('span')[0];
    if (span) {
        span.textContent = newMsg;
    }
}

setInterval(updateNotificationBar, 8000);
