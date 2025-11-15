/* ============================
   script.js — RICHELLY SHOP
   Interacciones mejoradas
   ============================ */

// WhatsApp helper actualizado
const WA_NUMBER = '51965115456';
const wa = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

// Reveal cards on scroll (IntersectionObserver) - Mejorado
(function revealCards() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 100 * Array.from(cards).indexOf(entry.target)); // Efecto escalonado
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => io.observe(c));
})();

// Modal mejorado con más funcionalidades
(function modalLogic() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const modalWa = document.getElementById('modal-wa');
  const modalClose = document.getElementById('modal-close');
  const modalClose2 = document.getElementById('modal-close2');

  if (!modal) return;

  // Función para abrir modal desde tarjeta
  function openModalFromCard(card) {
    const img = card.querySelector('img');
    const data = {
      img: img ? img.src : '',
      alt: img ? img.alt : card.dataset.name || '',
      name: card.dataset.name || card.querySelector('h4')?.textContent || '',
      desc: card.dataset.desc || card.querySelector('.muted')?.textContent || '',
      price: card.dataset.price || card.querySelector('.price')?.textContent || ''
    };
    
    modalImg.src = data.img;
    modalImg.alt = data.alt;
    modalTitle.textContent = data.name;
    modalDesc.textContent = data.desc;
    modalPrice.textContent = data.price;
    
    // Mensaje de WhatsApp personalizado para RICHELLY SHOP
    const waMessage = `Hola RICHELLY SHOP, me interesa el caballo ${data.name} (${data.price}). ¿Podrían darme más información?`;
    modalWa.href = wa(waMessage);
    
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    
    // Enfocar el primer elemento interactivo del modal para accesibilidad
    setTimeout(() => {
      modalClose.focus();
    }, 100);
    
    // Agregar clase active para transición CSS
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }

  // Función para cerrar modal
  function closeModal() {
    modal.classList.remove('active');
    
    setTimeout(() => {
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      modalImg.src = '';
    }, 300); // Coincide con la duración de la transición CSS
  }

  // Event listeners para abrir/cerrar modal
  document.addEventListener('click', (e) => {
    const t = e.target;
    
    // Abrir modal al hacer clic en "Ver Detalles"
    if (t.matches('.view') || t.closest('.view')) {
      const viewBtn = t.matches('.view') ? t : t.closest('.view');
      const card = viewBtn.closest('.card');
      if (card) openModalFromCard(card);
    }
    
    // Cerrar modal
    if (t.matches('#modal-close') || t.matches('#modal-close2') || t.id === 'modal') {
      closeModal();
    }
  });

  // Cerrar modal con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
    
    // Navegación por teclado dentro del modal (mejora accesibilidad)
    if (e.key === 'Tab' && modal.getAttribute('aria-hidden') === 'false') {
      const focusableElements = modal.querySelectorAll('button, a, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
})();

// Animación de entrada del hero mejorada
(function heroIn() {
  const heroInner = document.querySelector('.hero-inner');
  if (!heroInner) return;
  
  heroInner.style.opacity = '0';
  heroInner.style.transform = 'translateY(20px)';
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      heroInner.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroInner.style.opacity = '1';
      heroInner.style.transform = 'translateY(0)';
    }, 200);
  });
})();

// Filtrado de productos (funcionalidad mejorada)
(function filterProducts() {
  const filterChips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.card');
  
  if (!filterChips.length || !cards.length) return;
  
  // Función para filtrar productos
  function filterProducts(category) {
    cards.forEach(card => {
      if (category === 'Todos') {
        card.style.display = 'flex';
      } else {
        // En una implementación real, aquí buscarías en los data attributes
        // Por ahora es solo visual, pero puedes expandir esta funcionalidad
        const cardCategory = card.dataset.category || 'Todos';
        card.style.display = cardCategory === category ? 'flex' : 'none';
      }
      
      // Trigger reflow para animación si es necesario
      void card.offsetWidth;
    });
  }
  
  // Event listeners para los filtros
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      // Remover clase active de todos los chips
      filterChips.forEach(c => c.classList.remove('active'));
      
      // Agregar clase active al chip clickeado
      this.classList.add('active');
      
      // Filtrar productos
      const category = this.textContent;
      filterProducts(category);
      
      // Animación para las tarjetas que se muestran
      setTimeout(() => {
        const visibleCards = document.querySelectorAll('.card[style="display: flex;"]');
        visibleCards.forEach((card, index) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100 * index);
        });
      }, 10);
    });
  });
})();

// Smooth scroll para enlaces internos
(function smoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();

// Efecto de parallax en el hero (opcional)
(function parallaxEffect() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    
    hero.style.transform = `translateY(${rate}px)`;
  });
})();

// Preload de imágenes críticas para mejor rendimiento
(function preloadCriticalImages() {
  const criticalImages = [
    'https://images.pexels.com/photos/288621/pexels-photo-288621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
})();

// Mejora de accesibilidad: agregar labels a los botones de filtro
(function improveAccessibility() {
  const filterChips = document.querySelectorAll('.chip');
  
  filterChips.forEach((chip, index) => {
    const filterText = chip.textContent;
    chip.setAttribute('aria-label', `Filtrar por ${filterText}`);
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    
    // Permitir activar con Enter o Space
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
  });
})();

console.log('RICHELLY SHOP - JavaScript cargado correctamente 🐎');

