// Shared JavaScript functionality for Thermal Grammar website

// Enhanced Page Transition System - Inspired by Blob Mixer
class PageTransition {
  constructor() {
    this.transitionElement = null;
    this.isTransitioning = false;
    this.blobs = [];
    this.init();
  }

  init() {
    // Create transition overlay with more blobs
    this.transitionElement = document.createElement('div');
    this.transitionElement.className = 'page-transition';
    this.transitionElement.innerHTML = `
      <div class="transition-blob"></div>
      <div class="transition-blob"></div>
      <div class="transition-blob"></div>
      <div class="transition-blob"></div>
      <div class="transition-blob"></div>
      <div class="transition-blob"></div>
    `;
    document.body.appendChild(this.transitionElement);

    // Store blob references
    this.blobs = this.transitionElement.querySelectorAll('.transition-blob');

    // Add content fade-in class to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('content-fade-in');
    }
  }

  async transitionTo(url) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Add playful entrance animation
    this.blobs.forEach((blob, index) => {
      blob.style.animationDelay = `${index * 0.2}s`;
      blob.style.animationDuration = `${4 + index * 0.5}s`;
    });

    // Show transition overlay with enhanced animation
    this.transitionElement.classList.add('active');

    // Create additional blob effects
    this.createBlobBurst();

    // Wait for transition to complete
    await new Promise(resolve => setTimeout(resolve, 800));

    // Navigate to new page
    window.location.href = url;
  }

  createBlobBurst() {
    // Create additional floating blobs for more playful effect
    for (let i = 0; i < 3; i++) {
      const extraBlob = document.createElement('div');
      extraBlob.className = 'transition-blob';
      extraBlob.style.position = 'absolute';
      extraBlob.style.left = `${Math.random() * 100}%`;
      extraBlob.style.top = `${Math.random() * 100}%`;
      extraBlob.style.width = `${60 + Math.random() * 40}px`;
      extraBlob.style.height = extraBlob.style.width;
      extraBlob.style.animationDelay = `${Math.random() * 2}s`;
      extraBlob.style.animationDuration = `${3 + Math.random() * 2}s`;
      extraBlob.style.opacity = '0.7';
      
      this.transitionElement.appendChild(extraBlob);
      
      // Remove extra blobs after animation
      setTimeout(() => {
        if (extraBlob.parentNode) {
          extraBlob.parentNode.removeChild(extraBlob);
        }
      }, 3000);
    }
  }

  hideTransition() {
    this.transitionElement.classList.remove('active');
    this.isTransitioning = false;
  }
}

// Initialize page transition system
const pageTransition = new PageTransition();



// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {

    // Add smooth scrolling to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to current navigation item
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Add enhanced page transition to navigation links
    const navLinksWithTransition = document.querySelectorAll('.main-nav a[href*="pages/"]');
    navLinksWithTransition.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            pageTransition.transitionTo(href);
        });
    });

    // Enhanced hover effects with blob-like animations
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-20px) scale(1.03)';
            this.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced matter items hover
    const matterItems = document.querySelectorAll('.matter-item');
    matterItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced tech categories hover
    const techCategories = document.querySelectorAll('.tech-category');
    techCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced questions hover
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        question.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        question.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced button animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.08)';
            this.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, observerOptions);

    // Observe elements for enhanced scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .matter-item, .tech-category, .question');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(60px) scale(0.95)';
        element.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });

    // Hide transition on page load with delay
    setTimeout(() => {
        pageTransition.hideTransition();
    }, 200);
});

