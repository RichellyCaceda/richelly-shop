document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES GLOBALES ---
    const WA_NUMBER = '51965115456';
    const modal = document.getElementById('modal');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    const favBtn = document.getElementById('fav-btn');
    const favCount = document.getElementById('fav-count');

    // --- 1. PRELOADER ---
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => document.getElementById('preloader').remove(), 500);
    }, 1000); // Simula carga para efecto premium

    // --- 2. SISTEMA DE FAVORITOS (LOCALSTORAGE) ---
    let favorites = JSON.parse(localStorage.getItem('richelly_favs')) || [];

    function updateFavUI() {
        favCount.textContent = favorites.length;
        document.querySelectorAll('.card').forEach(card => {
            const id = card.dataset.id;
            const btn = card.querySelector('.like-btn');
            if (favorites.includes(id)) {
                btn.classList.add('liked');
                btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                btn.classList.remove('liked');
                btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
        });
    }
    
    // Evento Like
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita abrir el modal
            const card = btn.closest('.card');
            const id = card.dataset.id;
            
            if (favorites.includes(id)) {
                favorites = favorites.filter(fav => fav !== id);
                showToast('Eliminado de favoritos');
            } else {
                favorites.push(id);
                showToast('Agregado a favoritos', 'success');
            }
            
            localStorage.setItem('richelly_favs', JSON.stringify(favorites));
            updateFavUI();
        });
    });

    // --- 3. LÓGICA DE MODAL CON ZOOM ---
    const zoomContainer = document.getElementById('zoom-container');
    const modalImg = document.getElementById('modal-img');

    // Abrir Modal
    document.querySelectorAll('.card, .btn-quick-view').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            if(e.target.closest('.like-btn')) return; // Ignorar si click en like

            const card = this.closest('.card') || this;
            const data = card.dataset;
            const img = card.querySelector('img').src;

            // Inyectar datos
            document.getElementById('modal-img').src = img;
            document.getElementById('modal-cat').textContent = data.category;
            document.getElementById('modal-title').textContent = data.name;
            document.getElementById('modal-price').textContent = data.price;
            document.getElementById('modal-desc').textContent = data.desc;
            
            const msg = `Hola RICHELLY SHOP. Estoy interesado en el ${data.name} (${data.price}). ¿Sigue disponible?`;
            document.getElementById('modal-wa').href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Cerrar Modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Efecto Zoom Lente
    zoomContainer.addEventListener('mousemove', (e) => {
        const { width, height } = zoomContainer.getBoundingClientRect();
        const x = e.offsetX / width;
        const y = e.offsetY / height;
        
        modalImg.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        modalImg.style.transform = 'scale(2)'; // Nivel de Zoom
    });

    zoomContainer.addEventListener('mouseleave', () => {
        modalImg.style.transform = 'scale(1)';
    });

    // --- 4. BUSCADOR Y FILTROS EN TIEMPO REAL ---
    function filterProducts() {
        const term = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        cards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const category = card.dataset.category;
            const matchesSearch = name.includes(term);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 50);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }

    searchInput.addEventListener('input', filterProducts);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
    });

    // --- 5. TOAST NOTIFICATIONS ---
    function showToast(message, type = 'normal') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check' : 'info'}-circle"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Inicializar UI
    updateFavUI();
    console.log('RICHELLY SYSTEM: 100% Loaded 🚀');
});
