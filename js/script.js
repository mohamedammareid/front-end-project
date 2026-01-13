document.addEventListener('DOMContentLoaded', () => {
    // Select the links container (which contains both the icon and the ul)
    const linksContainer = document.querySelector('.header .links');

    // Select the icon specifically to listen for clicks
    const burgerIcon = document.querySelector('.header .links .icon');

    if (burgerIcon && linksContainer) {
        burgerIcon.addEventListener('click', (e) => {
            // Stop propagation so clicking the icon doesn't immediately close the menu if we had a document listener
            e.stopPropagation();

            // Toggle the 'open' class on the container
            linksContainer.classList.toggle('open');
        });

        // Optional: Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!linksContainer.contains(e.target)) {
                linksContainer.classList.remove('open');
            }
        });
    }

    // Scroll To Top
    let span = document.querySelector(".up");

    window.onscroll = function () {
        if (this.scrollY >= 1000) {
            span.classList.add("show");
        } else {
            span.classList.remove("show");
        }
    };

    span.onclick = function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Dark Mode Toggle
    const toggleButton = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            toggleButton.classList.replace('fa-moon', 'fa-sun');
        }
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark-mode');
                toggleButton.classList.replace('fa-moon', 'fa-sun');
            } else {
                localStorage.setItem('theme', 'light-mode');
                toggleButton.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Form Validation & Real Submission (Formspree)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const status = document.getElementById('form-status');
            const originalText = btn.innerHTML;

            // Basic Validation
            const email = document.getElementById('email').value;
            if (!email || !email.includes('@')) {
                status.textContent = "Please enter a valid email.";
                status.style.color = "red";
                return;
            }

            // UI Loading State
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            status.textContent = "";

            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.textContent = "Thanks! Your message has been sent.";
                    status.style.color = "green";
                    btn.innerHTML = 'Sent <i class="fas fa-check"></i>';
                    btn.style.backgroundColor = '#4CAF50';
                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                        status.textContent = "";
                    }, 5000);
                } else {
                    const errorData = await response.json();
                    if (Object.hasOwn(errorData, 'errors')) {
                        status.textContent = errorData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.textContent = "Oops! There was a problem submitting your form";
                    }
                    status.style.color = "red";
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                status.textContent = "Oops! There was a problem submitting your form";
                status.style.color = "red";
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }



    // Portfolio Filter Logic
    const filterButtons = document.querySelectorAll('.portfolio-filter button');
    const portfolioCards = document.querySelectorAll('.portfolio-content .card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hide');
                        card.classList.add('reveal'); // Re-trigger animation
                    } else {
                        card.classList.add('hide');
                        card.classList.remove('reveal');
                    }
                });
            });
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.accordion .item');
    faqItems.forEach(item => {
        const question = item.querySelector('.question');
        question.addEventListener('click', () => {
            // Close others? Optional. Let's toggle only current for now.
            item.classList.toggle('active');
            const answer = item.querySelector('.answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

    // Cookie Consent Logic
    const cookieBanner = document.createElement('div');
    cookieBanner.classList.add('cookie-banner');
    cookieBanner.innerHTML = `
        <p>We use cookies to improve your experience. By using our site, you agree to our policies.</p>
        <button id="acceptCookies">Accept</button>
    `;
    document.body.appendChild(cookieBanner);

    const acceptBtn = document.getElementById('acceptCookies');

    // Check if already accepted
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000); // Show after 2 seconds
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
    });

    // Page Transitions
    document.body.classList.add('loaded');



    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = this.getAttribute('target');

            // If it's an internal link and not a hash link
            if (href && !href.startsWith('#') && !target && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                e.preventDefault();
                document.body.classList.remove('loaded');
                setTimeout(() => {
                    window.location.href = href;
                }, 300); // Match CSS transition time
            }
        });
    });

    // Stats Counter Animation
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        let started = false; // Function Started ? No

        function startCount(el) {
            let goal = el.dataset.goal;
            let count = setInterval(() => {
                el.textContent++;
                if (el.textContent == goal) {
                    clearInterval(count);
                }
            }, 2000 / goal);
        }

        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                document.querySelectorAll(".stats .number").forEach((num) => startCount(num));
                started = true;
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }
    // --------------------------------------------------
    // ADVANCED FEATURES
    // --------------------------------------------------

    // 1. Typewriter Effect
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const textToType = "Innovating Your Digital Future";
        let charIndex = 0;

        function type() {
            if (charIndex < textToType.length) {
                typewriterElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            } else {
                // Optional: Stop cursor blinking after typing finishes
                // document.querySelector('.cursor').style.animation = 'none';
            }
        }

        // Start typing after a short delay
        setTimeout(type, 1000);
    }

    // 2. Reading Progress Bar
    // Create the bar dynamically if it doesn't represent in HTML (or we can add it to HTML, simpler to do here)
    if (document.body.classList.contains('page-blog') || window.location.href.includes('blog') || window.location.href.includes('case-study')) {
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-container';
        progressBarContainer.style.display = 'block'; // Show it

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        progressBarContainer.appendChild(progressBar);
        document.body.appendChild(progressBarContainer);

        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // 3. Newsletter Logic
    const newsletterForms = document.querySelectorAll('.footer .box form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');

            if (input.value.trim() === "") return;

            // Simulate sending
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;

            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = '#4CAF50';
                input.value = "";
                input.placeholder = "Subscribed!";

                // Reset after 3 seconds
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.style.background = '';
                    button.disabled = false;
                    input.placeholder = "Your Email";
                }, 3000);
            }, 1500);
        });
    });

    // 4. Dynamic Year
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} IO Agency. All Rights Reserved.`;
    }

    // 5. Auto-Active Navigation
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.header .links ul li a');

    navLinks.forEach(link => {
        // Remove hardcoded active classes
        link.classList.remove('active');

        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        }
    });

});
