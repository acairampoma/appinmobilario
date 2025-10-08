// Página de Resultados con Mapa Enumerado - Match Property
class ResultadosPage {
  constructor() {
    this.propiedades = [];
    this.propiedadesFiltradas = [];
    this.filtros = null;
    this.usuarioLogueado = null;
    this.map = null;
    this.markers = [];

    this.init();
  }

  async init() {
    this.cargarUsuarioLogueado();
    await this.cargarPropiedades();
    this.cargarFiltros();
    this.aplicarFiltros();
    this.renderResultados();
    this.renderMapa();
    this.setupEventListeners();
  }

  cargarUsuarioLogueado() {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      this.usuarioLogueado = JSON.parse(usuarioStr);
      document.getElementById('usuarioInfo').textContent = `Usuario: ${this.usuarioLogueado.username}`;
    }
  }

  async cargarPropiedades() {
    try {
      const response = await fetch('data/propiedades.json');
      const data = await response.json();
      this.propiedades = data.propiedades;
    } catch (error) {
      console.error('Error cargando propiedades:', error);
    }
  }

  cargarFiltros() {
    const filtrosStr = localStorage.getItem('filtros_busqueda');
    if (filtrosStr) {
      this.filtros = JSON.parse(filtrosStr);
    }
  }

  aplicarFiltros() {
    if (!this.filtros) {
      this.propiedadesFiltradas = this.propiedades;
      return;
    }

    this.propiedadesFiltradas = this.propiedades.filter(prop => {
      // Filtro por distritos
      if (this.filtros.distritos.length > 0) {
        if (!this.filtros.distritos.includes(prop.distrito_id)) {
          return false;
        }
      }

      // Filtro por tipo de inmueble
      if (this.filtros.tipo_inmueble_id) {
        if (prop.tipo_inmueble_id !== this.filtros.tipo_inmueble_id) {
          return false;
        }
      }

      // Filtro por área (±15%)
      if (this.filtros.area) {
        const margen = this.filtros.area * 0.15;
        if (prop.area < (this.filtros.area - margen) || prop.area > (this.filtros.area + margen)) {
          return false;
        }
      }

      // Filtro por parqueos (±20%)
      if (this.filtros.parqueos) {
        const margen = Math.ceil(this.filtros.parqueos * 0.2);
        if (prop.parqueos < (this.filtros.parqueos - margen) || prop.parqueos > (this.filtros.parqueos + margen)) {
          return false;
        }
      }

      // Filtro por antigüedad
      if (this.filtros.antiguedad) {
        if (prop.antiguedad > this.filtros.antiguedad) {
          return false;
        }
      }

      // Filtro por presupuesto compra (±15%)
      if (this.filtros.presupuesto_compra && prop.precio_venta) {
        const margen = this.filtros.presupuesto_compra * 0.15;
        if (prop.precio_venta < (this.filtros.presupuesto_compra - margen) ||
            prop.precio_venta > (this.filtros.presupuesto_compra + margen)) {
          return false;
        }
      }

      // Filtro por presupuesto alquiler (±15%)
      if (this.filtros.presupuesto_alquiler && prop.precio_alquiler) {
        const margen = this.filtros.presupuesto_alquiler * 0.15;
        if (prop.precio_alquiler < (this.filtros.presupuesto_alquiler - margen) ||
            prop.precio_alquiler > (this.filtros.presupuesto_alquiler + margen)) {
          return false;
        }
      }

      // Filtro por implementación
      if (this.filtros.implementacion) {
        if (prop.implementacion !== this.filtros.implementacion) {
          return false;
        }
      }

      return true;
    });

    // Actualizar contador
    document.getElementById('resultadosCount').textContent =
      `🏢 ${this.propiedadesFiltradas.length} ${this.propiedadesFiltradas.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`;

    // Renderizar filtros aplicados
    this.renderFiltrosAplicados();
  }

  renderFiltrosAplicados() {
    const container = document.getElementById('filtrosAplicados');
    if (!container || !this.filtros) return;

    const tags = [];

    // Distritos
    if (this.filtros.distritos.length > 0) {
      tags.push(`📍 ${this.filtros.distritos.length} distrito(s)`);
    }

    // Área
    if (this.filtros.area) {
      tags.push(`📐 ${this.filtros.area}m² (±15%)`);
    }

    // Parqueos
    if (this.filtros.parqueos) {
      tags.push(`🚗 ${this.filtros.parqueos} parqueos (±20%)`);
    }

    // Antigüedad
    if (this.filtros.antiguedad) {
      tags.push(`⏱️ <${this.filtros.antiguedad} años`);
    }

    // Implementación
    if (this.filtros.implementacion) {
      tags.push(`🔧 ${this.filtros.implementacion}`);
    }

    const html = tags.map(tag => `<span class="filtro-tag">${tag}</span>`).join('');
    container.innerHTML = html;
  }

  renderResultados() {
    const container = document.getElementById('propertiesList');
    if (!container) return;

    if (this.propiedadesFiltradas.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h2>No se encontraron propiedades</h2>
          <p>Intenta ajustar tus filtros de búsqueda</p>
          <a href="busqueda.html" class="btn btn-primary">Volver a Buscar</a>
        </div>
      `;
      return;
    }

    const html = this.propiedadesFiltradas.map((prop, index) => `
      <div class="property-card" data-property-id="${prop.id}">
        <div class="property-number">${index + 1}</div>
        <div class="property-image-carousel">
          <div class="carousel-images" data-current="0">
            ${prop.imagenes.map((img, i) => `
              <img src="${img}" alt="${prop.titulo} - imagen ${i+1}" class="carousel-image ${i === 0 ? 'active' : ''}" data-index="${i}">
            `).join('')}
          </div>
          ${prop.imagenes.length > 1 ? `
            <button class="carousel-prev" data-property-id="${prop.id}">‹</button>
            <button class="carousel-next" data-property-id="${prop.id}">›</button>
            <div class="carousel-indicators">
              ${prop.imagenes.map((_, i) => `
                <span class="indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div class="property-info">
          <h3 class="property-title">${prop.titulo}</h3>
          <div class="property-location">📍 ${prop.direccion}</div>
          <div class="property-price">${this.renderPrecio(prop)}</div>
          <div class="property-features">
            <span class="feature">📐 ${prop.area} m²</span>
            <span class="feature">🚗 ${prop.parqueos} parqueos</span>
            <span class="feature">⏱️ ${prop.antiguedad} años</span>
            <span class="feature">🔧 ${prop.implementacion}</span>
          </div>
          <p class="property-description">${prop.descripcion}</p>
          ${!this.usuarioLogueado ? `
            <div class="contact-locked">
              🔒 <a href="#" class="login-link" data-property-id="${prop.id}">Inicia sesión para ver contacto</a>
            </div>
          ` : `
            <div class="contact-info">
              <div class="contact-item">📱 +51 999457538</div>
              <div class="contact-item">📧 info@match.pe</div>
            </div>
          `}
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  renderPrecio(prop) {
    let html = '';
    if (prop.precio_venta) {
      html += `<span class="price-tag">💰 Venta: USD ${prop.precio_venta.toLocaleString()}</span>`;
    }
    if (prop.precio_alquiler) {
      if (html) html += ' ';
      html += `<span class="price-tag">💰 Alquiler: USD ${prop.precio_alquiler.toLocaleString()}/mes</span>`;
    }
    return html;
  }

  renderMapa() {
    // Inicializar mapa centrado en Lima
    if (!this.map) {
      this.map = L.map('map').setView([-12.0464, -77.0428], 13);

      // Agregar tiles de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);
    }

    // Limpiar marcadores anteriores
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Crear marcadores numerados
    this.propiedadesFiltradas.forEach((prop, index) => {
      // Crear icono numerado personalizado
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-number" data-marker-id="${prop.id}">${index + 1}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      // Crear marcador
      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`
          <div class="marker-popup">
            <strong>${prop.titulo}</strong><br>
            <small>📍 ${prop.direccion}</small><br>
            <strong class="popup-price">USD ${prop.precio_venta?.toLocaleString() || prop.precio_alquiler?.toLocaleString()}</strong>
          </div>
        `);

      // Eventos del marcador
      marker.on('click', () => {
        this.activarPropiedad(prop.id);
        this.scrollToCard(prop.id);
      });

      marker.on('mouseover', () => {
        this.activarPropiedad(prop.id);
      });

      marker.on('mouseout', () => {
        this.desactivarTodo();
      });

      // Guardar referencia del marcador con su ID
      marker.propertyId = prop.id;
      this.markers.push(marker);
    });

    // Ajustar vista para mostrar todos los marcadores
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  setupEventListeners() {
    // Hover sobre cards -> resaltar pin
    document.querySelectorAll('.property-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const propId = e.currentTarget.dataset.propertyId;
        this.activarPropiedad(propId);
      });

      card.addEventListener('mouseleave', () => {
        this.desactivarTodo();
      });
    });

    // Carruseles de imágenes
    document.querySelectorAll('.carousel-prev').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const propId = e.currentTarget.dataset.propertyId;
        this.cambiarImagen(propId, -1);
      });
    });

    document.querySelectorAll('.carousel-next').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const propId = e.currentTarget.dataset.propertyId;
        this.cambiarImagen(propId, 1);
      });
    });

    // Links de login
    document.querySelectorAll('.login-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('loginModal').style.display = 'flex';
      });
    });

    // Cerrar modal
    const modal = document.getElementById('loginModal');
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  activarPropiedad(propId) {
    this.desactivarTodo();

    // Activar card
    const card = document.querySelector(`.property-card[data-property-id="${propId}"]`);
    card?.classList.add('highlighted');

    // Activar marcador
    const markerDiv = document.querySelector(`.marker-number[data-marker-id="${propId}"]`);
    markerDiv?.classList.add('highlighted');
  }

  desactivarTodo() {
    document.querySelectorAll('.highlighted').forEach(el => {
      el.classList.remove('highlighted');
    });
  }

  scrollToCard(propId) {
    const card = document.querySelector(`.property-card[data-property-id="${propId}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  cambiarImagen(propId, direccion) {
    const card = document.querySelector(`.property-card[data-property-id="${propId}"]`);
    const carousel = card.querySelector('.carousel-images');
    const imagenes = carousel.querySelectorAll('.carousel-image');
    const indicadores = card.querySelectorAll('.indicator');

    let currentIndex = parseInt(carousel.dataset.current);
    const totalImagenes = imagenes.length;

    // Calcular nuevo índice
    currentIndex = (currentIndex + direccion + totalImagenes) % totalImagenes;

    // Actualizar imágenes
    imagenes.forEach((img, i) => {
      img.classList.toggle('active', i === currentIndex);
    });

    // Actualizar indicadores
    indicadores.forEach((ind, i) => {
      ind.classList.toggle('active', i === currentIndex);
    });

    // Guardar índice actual
    carousel.dataset.current = currentIndex;
  }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
  new ResultadosPage();
});
