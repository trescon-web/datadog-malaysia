document.addEventListener('DOMContentLoaded', () => {
    // 9. Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 500); // Wait for fade out animation
        });
    } else {
        // Fallback if no preloader element
        document.body.classList.add('loaded');
    }

    // 1. Header Scroll Effect & 10. Back to Top visibility
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('.back-to-top');
    let ticking = false;

    const handleScroll = () => {
        // Header
        if (header) {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Back to top button
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
    // Check initial state
    handleScroll();

    // 2. Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle && header) {
        navToggle.addEventListener('click', () => {
            header.classList.toggle('nav-open');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link inside
        const navLinksList = document.querySelectorAll('.header .nav-link, .header a');
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('nav-open');
                navToggle.classList.remove('active');
            });
        });
    }

    // 3. Smooth Scroll
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip top-level hash
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Counter Animation
    const counters = document.querySelectorAll('.counter-number');
    const achievementSection = document.querySelector('.achievement');
    let countersAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            let startTime = null;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                
                // Calculate current value based on progress and duration
                const current = Math.min(Math.floor((progress / duration) * target), target);
                counter.innerText = current.toLocaleString();

                if (progress < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            window.requestAnimationFrame(step);
        });
    };

    if (counters.length > 0 && achievementSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(achievementSection);
    }

    // 5. Scroll Animations
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    if (animateOnScrollElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // Stop observing once animation triggers
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '-50px' });

        animateOnScrollElements.forEach(el => {
            scrollObserver.observe(el);
        });
    }

    // 6. Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (accordionHeaders.length > 0) {
        // Initialize the initially opened items (if any) to have correct max-height
        document.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(header => {
            const content = header.parentElement.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 32 + "px"; // added 32 for padding buffer
                content.style.paddingBottom = '24px';
                content.style.opacity = '1';
                content.style.display = ''; // Remove hardcoded inline display
            }
        });

        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const content = item.querySelector('.accordion-content');
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                
                // Close all other accordions
                document.querySelectorAll('.accordion-header').forEach(otherHeader => {
                    if (otherHeader !== header) {
                        otherHeader.setAttribute('aria-expanded', 'false');
                        const otherContent = otherHeader.parentElement.querySelector('.accordion-content');
                        if (otherContent) {
                            otherContent.style.maxHeight = null;
                            otherContent.style.paddingBottom = '0px';
                            otherContent.style.opacity = '0';
                        }
                    }
                });
                
                // Toggle current
                if (isExpanded) {
                    header.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = null;
                    content.style.paddingBottom = '0px';
                    content.style.opacity = '0';
                } else {
                    header.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = content.scrollHeight + 32 + "px";
                    content.style.paddingBottom = '24px';
                    content.style.opacity = '1';
                }
            });
        });
    }

    // 7. Portfolio Hover Effect (Touch Support)
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (portfolioItems.length > 0) {
        portfolioItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                // Remove active class from all other items
                portfolioItems.forEach(p => {
                    if (p !== this) p.classList.remove('active');
                });
                // Toggle active class on touched item
                this.classList.toggle('active');
            }, { passive: true });
        });
    }

    // 8. Active Nav Link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header .nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' });

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }
    // 10. Back to Top Button Click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 11. Cards Carousel Slider (Desktop: 3 per slide | Mobile: 1 per slide)
    const track = document.getElementById('cardsSliderTrack');
    const prevBtn = document.getElementById('cardsPrevBtn');
    const nextBtn = document.getElementById('cardsNextBtn');
    const dotsContainer = document.getElementById('cardsSliderDots');
    
    if (track && prevBtn && nextBtn) {
        let currentSlide = 0;

        function isMobile() {
            return window.innerWidth <= 768;
        }

        function getTotalSlides() {
            return isMobile() ? 6 : 2;
        }

        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const total = getTotalSlides();
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('span');
                dot.className = `slider-dot ${i === currentSlide ? 'active' : ''}`;
                dot.setAttribute('data-slide', i);
                dot.addEventListener('click', () => updateSlider(i));
                dotsContainer.appendChild(dot);
            }
        }

        function updateSlider(index) {
            const total = getTotalSlides();
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            currentSlide = index;

            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }

        prevBtn.addEventListener('click', () => updateSlider(currentSlide - 1));
        nextBtn.addEventListener('click', () => updateSlider(currentSlide + 1));

        window.addEventListener('resize', () => {
            currentSlide = 0;
            createDots();
            updateSlider(0);
        });

        createDots();
        updateSlider(0);
    }
});
