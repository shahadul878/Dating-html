$(document).ready(function() {
    'use strict';

    // ===== LOADING ANIMATION =====
    function initLoadingAnimation() {
        const loading = $('<div class="loading"><div class="loading-spinner"></div></div>');
        $('body').prepend(loading);
        
        $(window).on('load', function() {
            setTimeout(function() {
                loading.addClass('hidden');
                setTimeout(function() {
                    loading.remove();
                }, 500);
            }, 1000);
        });
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Add staggered animation for grid items
                    if (entry.target.classList.contains('features-grid')) {
                        $(entry.target).find('.feature-block').each(function(index) {
                            const $this = $(this);
                            setTimeout(function() {
                                $this.addClass('animate-fade-in-up');
                            }, index * 200);
                        });
                    }
                    
                    if (entry.target.classList.contains('why-grid')) {
                        $(entry.target).find('.why-card').each(function(index) {
                            const $this = $(this);
                            setTimeout(function() {
                                $this.addClass('animate-fade-in-up');
                            }, index * 150);
                        });
                    }
                    
                    if (entry.target.classList.contains('powers-grid')) {
                        $(entry.target).find('.power-item').each(function(index) {
                            const $this = $(this);
                            setTimeout(function() {
                                $this.addClass('animate-fade-in-up');
                            }, index * 200);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        $('.features-grid, .why-grid, .powers-grid, .mission-content, .hero-form').each(function() {
            observer.observe(this);
        });
    }

    // ===== HEADER SCROLL EFFECT =====
    function initHeaderScrollEffect() {
        $(window).scroll(function() {
            const scrollTop = $(window).scrollTop();
            const header = $('.main-header');
            
            if (scrollTop > 100) {
                header.addClass('scrolled');
            } else {
                header.removeClass('scrolled');
            }
        });
    }

    // ===== OFFCANVAS MOBILE MENU =====
    function initOffcanvasMenu() {
        // Open offcanvas menu
        $('.mobile-menu-btn').click(function() {
            $('.offcanvas-overlay').addClass('active');
            $('.offcanvas-menu').addClass('active');
            $('body').css('overflow', 'hidden');
            
            // Animate hamburger icon
            $(this).html('<i class="fas fa-times"></i>');
        });

        // Close offcanvas menu
        function closeOffcanvasMenu() {
            $('.offcanvas-overlay').removeClass('active');
            $('.offcanvas-menu').removeClass('active');
            $('body').css('overflow', '');
            $('.mobile-menu-btn').html('<i class="fas fa-bars"></i>');
        }

        // Close with close button
        $('.offcanvas-close').click(function() {
            closeOffcanvasMenu();
        });

        // Close with overlay click
        $('.offcanvas-overlay').click(function() {
            closeOffcanvasMenu();
        });

        // Close with escape key
        $(document).keydown(function(e) {
            if (e.keyCode === 27 && $('.offcanvas-menu').hasClass('active')) {
                closeOffcanvasMenu();
            }
        });

        // Handle navigation links in offcanvas
        $('.offcanvas-nav-link').click(function() {
            closeOffcanvasMenu();
        });

        // Handle offcanvas login button
        $('.offcanvas-login-btn').click(function(e) {
            e.preventDefault();
            closeOffcanvasMenu();
            showNotification('Login form will open here!', 'info');
            
            // Add click animation
            $(this).addClass('animate-bounce');
            setTimeout(() => {
                $(this).removeClass('animate-bounce');
            }, 1000);
        });

        // Handle offcanvas register button
        $('.offcanvas-register-btn').click(function(e) {
            e.preventDefault();
            closeOffcanvasMenu();
            showNotification('Registration form will open here!', 'info');
            
            // Add click animation
            $(this).addClass('animate-bounce');
            setTimeout(() => {
                $(this).removeClass('animate-bounce');
            }, 1000);
        });

        // Add swipe to close functionality
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        $('.offcanvas-menu').on('touchstart', function(e) {
            startX = e.originalEvent.touches[0].clientX;
            isDragging = true;
        });

        $('.offcanvas-menu').on('touchmove', function(e) {
            if (!isDragging) return;
            currentX = e.originalEvent.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (diffX > 50) { // Swipe left to close
                closeOffcanvasMenu();
                isDragging = false;
            }
        });

        $('.offcanvas-menu').on('touchend', function() {
            isDragging = false;
        });
    }

    // ===== SMOOTH SCROLLING =====
    function initSmoothScrolling() {
        $('a[href^="#"]').click(function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            
            if (target.length) {
                const offsetTop = target.offset().top - 80;
                
                $('html, body').stop().animate({
                    scrollTop: offsetTop
                }, 1000, 'easeInOutQuart');
                
                // Close offcanvas menu after clicking
                $('.offcanvas-overlay').removeClass('active');
                $('.offcanvas-menu').removeClass('active');
                $('body').css('overflow', '');
                $('.mobile-menu-btn').html('<i class="fas fa-bars"></i>');
            }
        });
    }

    // ===== FORM INTERACTIONS =====
    function initFormInteractions() {
        // Newsletter form
        $('.newsletter-form').submit(function(e) {
            e.preventDefault();
            const email = $('.newsletter-input').val();
            
            if (email && isValidEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                $('.newsletter-input').val('');
                
                // Add success animation
                $(this).addClass('animate-pulse');
                setTimeout(() => {
                    $(this).removeClass('animate-pulse');
                }, 1000);
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });

        // Radio button selection with animation
        $('.radio-option').click(function() {
            const $radio = $(this).find('input[type="radio"]');
            $radio.prop('checked', true);
            
            // Add selection animation
            $(this).addClass('animate-pulse');
            setTimeout(() => {
                $(this).removeClass('animate-pulse');
            }, 500);
        });
    }

    // ===== BUTTON INTERACTIONS =====
    function initButtonInteractions() {
        // CTA button
        $('.cta-btn').click(function() {
            showNotification('Registration form will open here!', 'info');
            
            // Add click animation
            $(this).addClass('animate-bounce');
            setTimeout(() => {
                $(this).removeClass('animate-bounce');
            }, 1000);
        });

        // Login button
        $('.login-btn').click(function() {
            showNotification('Login form will open here!', 'info');
            
            // Add click animation
            $(this).addClass('animate-bounce');
            setTimeout(() => {
                $(this).removeClass('animate-bounce');
            }, 1000);
        });
    }

    // ===== HOVER EFFECTS =====
    function initHoverEffects() {
        // Feature blocks hover effect
        $('.feature-block, .why-card, .power-item').hover(
            function() {
                $(this).addClass('animate-float');
            },
            function() {
                $(this).removeClass('animate-float');
            }
        );

        // Social icons hover effect
        $('.social-icons a, .community-social a').hover(
            function() {
                $(this).addClass('animate-bounce');
            },
            function() {
                $(this).removeClass('animate-bounce');
            }
        );
    }

    // ===== PARALLAX EFFECT =====
    function initParallaxEffect() {
        $(window).scroll(function() {
            const scrolled = $(window).scrollTop();
            const parallaxElements = $('.hero, .mission-image');
            
            parallaxElements.each(function() {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                $(this).css('transform', `translateY(${yPos}px)`);
            });
        });
    }

    // ===== TYPING ANIMATION =====
    function initTypingAnimation() {
        const titles = $('.why-title, .super-powers-title, .mission-text h2');
        
        titles.each(function() {
            const $this = $(this);
            const text = $this.text();
            $this.text('');
            
            let i = 0;
            const typeWriter = function() {
                if (i < text.length) {
                    $this.text($this.text() + text.charAt(i));
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            // Start typing animation when element is visible
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(this);
        });
    }

    // ===== COUNTER ANIMATION =====
    function initCounterAnimation() {
        const counters = $('.counter');
        
        counters.each(function() {
            const $this = $(this);
            const countTo = $this.attr('data-count');
            
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification notification-${type}">
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            </div>
        `);
        
        $('body').append(notification);
        
        // Show notification
        setTimeout(() => {
            notification.addClass('show');
        }, 100);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button
        notification.find('.notification-close').click(function() {
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.removeClass('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // ===== UTILITY FUNCTIONS =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== RESPONSIVE HANDLING =====
    function initResponsiveHandling() {
        $(window).resize(function() {
            if ($(window).width() > 768) {
                // Close offcanvas menu on desktop
                $('.offcanvas-overlay').removeClass('active');
                $('.offcanvas-menu').removeClass('active');
                $('body').css('overflow', '');
                $('.mobile-menu-btn').html('<i class="fas fa-bars"></i>');
            }
        });
    }

    // ===== PARTICLE EFFECT =====
    function initParticleEffect() {
        const particleContainer = $('<div class="particle-container"></div>');
        $('body').append(particleContainer);
        
        for (let i = 0; i < 50; i++) {
            const particle = $('<div class="particle"></div>');
            particle.css({
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 20 + 's',
                animationDuration: (Math.random() * 10 + 10) + 's'
            });
            particleContainer.append(particle);
        }
    }

    // ===== INITIALIZATION =====
    function init() {
        initLoadingAnimation();
        initScrollAnimations();
        initHeaderScrollEffect();
        initOffcanvasMenu();
        initSmoothScrolling();
        initFormInteractions();
        initButtonInteractions();
        initHoverEffects();
        initParallaxEffect();
        initTypingAnimation();
        initCounterAnimation();
        initResponsiveHandling();
        initParticleEffect();
        
        // Add CSS for notifications and particles
        addCustomCSS();
    }

    // ===== CUSTOM CSS INJECTION =====
    function addCustomCSS() {
        const customCSS = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .notification-success {
                border-left: 4px solid #28a745;
            }
            
            .notification-error {
                border-left: 4px solid #dc3545;
            }
            
            .notification-info {
                border-left: 4px solid #17a2b8;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
                margin-left: 10px;
            }
            
            .particle-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }
            
            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 107, 157, 0.3);
                border-radius: 50%;
                animation: float-particle linear infinite;
            }
            
            @keyframes float-particle {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        
        $('<style>').text(customCSS).appendTo('head');
    }

    // ===== EASING FUNCTIONS =====
    $.easing.easeInOutQuart = function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    };

    // Start the application
    init();
});
