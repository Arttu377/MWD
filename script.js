// Portfolio JavaScript
// Hide loading screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(function() {
            loadingScreen.classList.add('hidden');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 0);
    }
});

document.addEventListener("DOMContentLoaded", function() {

    // Mobile Navigation Toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function() {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            document.body.classList.toggle("menu-open");
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.classList.remove("menu-open");
            });
        });
    }
    
    // Active navigation item based on scroll position
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    
    function updateActiveNav() {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }
    
    window.addEventListener("scroll", updateActiveNav);
    updateActiveNav(); // Call once on page load
    
    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 100) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const offsetTop = target.offsetTop - 50;
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });
    
    // Portfolio filter functionality
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    
    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", function() {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");
                
                const filterValue = this.getAttribute("data-filter");
                
                portfolioItems.forEach(item => {
                    if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                        item.style.display = "block";
                        item.style.animation = "fadeInUp 0.5s ease";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }
    
    // Skill bars animation
    const skillBars = document.querySelectorAll(".skill-progress");
    const observerOptions = {
        threshold: 0.5,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute("data-width");
                skillBar.style.width = width;
                skillObserver.unobserve(skillBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
    
    // Contact form handling
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const company = formData.get("company");
            const email = formData.get("email");
            const phone = formData.get("phone");
            const message = formData.get("message");
            
            if (!company || !email || !phone || !message) {
                alert("Täytä kaikki kentät.");
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Anna kelvollinen sähköpostiosoite.");
                return;
            }
            
            const submitButton = this.querySelector("button[type=\"submit\"]");
            const originalText = submitButton.textContent;
            
            submitButton.textContent = "Lähetetään...";
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert("Kiitos viestistäsi! Otan yhteyttä sinuun pian.");
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll(".service-card, .portfolio-item, .about-text, .contact-info");
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    fadeElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        fadeObserver.observe(element);
    });
    
    console.log("%cTervetuloa portfolio-sivustolleni! 🚀", "color: #667eea; font-size: 16px; font-weight: bold;");
    console.log("%cJos olet kiinnostunut yhteistyöstä, ota yhteyttä!", "color: #666; font-size: 14px;");
    
    // Initialize Google Map
    initMapFull();
});

// Google Maps initialization - Make it global
window.initMapFull = function() {
    // Wait for DOM to be ready
    setTimeout(function() {
        // Check if map element exists
        const mapElement = document.getElementById('map-full');
        if (!mapElement) {
            console.log('Map element not found');
            return;
        }
        
        // Rajakatu, Jyväskylä coordinates
        const jyvaskyla = { lat: 62.2405, lng: 25.7440 };
        
        // Create map with disabled controls
        const map = new google.maps.Map(mapElement, {
            zoom: 10,
            center: jyvaskyla,
            mapTypeId: 'roadmap',
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy'
        });
        
        // Add marker
        const marker = new google.maps.Marker({
            position: jyvaskyla,
            map: map,
            title: 'Rajakatu, Jyväskylä',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.7 0 0 6.7 0 15s15 15 15 15 15-6.7 15-15S23.3 0 15 0z" fill="#ff4444"/>
                        <circle cx="15" cy="15" r="6" fill="#ffffff"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(30, 30)
            }
        });
    }, 100);
}
