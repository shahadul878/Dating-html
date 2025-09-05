$(document).ready(function() {
    'use strict';

    // ===== LOADING ANIMATION =====
    function initLoadingAnimation() {
        // Loading animation disabled for better performance
        return;
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        // Scroll animations disabled for better performance
        return;
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
            const href = $(this).attr('href');
            if (!href || href === '#' || href === '') {
                e.preventDefault();
                showNotification('Login form will open here!', 'info');

                // Add click animation
                $(this).addClass('animate-bounce');
                setTimeout(() => {
                    $(this).removeClass('animate-bounce');
                }, 1000);
            }
            // If href exists and is not '#', let the default link behavior work
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
                    
                    // Show the signup form (step 5) after scrolling
                    setTimeout(() => {
                        showStep5();
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
            } else if (selectedName === 'looking-for' && (selectedId === 'relationship' || selectedId === 'friendship' || selectedId === 'adventure' || selectedId === 'unsure')) {
                nextStepFn = showStep3;
            } else if (selectedName === 'identity' && (selectedId === 'man' || selectedId === 'woman' || selectedId === 'non-binary')) {
                nextStepFn = showStep4;
            } else if (selectedName === 'partner-preference' && (selectedId === 'looking-man' || selectedId === 'looking-woman' || selectedId === 'looking-non-binary' || selectedId === 'looking-anyone')) {
                nextStepFn = showStep5;
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

        $('#backToStep4').click(function() {
            showStep4();
        });

        // Signup form validation
        $('#hero-signup-submit').click(function(e) {
            e.preventDefault();
            validateSignupForm();
        });

        // Real-time validation for hero form
        $('#hero-email').on('blur', function() {
            validateEmail($(this).val());
        });

        $('#hero-password').on('blur', function() {
            validatePassword($(this).val());
        });

        $('#hero-confirm-password').on('blur', function() {
            const password = $('#hero-password').val();
            const confirmPassword = $(this).val();
            if (confirmPassword && password !== confirmPassword) {
                showSignupError('hero-confirm-password-error', 'Passwords do not match');
            } else {
                clearSignupError('hero-confirm-password-error');
            }
        });
    }

    // ===== FORM STEP NAVIGATION =====
    function showStep2() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        const $step5 = $('#step5');
        
        // Hide all other steps
        $step1.addClass('fade-out');
        $step3.addClass('fade-out');
        $step4.addClass('fade-out');
        $step5.addClass('fade-out');
        
        setTimeout(() => {
            $step1.hide();
            $step3.hide();
            $step4.hide();
            $step5.hide();
            $step2.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step1.removeClass('fade-out');
                $step3.removeClass('fade-out');
                $step4.removeClass('fade-out');
                $step5.removeClass('fade-out');
                $step2.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    function showStep1() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        const $step5 = $('#step5');
        
        // Hide all other steps
        $step2.addClass('fade-out');
        $step3.addClass('fade-out');
        $step4.addClass('fade-out');
        $step5.addClass('fade-out');
        
        setTimeout(() => {
            $step2.hide();
            $step3.hide();
            $step4.hide();
            $step5.hide();
            $step1.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step2.removeClass('fade-out');
                $step3.removeClass('fade-out');
                $step4.removeClass('fade-out');
                $step5.removeClass('fade-out');
                $step1.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    function showStep3() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        const $step5 = $('#step5');
        
        // Hide all other steps
        $step1.addClass('fade-out');
        $step2.addClass('fade-out');
        $step4.addClass('fade-out');
        $step5.addClass('fade-out');
        
        setTimeout(() => {
            $step1.hide();
            $step2.hide();
            $step4.hide();
            $step5.hide();
            $step3.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step1.removeClass('fade-out');
                $step2.removeClass('fade-out');
                $step4.removeClass('fade-out');
                $step5.removeClass('fade-out');
                $step3.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    function showStep4() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        const $step5 = $('#step5');
        
        // Hide all other steps
        $step1.addClass('fade-out');
        $step2.addClass('fade-out');
        $step3.addClass('fade-out');
        $step5.addClass('fade-out');
        
        setTimeout(() => {
            $step1.hide();
            $step2.hide();
            $step3.hide();
            $step5.hide();
            $step4.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step1.removeClass('fade-out');
                $step2.removeClass('fade-out');
                $step3.removeClass('fade-out');
                $step5.removeClass('fade-out');
                $step4.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    function showStep5() {
        const $step1 = $('#step1');
        const $step2 = $('#step2');
        const $step3 = $('#step3');
        const $step4 = $('#step4');
        const $step5 = $('#step5');
        
        // Hide all other steps
        $step1.addClass('fade-out');
        $step2.addClass('fade-out');
        $step3.addClass('fade-out');
        $step4.addClass('fade-out');
        
        setTimeout(() => {
            $step1.hide();
            $step2.hide();
            $step3.hide();
            $step4.hide();
            $step5.show().addClass('fade-in');
            
            // Remove fade classes after animation
            setTimeout(() => {
                $step1.removeClass('fade-out');
                $step2.removeClass('fade-out');
                $step3.removeClass('fade-out');
                $step4.removeClass('fade-out');
                $step5.removeClass('fade-in');
            }, 400);
        }, 200);
    }

    // Make showStep5 available globally for mobile menu
    window.showStep5 = showStep5;

    // ===== BUTTON INTERACTIONS =====
    function initButtonInteractions() {
        // CTA button
        $('.cta-btn').click(function() {
            // Scroll to the hero section where the signup form is
            $('html, body').stop().animate({
                scrollTop: $('#home').offset().top - 80
            }, 1000, 'easeInOutQuart');
            
            // Show the signup form (step 5) after scrolling
            setTimeout(() => {
                showStep5();
                showNotification('Please complete the registration form below!', 'info');
            }, 1000);
            
            // Add click animation
            $(this).addClass('animate-bounce');
            setTimeout(() => {
                $(this).removeClass('animate-bounce');
            }, 1000);
        });

        // Login button - only show notification if it's not a proper link
        $('.login-btn').click(function(e) {
            const href = $(this).attr('href');
            // If it's not a proper link, show notification
            if (!href || href === '#' || href === '') {
                e.preventDefault();
                showNotification('Login form will open here!', 'info');
                
                // Add click animation
                $(this).addClass('animate-bounce');
                setTimeout(() => {
                    $(this).removeClass('animate-bounce');
                }, 1000);
            }
            // If href exists and is not '#', let the default link behavior work
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
            $('#backToLogin, #backToLoginFromSignup').click(function(e) {
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
        // Hover effects disabled for better performance
        return;
    }

    // ===== PARALLAX EFFECT =====


    // ===== TYPING ANIMATION =====
    function initTypingAnimation() {
        // Typing animation disabled for better performance
        return;
    }

    // ===== COUNTER ANIMATION =====
    function initCounterAnimation() {
        // Counter animation disabled for better performance
        return;
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
        // More robust email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    }

    // ===== SIGNUP FORM VALIDATION =====
    function validateSignupForm() {
        // Validate all steps first
        let isValid = true;
        
        // Clear previous errors
        clearSignupErrors();
        
        // Validate step 1: Dating experience
        if (!$('input[name="dating-experience"]:checked').length) {
            showSignupError('step1-error', 'Please select your dating experience');
            isValid = false;
        }
        
        // Validate step 2: Looking for
        if (!$('input[name="looking-for"]:checked').length) {
            showSignupError('step2-error', 'Please select what you are looking for');
            isValid = false;
        }
        
        // Validate step 3: Identity
        if (!$('input[name="identity"]:checked').length) {
            showSignupError('step3-error', 'Please select your identity');
            isValid = false;
        }
        
        // Validate step 4: Partner preference
        if (!$('input[name="partner-preference"]:checked').length) {
            showSignupError('step4-error', 'Please select your partner preference');
            isValid = false;
        }
        
        // Validate step 5: Form fields
        const nickname = $('#hero-nickname').val().trim();
        const email = $('#hero-email').val().trim();
        const password = $('#hero-password').val();
        const confirmPassword = $('#hero-confirm-password').val();
        const termsAccepted = $('#hero-terms').is(':checked');
        
        // Validate nickname
        if (!nickname || nickname.length < 2) {
            showSignupError('hero-nickname-error', 'Nickname must be at least 2 characters long');
            isValid = false;
        }
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            showSignupError('hero-email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password || password.length < 8) {
            showSignupError('hero-password-error', 'Password must be at least 8 characters long');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showSignupError('hero-confirm-password-error', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showSignupError('hero-confirm-password-error', 'Passwords do not match');
            isValid = false;
        }
        
        // Validate terms
        if (!termsAccepted) {
            showSignupError('hero-terms-error', 'You must accept the Terms & Conditions and User Agreement');
            isValid = false;
        }

        if (isValid) {
            showNotification('Registration successful! Welcome to our community!', 'success');
            // Here you would typically submit the form to your backend
            console.log('Signup data:', { 
                datingExperience: $('input[name="dating-experience"]:checked').val(),
                lookingFor: $('input[name="looking-for"]:checked').val(),
                identity: $('input[name="identity"]:checked').val(),
                partnerPreference: $('input[name="partner-preference"]:checked').val(),
                nickname, email, password 
            });
        }

        return isValid;
    }

    function validateEmail(email) {
        if (!email) {
            showSignupError('hero-email-error', 'Email address is required');
            return false;
        } else if (!isValidEmail(email)) {
            showSignupError('hero-email-error', 'Please enter a valid email address');
            return false;
        } else {
            clearSignupError('hero-email-error');
            return true;
        }
    }

    function validatePassword(password) {
        if (!password) {
            showSignupError('hero-password-error', 'Password is required');
            return false;
        } else if (password.length < 8) {
            showSignupError('hero-password-error', 'Password must be at least 8 characters long');
            return false;
        } else {
            clearSignupError('hero-password-error');
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

        // Multi-step signup form navigation
        initMultiStepSignup();

        // Signup form validation
        $('#signupFormContent').submit(function(e) {
            e.preventDefault();
            validateFinalSignupForm();
        });

    }

    function showSignupForm() {
        console.log('Showing signup form');
        $('.login-form-wrapper').hide();
        $('.signup-prompt').hide();
        $('#forgotPasswordForm').hide();
        $('#signupForm').show();
        // Reset to step 1
        showSignupStep(1);
    }

    function initMultiStepSignup() {
        console.log('Initializing multi-step signup');
        
        // Use event delegation to handle dynamically created elements
        $(document).on('change', 'input[name="signup-dating-experience"]', function() {
            console.log('Step 1 radio changed:', $(this).val());
            if ($(this).is(':checked')) {
                // Add selected class to parent radio-option
                $(this).closest('.radio-option').addClass('selected');
                showSignupStep(2);
            }
        });

        // Step 2: What are you looking for
        $(document).on('change', 'input[name="signup-looking-for"]', function() {
            console.log('Step 2 radio changed:', $(this).val());
            if ($(this).is(':checked')) {
                // Add selected class to parent radio-option
                $(this).closest('.radio-option').addClass('selected');
                showSignupStep(3);
            }
        });

        // Step 3: Identity selection
        $(document).on('change', 'input[name="signup-identity"]', function() {
            console.log('Step 3 radio changed:', $(this).val());
            if ($(this).is(':checked')) {
                // Add selected class to parent radio-option
                $(this).closest('.radio-option').addClass('selected');
                showSignupStep(4);
            }
        });

        // Step 4: Partner preference
        $(document).on('change', 'input[name="signup-partner-preference"]', function() {
            console.log('Step 4 radio changed:', $(this).val());
            if ($(this).is(':checked')) {
                // Add selected class to parent radio-option
                $(this).closest('.radio-option').addClass('selected');
                showSignupStep(5);
            }
        });

        // Back button functionality
        $(document).on('click', '#signup-back-to-step1', function() {
            console.log('Back to step 1');
            showSignupStep(1);
        });

        $(document).on('click', '#signup-back-to-step2', function() {
            console.log('Back to step 2');
            showSignupStep(2);
        });

        $(document).on('click', '#signup-back-to-step3', function() {
            console.log('Back to step 3');
            showSignupStep(3);
        });


        // Real-time validation for step 5 fields
        $(document).on('blur', '#signup-nickname', function() {
            validateSignupField('nickname', $(this).val());
        });

        $(document).on('blur', '#signup-email', function() {
            validateSignupField('email', $(this).val());
        });

        $(document).on('blur', '#signup-password', function() {
            validateSignupField('password', $(this).val());
        });

        $(document).on('blur', '#signup-confirm-password', function() {
            validateSignupField('confirm-password', $(this).val());
        });

        // Password toggle event delegation
        $(document).on('click', '.password-toggle', function() {
            const passwordInput = $(this).siblings('input[type="password"], input[type="text"]');
            const icon = $(this).find('i');
            
            console.log('Password toggle clicked');
            console.log('Input found:', passwordInput.length);
            console.log('Icon found:', icon.length);
            
            if (passwordInput.length === 0 || icon.length === 0) {
                console.error('Input or icon not found');
                return;
            }
            
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                icon.removeClass('fa-eye').addClass('fa-eye-slash');
                console.log('Password shown');
            } else {
                passwordInput.attr('type', 'password');
                icon.removeClass('fa-eye-slash').addClass('fa-eye');
                console.log('Password hidden');
            }
        });

        
        // Also add click handlers for radio options as backup
        $(document).on('click', '.radio-option', function() {
            const radioInput = $(this).find('input[type="radio"]');
            if (radioInput.length) {
                radioInput.prop('checked', true);
                radioInput.trigger('change');
            }
        });
    }

    function showSignupStep(stepNumber) {
        console.log('Showing signup step:', stepNumber);
        
        // Hide all steps
        $('.signup-step').hide();
        
        // Show the requested step
        $('#signup-step' + stepNumber).show();
        
        // Clear any previous errors
        clearAllSignupErrors();
        
        // Clear selected classes from radio options
        $('.radio-option').removeClass('selected');
        
        // Re-add selected class to checked radio buttons
        $('input[type="radio"]:checked').closest('.radio-option').addClass('selected');
    }

    // Make showSignupForm available globally for mobile menu
    window.showSignupForm = showSignupForm;

    // Debug function to test email validation
    window.testEmailValidation = function(email) {
        console.log('Testing email:', email);
        console.log('isValidEmail result:', isValidEmail(email));
        return isValidEmail(email);
    };

    function showLoginForm() {
        $('#signupForm').hide();
        $('#forgotPasswordForm').hide();
        $('.login-form-wrapper').show();
        $('.signup-prompt').show();
    }

    function validateFinalSignupForm() {
        // Validate all steps
        let isValid = true;
        
        // Clear previous errors
        clearAllSignupErrors();
        
        // Validate step 1: Dating experience
        if (!$('input[name="signup-dating-experience"]:checked').length) {
            showSignupError('signup-step1-error', 'Please select your dating experience');
            isValid = false;
        }
        
        // Validate step 2: Looking for
        if (!$('input[name="signup-looking-for"]:checked').length) {
            showSignupError('signup-step2-error', 'Please select what you are looking for');
            isValid = false;
        }
        
        // Validate step 3: Identity
        if (!$('input[name="signup-identity"]:checked').length) {
            showSignupError('signup-step3-error', 'Please select your identity');
            isValid = false;
        }
        
        // Validate step 4: Partner preference
        if (!$('input[name="signup-partner-preference"]:checked').length) {
            showSignupError('signup-step4-error', 'Please select your partner preference');
            isValid = false;
        }
        
        // Validate step 5: Form fields
        const nickname = $('#signup-nickname').val().trim();
        const email = $('#signup-email').val().trim();
        const password = $('#signup-password').val();
        const confirmPassword = $('#signup-confirm-password').val();
        const termsAccepted = $('#signup-terms').is(':checked');
        
        // Validate nickname
        if (!nickname || nickname.length < 2) {
            showSignupError('signup-nickname-error', 'Nickname must be at least 2 characters long');
            isValid = false;
        }
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            showSignupError('signup-email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password || password.length < 8) {
            showSignupError('signup-password-error', 'Password must be at least 8 characters long');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showSignupError('signup-confirm-password-error', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showSignupError('signup-confirm-password-error', 'Passwords do not match');
            isValid = false;
        }
        
        // Validate terms
        if (!termsAccepted) {
            showSignupError('signup-terms-error', 'You must accept the Terms & Conditions and User Agreement');
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            showNotification('Account created successfully! Welcome to our dating platform!', 'success');
            
            // Reset form
            $('#signupFormContent')[0].reset();
            
            // Go back to login form
            setTimeout(() => {
                showLoginForm();
            }, 2000);
        }
        
        return isValid;
    }

    function validateSignupField(fieldType, value) {
        switch (fieldType) {
            case 'nickname':
                if (!value || value.trim() === '') {
                    showSignupError('signup-nickname-error', 'Nickname is required');
                    return false;
                } else if (value.trim().length < 2) {
                    showSignupError('signup-nickname-error', 'Nickname must be at least 2 characters long');
                    return false;
                } else {
                    clearSignupError('signup-nickname-error');
                    return true;
                }
                break;
                
            case 'email':
                if (!value || value.trim() === '') {
                    showSignupError('signup-email-error', 'Email address is required');
                    return false;
                } else {
                    const trimmedValue = value.trim();
                    if (!isValidEmail(trimmedValue)) {
                        showSignupError('signup-email-error', 'Please enter a valid email address');
                        return false;
                    } else {
                        clearSignupError('signup-email-error');
                        return true;
                    }
                }
                break;
                
            case 'password':
                if (!value) {
                    showSignupError('signup-password-error', 'Password is required');
                    return false;
                } else if (value.length < 8) {
                    showSignupError('signup-password-error', 'Password must be at least 8 characters long');
                    return false;
                } else {
                    clearSignupError('signup-password-error');
                    return true;
                }
                break;
                
            case 'confirm-password':
                const password = $('#signup-password').val();
                if (!value) {
                    showSignupError('signup-confirm-password-error', 'Please confirm your password');
                    return false;
                } else if (value !== password) {
                    showSignupError('signup-confirm-password-error', 'Passwords do not match');
                    return false;
                } else {
                    clearSignupError('signup-confirm-password-error');
                    return true;
                }
                break;
                
            default:
                return true;
        }
    }

    function showSignupError(errorId, message) {
        $('#' + errorId).text(message).addClass('show');
        $('#' + errorId).closest('.form-group, .signup-step').addClass('error');
    }

    function clearSignupError(errorId) {
        $('#' + errorId).text('').removeClass('show');
        $('#' + errorId).closest('.form-group, .signup-step').removeClass('error');
    }

    function clearAllSignupErrors() {
        $('.error-message').text('').removeClass('show');
        $('.form-group, .signup-step').removeClass('error');
    }

    // Password toggle functions for signup form
    window.toggleSignupPassword = function() {
        const passwordInput = $('#signup-password');
        const icon = passwordInput.siblings('.password-toggle').find('i');
        
        console.log('toggleSignupPassword called');
        console.log('Password input found:', passwordInput.length);
        console.log('Icon found:', icon.length);
        console.log('Current type:', passwordInput.attr('type'));
        console.log('Step 5 visible:', $('#signup-step5').is(':visible'));
        
        if (passwordInput.length === 0) {
            console.error('Password input not found');
            return;
        }
        
        if (icon.length === 0) {
            console.error('Icon not found');
            return;
        }
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
            console.log('Password shown');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
            console.log('Password hidden');
        }
    };

    window.toggleSignupConfirmPassword = function() {
        const confirmPasswordInput = $('#signup-confirm-password');
        const icon = confirmPasswordInput.siblings('.password-toggle').find('i');
        
        if (confirmPasswordInput.attr('type') === 'password') {
            confirmPasswordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            confirmPasswordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    };

    // Password toggle functions for hero form
    window.toggleHeroPassword = function() {
        const passwordInput = $('#hero-password');
        const icon = passwordInput.siblings('.password-toggle').find('i');
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    };

    window.toggleHeroConfirmPassword = function() {
        const confirmPasswordInput = $('#hero-confirm-password');
        const icon = confirmPasswordInput.siblings('.password-toggle').find('i');
        
        if (confirmPasswordInput.attr('type') === 'password') {
            confirmPasswordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            confirmPasswordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    };

    // Password toggle function for login form
    window.togglePassword = function() {
        const passwordInput = $('#password');
        const icon = passwordInput.siblings('.password-toggle').find('i');
        
        console.log('togglePassword called');
        console.log('Password input found:', passwordInput.length);
        console.log('Icon found:', icon.length);
        
        if (passwordInput.length === 0) {
            console.error('Login password input not found');
            return;
        }
        
        if (icon.length === 0) {
            console.error('Login password icon not found');
            return;
        }
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
            console.log('Login password shown');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
            console.log('Login password hidden');
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
        // Particle effect disabled for better performance
        return;
    }

    // ===== MOBILE DETECTION AND OPTIMIZATION =====
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    function optimizeForMobile() {
        // Disable all animations globally for better performance
        $('*').css({
            'animation-duration': '0.01ms',
            'animation-iteration-count': '1',
            'transition-duration': '0.01ms'
        });
        
        // Remove hover effects
        $('.feature-block, .why-card, .power-item, .social-icons a, .community-social a').off('mouseenter mouseleave');
        
        // Disable particle effects for better performance
        $('.particle-container').remove();
        
        console.log('All animations disabled for better performance');
    }

    // ===== INITIALIZATION =====
    function init() {
        // Apply mobile optimizations first
        optimizeForMobile();
        
        // Only initialize features if elements exist
        initLoadingAnimation();
        
        // Scroll animations disabled
        // initScrollAnimations();
        
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
        
        // Hover effects disabled
        // initHoverEffects();
        
        // Typing animation disabled
        // initTypingAnimation();
        
        // Counter animation disabled
        // initCounterAnimation();
        
        // Initialize login page signup functionality if on login page
        if ($('.signup-prompt a').length) {
            initLoginPageSignup();
        }
        
        initResponsiveHandling();
        
        // Particle effect disabled
        // initParticleEffect();
        
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
