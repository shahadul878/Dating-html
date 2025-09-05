$(document).ready(function() {
    'use strict';

    // ===== LOADING ANIMATION =====
    function initLoadingAnimation() {
        // Check if user has already seen the loading screen
        const hasSeenLoading = localStorage.getItem('jensj_loading_seen');
        
        if (hasSeenLoading) {
            // User has already seen the loading screen, skip it
            return;
        }
        
        // Mark that user has seen the loading screen
        localStorage.setItem('jensj_loading_seen', 'true');
        
        const loaderHTML = `
            <div class="loading" id="pageLoader">
                <div class="loader-card">
                    <div class="loader-logo"></div>
                    <div class="loading-text">Finding Your Perfect Match</div>
                    <div class="loading-subtitle">Loading amazing possibilities...</div>
                    <div class="heart-container">
                        <div class="heart"></div>
                        <div class="heart"></div>
                        <div class="heart"></div>
                    </div>
                    <div class="dots-container">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar" id="progressBar"></div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').prepend(loaderHTML);
        
        // Simulate loading progress
        let progress = 0;
        const progressBar = $('#progressBar');
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // Hide loader after completion
                setTimeout(() => {
                    $('#pageLoader').addClass('hidden');
                    setTimeout(() => {
                        $('#pageLoader').remove();
                    }, 800);
                }, 500);
            }
            progressBar.css('width', progress + '%');
        }, 200);
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
            
            if (scrollTop > 41) {
                header.addClass('scrolled');
            } else {
                header.removeClass('scrolled');
            }
        });
    }

    // ===== OFFCANVAS MOBILE MENU =====
    function initOffcanvasMenu() {
        let offCanvasOverlay = $('.offcanvas-overlay');
        
        // Debug: Check if elements exist
        console.log('Mobile menu button:', $('.mobile-menu-btn').length);
        console.log('Offcanvas overlay:', offCanvasOverlay.length);
        console.log('Offcanvas menu:', $('.offcanvas-menu').length);
        
        // Open offcanvas menu
        $('.mobile-menu-btn').click(function() {
            console.log('Mobile menu button clicked');
            offCanvasOverlay.addClass('active');
            $('.offcanvas-menu').addClass('active');
            $('body').css('overflow', 'hidden');
            
            // Animate hamburger icon
            $(this).html('<i class="fas fa-times"></i>');
        });

        // Close offcanvas menu
        function closeOffcanvasMenu() {
            console.log('Closing mobile menu');
            offCanvasOverlay.removeClass('active');
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
            if (!$(this).attr('href')) {
                e.preventDefault();
                showNotification('Login form will open here!', 'info');

                // Add click animation
                $(this).addClass('animate-bounce');
                setTimeout(() => {
                    $(this).removeClass('animate-bounce');
                }, 1000);
            }
        });

        // Handle offcanvas register button
        $('.offcanvas-register-btn').click(function(e) {
            e.preventDefault();
            closeOffcanvasMenu();
            
            // Check if we're on the login page
            if (window.location.pathname.includes('login.html')) {
                // On login page, show the signup form
                setTimeout(() => {
                    showSignupForm();
                    showNotification('Please complete the registration form below!', 'info');
                }, 300);
            } else {
                // On main page, scroll to the signup form in hero section
                setTimeout(() => {
                    $('html, body').stop().animate({
                        scrollTop: $('#home').offset().top - 80
                    }, 1000, 'easeInOutQuart');
                    
                    // Show the signup form (step 4) after scrolling
                    setTimeout(() => {
                        showStep4();
                        showNotification('Please complete the registration form below!', 'info');
                    }, 1000);
                }, 300);
            }
            
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
        $('a[href^="#"]').each(function() {
            const $link = $(this);
            const href = $link.attr('href');
            
            // Only process valid anchor links
            if (href && href.length > 1) {
                $link.click(function(e) {
                    e.preventDefault();
                    const target = $(href);
                    
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
        });
    }

    // ===== FORM INTERACTIONS =====
    function initFormInteractions() {
        // Newsletter form
        $('#newsletter-form').submit(function(e) {
            e.preventDefault();
            const email = $('#newsletter-email').val();
            const timestamp = new Date().toISOString();
            
            // Set timestamp
            $('#newsletter-timestamp').val(timestamp);
            
            // Clear previous messages
            clearNewsletterMessages();
            
            if (email && isValidEmail(email)) {
                // Prepare data for backend integration
                const newsletterData = {
                    email: email,
                    source: 'website',
                    timestamp: timestamp,
                    userAgent: navigator.userAgent,
                    referrer: document.referrer,
                    url: window.location.href
                };
                
                // Show loading state
                showNewsletterLoading();
                
                // Simulate API call (replace with actual integration)
                submitNewsletterData(newsletterData);
                
            } else {
                showNewsletterError('Please enter a valid email address.');
            }
        });

        // Radio button selection with animation and form navigation
        $('.radio-option').click(function() {
            const $radio = $(this).find('input[type="radio"]');
            $radio.prop('checked', true);
            
            // Add selection animation
            $(this).addClass('animate-pulse');
            setTimeout(() => {
                $(this).removeClass('animate-pulse');
            }, 500);

            const selectedId = $radio.attr('id');
            const selectedName = $radio.attr('name');

            let nextStepFn = null;

            if (selectedName === 'dating-experience' && (selectedId === 'new' || selectedId === 'once' || selectedId === 'pro')) {
                nextStepFn = showStep2;
            } else if (selectedName === 'looking-for' && (selectedId === 'contacts' || selectedId === 'relationship' || selectedId === 'unsure')) {
                nextStepFn = showStep3;
            } else if (selectedName === 'preference' && (selectedId === 'man' || selectedId === 'woman' || selectedId === 'non-binary')) {
                nextStepFn = showStep4;
            }

            if (typeof nextStepFn === 'function') {
                setTimeout(() => {
                    nextStepFn();
                }, 300);
            }
        });

        // Back button functionality
        $('#backToStep1').click(function() {
            showStep1();
        });

        $('#backToStep2').click(function() {
            showStep2();
        });

        $('#backToStep3').click(function() {
            showStep3();
        });

        // Signup form validation
        $('#signup-submit').click(function(e) {
            e.preventDefault();
            validateSignupForm();
        });

        // Real-time validation
        $('#signup-email').on('blur', function() {
            validateEmail($(this).val());
        });

        $('#signup-password').on('blur', function() {
            validatePassword($(this).val());
        });
    }

    // ===== FORM STEP NAVIGATION =====
    function showStep2() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        
        // Hide all other steps
        $step1.addClass('fade-out');
        $step3.addClass('fade-out');
        $step4.addClass('fade-out');
        
        setTimeout(() => {
            $step1.hide();
            $step3.hide();
            $step4.hide();
            $step2.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step1.removeClass('fade-out');
                $step3.removeClass('fade-out');
                $step4.removeClass('fade-out');
                $step2.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    function showStep1() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        
        // Hide all other steps
        $step2.addClass('fade-out');
        $step3.addClass('fade-out');
        $step4.addClass('fade-out');
        
        setTimeout(() => {
            $step2.hide();
            $step3.hide();
            $step4.hide();
            $step1.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step2.removeClass('fade-out');
                $step3.removeClass('fade-out');
                $step4.removeClass('fade-out');
                $step1.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    function showStep3() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        
        // Hide all other steps
        $step1.addClass('fade-out');
        $step2.addClass('fade-out');
        $step4.addClass('fade-out');
        
        setTimeout(() => {
            $step1.hide();
            $step2.hide();
            $step4.hide();
            $step3.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step1.removeClass('fade-out');
                $step2.removeClass('fade-out');
                $step4.removeClass('fade-out');
                $step3.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    function showStep4() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        
        // Hide all other steps
        $step1.addClass('fade-out');
        $step2.addClass('fade-out');
        $step3.addClass('fade-out');
        
        setTimeout(() => {
            $step1.hide();
            $step2.hide();
            $step3.hide();
            $step4.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step1.removeClass('fade-out');
                $step2.removeClass('fade-out');
                $step3.removeClass('fade-out');
                $step4.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    // Make showStep4 available globally for mobile menu
    window.showStep4 = showStep4;

    // ===== BUTTON INTERACTIONS =====
    function initButtonInteractions() {
        // CTA button
        $('.cta-btn').click(function() {
            // Scroll to the hero section where the signup form is
            $('html, body').stop().animate({
                scrollTop: $('#home').offset().top - 80
            }, 1000, 'easeInOutQuart');
            
            // Show the signup form (step 4) after scrolling
            setTimeout(() => {
                showStep4();
                showNotification('Please complete the registration form below!', 'info');
            }, 1000);
            
            // Add click animation
            $(this).addClass('animate-bounce');
            setTimeout(() => {
                $(this).removeClass('animate-bounce');
            }, 1000);
        });

        // Login button - only show notification if it's not a link
        $('.login-btn').click(function(e) {
            // If it's not a link, show notification
            if (!$(this).attr('href')) {
                e.preventDefault();
                showNotification('Login form will open here!', 'info');
                
                // Add click animation
                $(this).addClass('animate-bounce');
                setTimeout(() => {
                    $(this).removeClass('animate-bounce');
                }, 1000);
            }
        });
    }

    // ===== LOGIN FORM FUNCTIONALITY =====
    function initLoginForm() {
        try {
            // Password toggle functionality
            $('.password-toggle').click(function() {
                const $passwordInput = $(this).siblings('input');
                const $icon = $(this).find('i');
                
                if ($passwordInput.attr('type') === 'password') {
                    $passwordInput.attr('type', 'text');
                    $icon.removeClass('fa-eye').addClass('fa-eye-slash');
                } else {
                    $passwordInput.attr('type', 'password');
                    $icon.removeClass('fa-eye-slash').addClass('fa-eye');
                }
            });

            // Login form submission
            $('.login-form').submit(function(e) {
                e.preventDefault();
                const email = $('#email').val();
                const password = $('#password').val();
                
                if (email && password) {
                    showNotification('Login form submitted successfully!', 'success');
                    console.log('Login form submitted:', { email, password });
                    // Add your login logic here
                } else {
                    showNotification('Please fill in all required fields.', 'error');
                }
            });

            // Forgot password functionality
            $('.recover-password').click(function(e) {
                e.preventDefault();
                $('.login-form-wrapper').hide();
                $('.signup-prompt').hide();
                $('#forgotPasswordForm').show();
            });

            // Back to login functionality
            $('#backToLogin').click(function(e) {
                e.preventDefault();
                $('#forgotPasswordForm').hide();
                $('.login-form-wrapper').show();
                $('.signup-prompt').show();
            });

            // Forgot password form submission
            $('.forgot-password-form-content').submit(function(e) {
                e.preventDefault();
                const email = $('#reset-email').val();
                
                if (email && isValidEmail(email)) {
                    showNotification('Password reset link sent to ' + email, 'success');
                    console.log('Password reset requested for:', email);
                    // Add your password reset logic here
                } else {
                    showNotification('Please enter a valid email address.', 'error');
                }
            });

            // Social login buttons
            $('.google-btn').click(function() {
                showNotification('Google login clicked', 'info');
                console.log('Google login clicked');
            });

            $('.facebook-btn').click(function() {
                showNotification('Facebook login clicked', 'info');
                console.log('Facebook login clicked');
            });
        } catch (error) {
            console.error('Error initializing login form:', error);
        }
    }

    // ===== HOVER EFFECTS =====
    function initHoverEffects() {
        // Feature blocks hover effect
        
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

    // ===== SIGNUP FORM VALIDATION =====
    function validateSignupForm() {
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        let isValid = true;

        // Clear previous errors
        clearSignupErrors();

        // Validate email
        if (!email) {
            showSignupError('email-error', 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showSignupError('email-error', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!password) {
            showSignupError('password-error', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showSignupError('password-error', 'Password must be at least 6 characters long');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showSignupError('password-error', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            isValid = false;
        }

        if (isValid) {
            showNotification('Registration successful! Welcome to our community!', 'success');
            // Here you would typically submit the form to your backend
            console.log('Signup data:', { email, password });
        }

        return isValid;
    }

    function validateEmail(email) {
        if (!email) {
            showSignupError('email-error', 'Email address is required');
            return false;
        } else if (!isValidEmail(email)) {
            showSignupError('email-error', 'Please enter a valid email address');
            return false;
        } else {
            clearSignupError('email-error');
            return true;
        }
    }

    function validatePassword(password) {
        if (!password) {
            showSignupError('password-error', 'Password is required');
            return false;
        } else if (password.length < 6) {
            showSignupError('password-error', 'Password must be at least 6 characters long');
            return false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showSignupError('password-error', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            return false;
        } else {
            clearSignupError('password-error');
            return true;
        }
    }

    function showSignupError(errorId, message) {
        $('#' + errorId).text(message).addClass('show');
        $('#' + errorId).closest('.form-group').addClass('error');
    }

    function clearSignupError(errorId) {
        $('#' + errorId).text('').removeClass('show');
        $('#' + errorId).closest('.form-group').removeClass('error');
    }

    function clearSignupErrors() {
        $('.error-message').text('').removeClass('show');
        $('.form-group').removeClass('error');
    }

    // ===== NEWSLETTER INTEGRATION =====
    function submitNewsletterData(data) {
        // This is where you would integrate with your backend or newsletter service
        // Examples of popular integrations:
        
        // 1. Mailchimp Integration
        // submitToMailchimp(data);
        
        // 2. SendGrid Integration
        // submitToSendGrid(data);
        
        // 3. Custom Backend API
        // submitToCustomAPI(data);
        
        // 4. Google Analytics Event
        // gtag('event', 'newsletter_signup', {
        //     'event_category': 'engagement',
        //     'event_label': data.email
        // });
        
        // For now, simulate a successful submission
        setTimeout(() => {
            showNewsletterSuccess('Thank you for subscribing to our newsletter!');
            $('#newsletter-email').val('');
            hideNewsletterLoading();
            
            // Log the data for debugging (remove in production)
            console.log('Newsletter signup data:', data);
        }, 1500);
    }

    function submitToMailchimp(data) {
        // Example Mailchimp integration
        // Replace with your actual Mailchimp endpoint and API key
        /*
        $.ajax({
            url: 'https://your-domain.us1.list-manage.com/subscribe/post-json?u=YOUR_USER_ID&id=YOUR_LIST_ID',
            method: 'POST',
            data: {
                'EMAIL': data.email,
                'SOURCE': data.source,
                'TIMESTAMP': data.timestamp
            },
            success: function(response) {
                showNewsletterSuccess('Thank you for subscribing!');
                $('#newsletter-email').val('');
            },
            error: function() {
                showNewsletterError('Something went wrong. Please try again.');
            }
        });
        */
    }

    function submitToCustomAPI(data) {
        // Example custom API integration
        /*
        $.ajax({
            url: '/api/newsletter/subscribe',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                showNewsletterSuccess('Thank you for subscribing!');
                $('#newsletter-email').val('');
            },
            error: function() {
                showNewsletterError('Something went wrong. Please try again.');
            }
        });
        */
    }

    function showNewsletterLoading() {
        $('.newsletter-btn').text('Subscribing...').prop('disabled', true);
    }

    function hideNewsletterLoading() {
        $('.newsletter-btn').text('Submit').prop('disabled', false);
    }

    function showNewsletterSuccess(message) {
        $('#newsletter-success').text(message).addClass('show');
        setTimeout(() => {
            $('#newsletter-success').removeClass('show');
        }, 5000);
    }

    function showNewsletterError(message) {
        $('#newsletter-error').text(message).addClass('show');
        setTimeout(() => {
            $('#newsletter-error').removeClass('show');
        }, 5000);
    }

    function clearNewsletterMessages() {
        $('#newsletter-error').text('').removeClass('show');
        $('#newsletter-success').text('').removeClass('show');
    }

    // ===== LOADING SCREEN UTILITIES =====
    // Function to reset loading screen (useful for testing)
    function resetLoadingScreen() {
        localStorage.removeItem('jensj_loading_seen');
        console.log('Loading screen reset. It will show on next page load.');
    }

    // Function to force show loading screen (useful for testing)
    function forceShowLoadingScreen() {
        localStorage.removeItem('jensj_loading_seen');
        initLoadingAnimation();
    }

    // Make functions available globally for testing (remove in production)
    window.resetLoadingScreen = resetLoadingScreen;
    window.forceShowLoadingScreen = forceShowLoadingScreen;

    // ===== LOGIN PAGE SIGNUP FUNCTIONALITY =====
    function initLoginPageSignup() {
        // Show signup form when "Sign up!" link is clicked
        $('.signup-prompt a').click(function(e) {
            e.preventDefault();
            showSignupForm();
        });

        // Back to login from signup
        $('#backToLoginFromSignup').click(function(e) {
            e.preventDefault();
            showLoginForm();
        });

        // Signup form validation
        $('#signupFormContent').submit(function(e) {
            e.preventDefault();
            validateLoginPageSignupForm();
        });

        // Real-time validation for signup form
        $('#signup-firstname').on('blur', function() {
            validateSignupField('firstname', $(this).val());
        });

        $('#signup-lastname').on('blur', function() {
            validateSignupField('lastname', $(this).val());
        });

        $('#signup-email').on('blur', function() {
            validateSignupField('email', $(this).val());
        });

        $('#signup-password').on('blur', function() {
            validateSignupField('password', $(this).val());
        });

        $('#signup-confirm-password').on('blur', function() {
            validateSignupField('confirm-password', $(this).val());
        });
    }

    function showSignupForm() {
        $('.login-form-wrapper').hide();
        $('.signup-prompt').hide();
        $('#forgotPasswordForm').hide();
        $('#signupForm').show();
    }

    // Make showSignupForm available globally for mobile menu
    window.showSignupForm = showSignupForm;

    function showLoginForm() {
        $('#signupForm').hide();
        $('#forgotPasswordForm').hide();
        $('.login-form-wrapper').show();
        $('.signup-prompt').show();
    }

    function validateLoginPageSignupForm() {
        const firstname = $('#signup-firstname').val();
        const lastname = $('#signup-lastname').val();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        const confirmPassword = $('#signup-confirm-password').val();
        const terms = $('#terms').is(':checked');
        
        let isValid = true;

        // Clear previous errors
        clearLoginPageSignupErrors();

        // Validate first name
        if (!firstname.trim()) {
            showLoginPageSignupError('firstname-error', 'First name is required');
            isValid = false;
        } else if (firstname.trim().length < 2) {
            showLoginPageSignupError('firstname-error', 'First name must be at least 2 characters');
            isValid = false;
        }

        // Validate last name
        if (!lastname.trim()) {
            showLoginPageSignupError('lastname-error', 'Last name is required');
            isValid = false;
        } else if (lastname.trim().length < 2) {
            showLoginPageSignupError('lastname-error', 'Last name must be at least 2 characters');
            isValid = false;
        }

        // Validate email
        if (!email) {
            showLoginPageSignupError('signup-email-error', 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showLoginPageSignupError('signup-email-error', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!password) {
            showLoginPageSignupError('signup-password-error', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showLoginPageSignupError('signup-password-error', 'Password must be at least 6 characters long');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showLoginPageSignupError('signup-password-error', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPassword) {
            showLoginPageSignupError('confirm-password-error', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showLoginPageSignupError('confirm-password-error', 'Passwords do not match');
            isValid = false;
        }

        // Validate terms
        if (!terms) {
            showNotification('Please accept the Terms & Conditions to continue', 'error');
            isValid = false;
        }

        if (isValid) {
            showNotification('Account created successfully! Welcome to our community!', 'success');
            // Here you would typically submit the form to your backend
            console.log('Signup data:', { firstname, lastname, email, password });
            
            // Clear form and go back to login
            setTimeout(() => {
                $('#signupFormContent')[0].reset();
                showLoginForm();
            }, 2000);
        }

        return isValid;
    }

    function validateSignupField(fieldType, value) {
        switch (fieldType) {
            case 'firstname':
                if (!value.trim()) {
                    showLoginPageSignupError('firstname-error', 'First name is required');
                    return false;
                } else if (value.trim().length < 2) {
                    showLoginPageSignupError('firstname-error', 'First name must be at least 2 characters');
                    return false;
                } else {
                    clearLoginPageSignupError('firstname-error');
                    return true;
                }
                
            case 'lastname':
                if (!value.trim()) {
                    showLoginPageSignupError('lastname-error', 'Last name is required');
                    return false;
                } else if (value.trim().length < 2) {
                    showLoginPageSignupError('lastname-error', 'Last name must be at least 2 characters');
                    return false;
                } else {
                    clearLoginPageSignupError('lastname-error');
                    return true;
                }
                
            case 'email':
                if (!value) {
                    showLoginPageSignupError('signup-email-error', 'Email address is required');
                    return false;
                } else if (!isValidEmail(value)) {
                    showLoginPageSignupError('signup-email-error', 'Please enter a valid email address');
                    return false;
                } else {
                    clearLoginPageSignupError('signup-email-error');
                    return true;
                }
                
            case 'password':
                if (!value) {
                    showLoginPageSignupError('signup-password-error', 'Password is required');
                    return false;
                } else if (value.length < 6) {
                    showLoginPageSignupError('signup-password-error', 'Password must be at least 6 characters long');
                    return false;
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    showLoginPageSignupError('signup-password-error', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
                    return false;
                } else {
                    clearLoginPageSignupError('signup-password-error');
                    return true;
                }
                
            case 'confirm-password':
                const password = $('#signup-password').val();
                if (!value) {
                    showLoginPageSignupError('confirm-password-error', 'Please confirm your password');
                    return false;
                } else if (password !== value) {
                    showLoginPageSignupError('confirm-password-error', 'Passwords do not match');
                    return false;
                } else {
                    clearLoginPageSignupError('confirm-password-error');
                    return true;
                }
        }
    }

    function showLoginPageSignupError(errorId, message) {
        $('#' + errorId).text(message).addClass('show');
        $('#' + errorId).closest('.form-group').addClass('error');
    }

    function clearLoginPageSignupError(errorId) {
        $('#' + errorId).text('').removeClass('show');
        $('#' + errorId).closest('.form-group').removeClass('error');
    }

    function clearLoginPageSignupErrors() {
        $('.error-message').text('').removeClass('show');
        $('.form-group').removeClass('error');
    }

    // Password toggle functions for signup form
    window.toggleSignupPassword = function() {
        const passwordInput = $('#signup-password');
        const icon = $('.password-toggle i').first();
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    };

    window.toggleSignupConfirmPassword = function() {
        const passwordInput = $('#signup-confirm-password');
        const icon = $('.password-toggle i').last();
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    };

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

    // ===== MOBILE DETECTION AND OPTIMIZATION =====
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    function optimizeForMobile() {
        if (isMobileDevice()) {
            // Disable animations on mobile
            $('*').css({
                'animation-duration': '0.01ms',
                'animation-iteration-count': '1',
                'transition-duration': '0.01ms'
            });
            
            // Remove hover effects
            $('.feature-block, .why-card, .power-item, .social-icons a, .community-social a').off('mouseenter mouseleave');
            
            // Disable particle effects on mobile for better performance
            $('.particle-container').remove();
            
            console.log('Mobile optimizations applied');
        }
    }

    // ===== INITIALIZATION =====
    function init() {
        // Apply mobile optimizations first
        optimizeForMobile();
        
        // Only initialize features if elements exist
        initLoadingAnimation();
        
        if ($('.features-grid, .why-grid, .powers-grid, .mission-content, .hero-form').length && !isMobileDevice()) {
            initScrollAnimations();
        }
        
        if ($('.main-header').length) {
            initHeaderScrollEffect();
        }
        
        if ($('.mobile-menu-btn').length) {
            initOffcanvasMenu();
        }
        
        if ($('a[href^="#"]').length) {
            initSmoothScrolling();
        }
        
        if ($('.newsletter-form, .radio-option').length) {
            initFormInteractions();
        }
        
        if ($('.cta-btn, .login-btn').length) {
            initButtonInteractions();
        }
        
        if ($('.login-form, .forgot-password-form').length) {
            initLoginForm();
        }
        
        if ($('.social-icons, .community-social').length) {
            initHoverEffects();
        }
        
        if ($('.why-title, .super-powers-title, .mission-text h2').length) {
            initTypingAnimation();
        }
        
        if ($('.counter').length) {
            initCounterAnimation();
        }
        
        // Initialize login page signup functionality if on login page
        if ($('.signup-prompt a').length) {
            initLoginPageSignup();
        }
        
        initResponsiveHandling();
        
        // Only initialize particle effect on desktop
        if (!isMobileDevice()) {
            initParticleEffect();
        }
        
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

            /* Signup Form Error Styles */
            .error-message {
                color: #dc3545;
                font-size: 12px;
                margin-top: 5px;
                opacity: 0;
                transition: opacity 0.3s ease;
                min-height: 16px;
            }

            .error-message.show {
                opacity: 1;
            }

            .form-group.error input {
                border-color: #dc3545;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
            }

            .form-group.error input:focus {
                border-color: #dc3545;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
            }

            /* Newsletter Form Styles */
            .newsletter-error, .newsletter-success {
                margin-top: 10px;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.3s ease;
                min-height: 20px;
            }

            .newsletter-error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }

            .newsletter-success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }

            .newsletter-error.show, .newsletter-success.show {
                opacity: 1;
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