// Enhanced utility function for generating recommendations (used in demo page)
function generateRecommendations(buildingType, zone, orientation, insulation, ac, heating, occupancy) {
    let main = "";
    let tips = "";
    let comfort = "";
    let savings = "";

    // Main recommendations based on combinations
    if (orientation === "south" && insulation === "poor") {
        main = "<p><strong>⚠️ High Overheating Risk:</strong> Your south-facing room with poor insulation may overheat significantly in the afternoon. Consider adding shades or improving wall insulation.</p>";
        tips = "<ul><li>Install blackout curtains or blinds</li><li>Use reflective window film</li><li>Consider a ceiling fan for air circulation</li><li>Plant shade trees outside if possible</li></ul>";
        comfort = "<p>Your room may exceed comfortable temperatures (75°F+) for 4-6 hours daily during summer months.</p>";
        savings = "<p>Implementing these changes could save $200-400 annually on cooling costs.</p>";
    } else if (orientation === "north" && ac === "yes") {
        main = "<p><strong>❄️ Potential Overcooling:</strong> Your north-facing room might be overcooled. Try using natural ventilation instead of AC when possible.</p>";
        tips = "<ul><li>Open windows during cooler evening hours</li><li>Use ceiling fans instead of AC when possible</li><li>Set AC temperature 2-3°F higher</li><li>Consider a programmable thermostat</li></ul>";
        comfort = "<p>North-facing rooms typically stay 3-5°F cooler than south-facing rooms, requiring less cooling.</p>";
        savings = "<p>Reducing AC usage could save $150-300 annually.</p>";
    } else if (insulation === "good" && ac === "no") {
        main = "<p><strong>✅ Excellent Energy Efficiency:</strong> Your well-insulated space with minimal AC use is already quite energy efficient!</p>";
        tips = "<ul><li>Maintain your current energy-conscious habits</li><li>Consider a smart thermostat for fine-tuning</li><li>Monitor for air leaks around windows/doors</li><li>Use ceiling fans for additional comfort</li></ul>";
        comfort = "<p>Your room likely maintains comfortable temperatures (68-75°F) with minimal mechanical intervention.</p>";
        savings = "<p>You're already saving $300-500 annually compared to typical usage patterns.</p>";
    } else if (orientation === "east" || orientation === "west") {
        main = "<p><strong>🌅 Moderate Solar Gain:</strong> Your east/west-facing room experiences moderate solar gain. Strategic shading can significantly improve comfort.</p>";
        tips = "<ul><li>Install awnings or exterior shades</li><li>Use light-colored curtains</li><li>Consider window film for UV protection</li><li>Optimize furniture placement away from direct sun</li></ul>";
        comfort = "<p>East-facing rooms get morning sun, west-facing get afternoon sun. Plan activities accordingly.</p>";
        savings = "<p>Proper shading could save $100-250 annually on cooling costs.</p>";
    } else {
        main = "<p><strong>📋 General Recommendations:</strong> Consider adding curtains, sealing air leaks, or using night cooling to improve comfort and energy efficiency.</p>";
        tips = "<ul><li>Seal air leaks around windows and doors</li><li>Use weather stripping</li><li>Consider energy-efficient window treatments</li><li>Optimize your heating/cooling schedule</li></ul>";
        comfort = "<p>Focus on maintaining temperatures between 68-75°F for optimal comfort and efficiency.</p>";
        savings = "<p>Basic energy efficiency measures could save $100-200 annually.</p>";
    }

    // Additional recommendations based on building type
    if (buildingType === "apartment") {
        main += "<p><strong>🏢 Apartment-Specific:</strong> Since you're in an apartment, focus on changes you can make within your unit.</p>";
    } else if (buildingType === "house") {
        main += "<p><strong>🏠 House-Specific:</strong> As a homeowner, you have more flexibility to make structural improvements.</p>";
    }

    // Heating recommendations
    if (heating === "space") {
        main += "<p><strong>🔥 Space Heater Safety:</strong> Use space heaters sparingly and ensure they have automatic shut-off features.</p>";
    }

    return {
        main: main,
        tips: tips,
        comfort: comfort,
        savings: savings
    };
}

// Enhanced form validation utility
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#F76841';
            isValid = false;
        } else {
            field.style.borderColor = '#A5C5E8';
        }
    });
    
    return isValid;
}

// Enhanced animation utility for elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .matter-item, .tech-category, .question');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(60px) scale(0.95)';
        element.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    animateOnScroll();
});

// Enhanced blob effect to form submissions
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Add enhanced blob animation to submit button
            const submitBtn = this.querySelector('.form-submit');
            if (submitBtn) {
                submitBtn.style.transform = 'translateY(-8px) scale(1.05)';
                setTimeout(() => {
                    submitBtn.style.transform = 'translateY(0) scale(1)';
                }, 300);
            }
        });
    });
});

// Add CSS for input blob animation
const inputBlobStyle = document.createElement('style');
inputBlobStyle.textContent = `
  @keyframes inputBlob {
    0% { transform: scale(0) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
    100% { transform: scale(2) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(inputBlobStyle); 