// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }
  
  // Duplicate technologies for infinite scroll
  const techTrack = document.querySelector('.technologies-track');
  if (techTrack) {
    const techItems = Array.from(techTrack.children);
    techItems.forEach(item => {
      const clone = item.cloneNode(true);
      techTrack.appendChild(clone);
    });
  }
  
  // Contact Form - Send to WhatsApp
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const message = document.getElementById('message').value;
      
      // Your WhatsApp number (replace with your actual number)
      const whatsappNumber = '919391902320';
      
      // Create WhatsApp message
      const whatsappMessage = `*New Contact Form Submission*%0A%0A` +
                             `*Name:* ${encodeURIComponent(name)}%0A` +
                             `*Phone:* ${encodeURIComponent(phone)}%0A%0A` +
                             `*Message:*%0A${encodeURIComponent(message)}`;
      
      // Open WhatsApp with the message
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
      
      // Reset form
      contactForm.reset();
    });
  }
  
  // Portfolio Load More Button
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    let isExpanded = false;
    
    loadMoreBtn.addEventListener('click', function() {
      const hiddenItems = document.querySelectorAll('.portfolio-hidden');
      
      if (!isExpanded) {
        // Show all hidden projects
        hiddenItems.forEach(item => {
          item.classList.remove('portfolio-hidden');
        });
        loadMoreBtn.textContent = 'Contact Us for More';
        isExpanded = true;
      } else {
        // Redirect to contact section
        window.location.href = '#contact';
      }
    });
  }
  
  // Image Modal
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.modal-close');
  
  // Add click event to all portfolio images
  const portfolioImages = document.querySelectorAll('.portfolio-image');
  portfolioImages.forEach(imageDiv => {
    imageDiv.addEventListener('click', function() {
      const imageSrc = this.getAttribute('data-image');
      modal.classList.add('active');
      modalImg.src = imageSrc;
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });
  
  // Close modal when clicking X
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
  }
  
  // Close modal when clicking outside the image
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    if (e.key === 'Escape' && techModal && techModal.classList.contains('active')) {
      techModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
  
  // Tech Stack Modal
  const techModal = document.getElementById('techModal');
  const techModalClose = document.querySelector('.tech-modal-close');
  const technologiesSlider = document.querySelector('.technologies-slider');
  
  // Open tech modal when clicking on technologies slider
  if (technologiesSlider) {
    technologiesSlider.addEventListener('click', function() {
      techModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Close tech modal when clicking X
  if (techModalClose) {
    techModalClose.addEventListener('click', function() {
      techModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }
  
  // Close tech modal when clicking outside
  if (techModal) {
    techModal.addEventListener('click', function(e) {
      if (e.target === techModal) {
        techModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  // Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe all animated elements
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-right-portfolio, .scale-in');
  animatedElements.forEach(el => observer.observe(el));
  
  // Parallax Effect on Scroll
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
          const heroImage = heroSection.querySelector('.hero-image');
          if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
          }
        }
        
        // Parallax for services section
        const servicesSection = document.querySelector('.services');
        if (servicesSection) {
          const servicesCards = servicesSection.querySelectorAll('.service-card');
          const sectionTop = servicesSection.offsetTop;
          const offset = scrolled - sectionTop;
          if (offset > -500 && offset < 500) {
            servicesCards.forEach((card, index) => {
              card.style.transform = `translateY(${offset * 0.1}px)`;
            });
          }
        }
        
        // Parallax for portfolio section
        const portfolioSection = document.querySelector('.portfolio');
        if (portfolioSection) {
          const portfolioItems = portfolioSection.querySelectorAll('.portfolio-item');
          const sectionTop = portfolioSection.offsetTop;
          const offset = scrolled - sectionTop;
          if (offset > -500 && offset < 500) {
            portfolioItems.forEach((item, index) => {
              item.style.transform = `translateY(${offset * 0.08}px)`;
            });
          }
        }
        
        // Parallax for about section
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
          const aboutImage = aboutSection.querySelector('.about-image-wrapper');
          if (aboutImage) {
            const sectionTop = aboutSection.offsetTop;
            const offset = scrolled - sectionTop;
            if (offset > -500 && offset < 500) {
              aboutImage.style.transform = `translateY(${offset * 0.15}px)`;
            }
          }
        }
        
        // Parallax for process section
        const processSection = document.querySelector('.process-section');
        if (processSection) {
          const processCards = processSection.querySelectorAll('.process-card');
          const sectionTop = processSection.offsetTop;
          const offset = scrolled - sectionTop;
          if (offset > -500 && offset < 500) {
            processCards.forEach((card, index) => {
              card.style.transform = `translateY(${offset * 0.12}px)`;
            });
          }
        }
        
        // Parallax for contact section
        const contactSection = document.querySelector('.contact');
        if (contactSection) {
          const contactForm = contactSection.querySelector('#contactForm');
          const sectionTop = contactSection.offsetTop;
          const offset = scrolled - sectionTop;
          if (offset > -500 && offset < 500) {
            if (contactForm) {
              contactForm.style.transform = `translateY(${offset * 0.1}px)`;
            }
          }
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
});
