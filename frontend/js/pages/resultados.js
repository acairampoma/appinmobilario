// Página de Resultados con Filtros Dinámicos - Match Property
class ResultadosPage {
  constructor() {
    this.propiedades = [];
    this.propiedadesFiltradas = [];
    this.filtrosSimplificados = null;
    this.filtrosAdicionales = {
      basico: {},
      avanzado: {}
    };
    this.caracteristicas = [];
    this.tiposInmuebles = [];
    this.distritos = [];
    this.usuarioLogueado = null;
    this.map = null;
    this.markers = [];
    this.favoritos = [];
    this.mostrandoResultados = false;

    this.init();
  }

  async init() {
    this.cargarUsuarioLogueado();
    this.cargarFavoritos();
    await this.cargarDatos();
    this.cargarFiltrosSimplificados();
    this.aplicarFiltrosIniciales();
    this.mostrarImagenReferencial();
    this.setupEventListeners();
    this.setupHamburgerMenu();
  }

  setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const headerActions = document.getElementById('headerActions');

    if (hamburger && headerActions) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        headerActions.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !headerActions.contains(e.target)) {
          hamburger.classList.remove('active');
          headerActions.classList.remove('active');
        }
      });
    }
  }

  cargarUsuarioLogueado() {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      this.usuarioLogueado = JSON.parse(usuarioStr);
      document.getElementById('usuarioInfo').textContent = `Usuario: ${this.usuarioLogueado.username}`;
    }
  }

  cargarFavoritos() {
    const favoritosStr = localStorage.getItem('favoritos');
    this.favoritos = favoritosStr ? JSON.parse(favoritosStr) : [];
  }

  guardarFavoritos() {
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
  }

  async cargarDatos() {
    try {
      const [propiedadesRes, caracteristicasRes, tiposRes, distritosRes] = await Promise.all([
        fetch('data/propiedades.json'),
        fetch('data/caracteristicas.json'),
        fetch('data/tipos-inmuebles.json'),
        fetch('data/distritos.json')
      ]);

      const propiedadesData = await propiedadesRes.json();
      const caracteristicasData = await caracteristicasRes.json();
      const tiposData = await tiposRes.json();
      const distritosData = await distritosRes.json();

      this.propiedades = propiedadesData.propiedades;
      this.caracteristicas = caracteristicasData.caracteristicas;
      this.tiposInmuebles = tiposData.tipos;
      this.distritos = distritosData.distritos;
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }

  cargarFiltrosSimplificados() {
    const filtrosStr = localStorage.getItem('filtros_simplificados');
    if (filtrosStr) {
      this.filtrosSimplificados = JSON.parse(filtrosStr);
    }
  }

  aplicarFiltrosIniciales() {
    if (!this.filtrosSimplificados) {
      this.propiedadesFiltradas = this.propiedades;
      return;
    }

    this.propiedadesFiltradas = this.propiedades.filter(prop => {
      // Filtro por distritos
      if (this.filtrosSimplificados.distritos.length > 0) {
        if (!this.filtrosSimplificados.distritos.includes(prop.distrito_id)) {
          return false;
        }
      }

      // Filtro por tipo de inmueble
      if (this.filtrosSimplificados.tipo_inmueble_id) {
        if (prop.tipo_inmueble_id !== this.filtrosSimplificados.tipo_inmueble_id) {
          return false;
        }
      }

      // Filtro por metraje (±15%)
      if (this.filtrosSimplificados.metraje) {
        const margen = this.filtrosSimplificados.metraje * 0.15;
        if (prop.area < (this.filtrosSimplificados.metraje - margen) || 
            prop.area > (this.filtrosSimplificados.metraje + margen)) {
          return false;
        }
      }

      // Filtro por presupuesto según transacción (±15%)
      if (this.filtrosSimplificados.presupuesto) {
        const margen = this.filtrosSimplificados.presupuesto * 0.15;
        
        if (this.filtrosSimplificados.transaccion === 'compra' && prop.precio_venta) {
          if (prop.precio_venta < (this.filtrosSimplificados.presupuesto - margen) ||
              prop.precio_venta > (this.filtrosSimplificados.presupuesto + margen)) {
            return false;
          }
        } else if (this.filtrosSimplificados.transaccion === 'alquiler' && prop.precio_alquiler) {
          if (prop.precio_alquiler < (this.filtrosSimplificados.presupuesto - margen) ||
              prop.precio_alquiler > (this.filtrosSimplificados.presupuesto + margen)) {
            return false;
          }
        }
      }

      return true;
    });
  }

  mostrarImagenReferencial() {
    const imagenRef = document.getElementById('imagenReferencial');
    const mainContainer = document.getElementById('mainContainer');
    const numResultados = this.propiedadesFiltradas.length;
    const numDistritos = this.filtrosSimplificados?.distritos.length || 0;

    // Actualizar contador
    document.getElementById('numResultados').textContent = numResultados;
    document.getElementById('numDistritos').textContent = numDistritos;
    document.getElementById('resultadosCount').textContent = 
      `${numResultados} ${numResultados === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`;

    // Establecer imagen de fondo según tipo de inmueble
    if (this.filtrosSimplificados?.tipo_inmueble_id) {
      const tipoInmueble = this.tiposInmuebles.find(t => t.id === this.filtrosSimplificados.tipo_inmueble_id);
      const imagenBg = document.querySelector('.imagen-referencial-bg');
      
      if (tipoInmueble) {
        const nombreLower = tipoInmueble.nombre.toLowerCase();
        let imagenUrl = '';

        if (nombreLower.includes('casa')) {
          imagenUrl = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80';
        } else if (nombreLower.includes('departamento')) {
          imagenUrl = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80';
        } else if (nombreLower.includes('terreno')) {
          imagenUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80';
        } else if (nombreLower.includes('oficina')) {
          imagenUrl = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80';
        } else if (nombreLower.includes('local')) {
          imagenUrl = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80';
        } else if (nombreLower.includes('cochera')) {
          imagenUrl = 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&q=80';
        }

        if (imagenUrl) {
          imagenBg.style.backgroundImage = `url('${imagenUrl}')`;
        }
      }
    }

    // Mostrar imagen referencial, ocultar resultados
    imagenRef.style.display = 'flex';
    mainContainer.style.display = 'none';
    this.mostrandoResultados = false;
  }

  mostrarResultados() {
    const imagenRef = document.getElementById('imagenReferencial');
    const mainContainer = document.getElementById('mainContainer');
    const panelFiltros = document.getElementById('panelFiltros');

    // Ocultar imagen y panel de filtros
    imagenRef.style.display = 'none';
    panelFiltros.style.display = 'none';

    // Mostrar resultados
    mainContainer.style.display = 'flex';
    this.mostrandoResultados = true;

    // Renderizar resultados y mapa
    this.renderResultados();
    this.renderMapa();
  }

  setupEventListeners() {
    // Botón Filtro Básico
    document.getElementById('btnFiltroBasico')?.addEventListener('click', () => {
      this.mostrarFiltroBasico();
    });

    // Botón Filtro Avanzado
    document.getElementById('btnFiltroAvanzado')?.addEventListener('click', () => {
      this.mostrarFiltroAvanzado();
    });

    // Botón Favoritos
    document.getElementById('btnFavoritos')?.addEventListener('click', () => {
      this.mostrarFavoritos();
    });

    // Botón Cerrar Filtros
    document.getElementById('btnCerrarFiltros')?.addEventListener('click', () => {
      document.getElementById('panelFiltros').style.display = 'none';
    });

    // Botón Aplicar Filtros
    document.getElementById('btnAplicarFiltros')?.addEventListener('click', () => {
      this.aplicarFiltrosCompletos();
    });

    // Botón Limpiar Filtros
    document.getElementById('btnLimpiarFiltros')?.addEventListener('click', () => {
      this.limpiarFiltrosAdicionales();
    });

    // Modal Login
    const modal = document.getElementById('loginModal');
    const closeBtn = modal?.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  mostrarFiltroBasico() {
    const panel = document.getElementById('panelFiltros');
    const titulo = document.getElementById('tituloFiltro');
    const contenido = document.getElementById('contenidoFiltros');

    titulo.textContent = '📋 Filtro Básico';
    contenido.innerHTML = this.generarHTMLFiltroBasico();
    panel.style.display = 'block';

    // Cargar valores previos si existen
    this.cargarValoresFiltroBasico();
  }

  generarHTMLFiltroBasico() {
    return `
      <div class="filtro-section">
        <div class="form-group">
          <label>Transacción</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="transaccion_basico" value="compra" ${this.filtrosAdicionales.basico.transaccion === 'compra' ? 'checked' : ''}>
              <span>Compra</span>
            </label>
            <label class="radio-label">
              <input type="radio" name="transaccion_basico" value="alquiler" ${this.filtrosAdicionales.basico.transaccion === 'alquiler' ? 'checked' : ''}>
              <span>Alquiler</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="area_basico">Área Requerida (m²)</label>
          <input type="number" id="area_basico" class="form-control" placeholder="460" value="${this.filtrosAdicionales.basico.area || ''}">
          <small>💡 El sistema busca ±15%</small>
        </div>

        <div class="form-group">
          <label for="parqueos_basico">Parqueos Requeridos</label>
          <input type="number" id="parqueos_basico" class="form-control" placeholder="8" value="${this.filtrosAdicionales.basico.parqueos || ''}">
          <small>💡 El sistema contempla ±20%</small>
        </div>

        <div class="form-group">
          <label for="presupuesto_compra_basico">Presupuesto Compra (USD)</label>
          <input type="number" id="presupuesto_compra_basico" class="form-control" placeholder="750,000" value="${this.filtrosAdicionales.basico.presupuesto_compra || ''}">
          <small>(Sin IGV) 💡 Tolerancia ±15%</small>
        </div>

        <div class="form-group">
          <label for="presupuesto_alquiler_basico">Presupuesto Alquiler (USD/mes)</label>
          <input type="number" id="presupuesto_alquiler_basico" class="form-control" placeholder="8,500" value="${this.filtrosAdicionales.basico.presupuesto_alquiler || ''}">
          <small>💡 Tolerancia ±15%</small>
        </div>

        <div class="form-group">
          <label for="antiguedad_basico">Antigüedad (No mayor a años)</label>
          <input type="number" id="antiguedad_basico" class="form-control" placeholder="15" value="${this.filtrosAdicionales.basico.antiguedad || ''}">
        </div>

        <div class="form-group">
          <label for="implementacion_basico">Nivel de Implementación</label>
          <select id="implementacion_basico" class="form-control">
            <option value="">Cualquiera</option>
            <option value="Amoblado FULL" ${this.filtrosAdicionales.basico.implementacion === 'Amoblado FULL' ? 'selected' : ''}>Amoblado FULL</option>
            <option value="Implementada" ${this.filtrosAdicionales.basico.implementacion === 'Implementada' ? 'selected' : ''}>Implementada</option>
            <option value="Semi Implementada" ${this.filtrosAdicionales.basico.implementacion === 'Semi Implementada' ? 'selected' : ''}>Semi Implementada</option>
            <option value="Por Implementar" ${this.filtrosAdicionales.basico.implementacion === 'Por Implementar' ? 'selected' : ''}>Por Implementar</option>
          </select>
        </div>
      </div>
    `;
  }

  cargarValoresFiltroBasico() {
    // Los valores ya están cargados en el HTML, solo necesitamos event listeners
    const radios = document.querySelectorAll('input[name="transaccion_basico"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.filtrosAdicionales.basico.transaccion = e.target.value;
      });
    });
  }

  mostrarFiltroAvanzado() {
    const panel = document.getElementById('panelFiltros');
    const titulo = document.getElementById('tituloFiltro');
    const contenido = document.getElementById('contenidoFiltros');

    titulo.textContent = '⚙️ Filtro Avanzado';
    
    if (!this.filtrosSimplificados?.tipo_inmueble_id) {
      contenido.innerHTML = '<p class="mensaje-info">⚠️ Debes seleccionar un tipo de inmueble primero</p>';
    } else {
      contenido.innerHTML = this.generarHTMLFiltroAvanzado();
    }
    
    panel.style.display = 'block';
  }

  generarHTMLFiltroAvanzado() {
    // Filtrar características por tipo de inmueble
    const caracsDelTipo = this.caracteristicas.filter(
      c => c.tipo_inmueble_id === this.filtrosSimplificados.tipo_inmueble_id
    );

    // Agrupar por categoría
    const categorias = {};
    caracsDelTipo.forEach(carac => {
      if (!categorias[carac.categoria]) {
        categorias[carac.categoria] = [];
      }
      categorias[carac.categoria].push(carac);
    });

    // Renderizar por categoría
    return Object.entries(categorias).map(([categoria, items]) => `
      <div class="categoria-section">
        <h3>${this.formatCategoria(categoria)}</h3>
        <div class="categoria-items">
          ${items.map(item => this.renderCaracteristicaInput(item)).join('')}
        </div>
      </div>
    `).join('');
  }

  formatCategoria(categoria) {
    const nombres = {
      'COMPLEMENTARIOS': '📦 Complementarios',
      'AREAS_COMUNES_EDIFICIO': '🏢 Áreas Comunes del Edificio',
      'ASCENSORES': '🛗 Ascensores',
      'IMPLEMENTACION_DETALLE': '🔧 Implementación / Detalle',
      'SOPORTE_EDIFICIO': '⚡ Soporte del Edificio',
      'CERCANIA_ESTRATEGICA': '📍 Cercanía Estratégica',
      'VISTA_OFICINA': '🏙️ Vista de la Oficina'
    };
    return nombres[categoria] || categoria;
  }

  renderCaracteristicaInput(carac) {
    if (carac.tipo_input === 'checkbox') {
      return `
        <div class="checkbox-item">
          <input type="checkbox" id="carac_${carac.id}" value="${carac.id}" name="caracteristicas_avanzado">
          <label for="carac_${carac.id}">${carac.nombre}</label>
        </div>
      `;
    } else if (carac.tipo_input === 'number') {
      return `
        <div class="form-group-inline">
          <label for="carac_${carac.id}">${carac.nombre}</label>
          <input type="number" id="carac_${carac.id}" class="form-control-sm" placeholder="0" data-carac-id="${carac.id}">
          ${carac.unidad ? `<small>${carac.unidad}</small>` : ''}
        </div>
      `;
    }
    return '';
  }

  aplicarFiltrosCompletos() {
    // Capturar valores del filtro básico
    this.filtrosAdicionales.basico = {
      transaccion: document.querySelector('input[name="transaccion_basico"]:checked')?.value,
      area: document.getElementById('area_basico')?.value,
      parqueos: document.getElementById('parqueos_basico')?.value,
      presupuesto_compra: document.getElementById('presupuesto_compra_basico')?.value,
      presupuesto_alquiler: document.getElementById('presupuesto_alquiler_basico')?.value,
      antiguedad: document.getElementById('antiguedad_basico')?.value,
      implementacion: document.getElementById('implementacion_basico')?.value
    };

    // Capturar valores del filtro avanzado
    const checkboxes = document.querySelectorAll('input[name="caracteristicas_avanzado"]:checked');
    this.filtrosAdicionales.avanzado.caracteristicas = Array.from(checkboxes).map(cb => parseInt(cb.value));

    // Aplicar filtros
    this.aplicarFiltrosIniciales();
    this.aplicarFiltrosBasicos();

    // Mostrar resultados
    this.mostrarResultados();
  }

  aplicarFiltrosBasicos() {
    if (!this.filtrosAdicionales.basico.area && 
        !this.filtrosAdicionales.basico.parqueos && 
        !this.filtrosAdicionales.basico.antiguedad) {
      return; // No hay filtros adicionales
    }

    this.propiedadesFiltradas = this.propiedadesFiltradas.filter(prop => {
      // Filtro por área (±15%)
      if (this.filtrosAdicionales.basico.area) {
        const area = parseInt(this.filtrosAdicionales.basico.area);
        const margen = area * 0.15;
        if (prop.area < (area - margen) || prop.area > (area + margen)) {
          return false;
        }
      }

      // Filtro por parqueos (±20%)
      if (this.filtrosAdicionales.basico.parqueos) {
        const parqueos = parseInt(this.filtrosAdicionales.basico.parqueos);
        const margen = Math.ceil(parqueos * 0.2);
        if (prop.parqueos < (parqueos - margen) || prop.parqueos > (parqueos + margen)) {
          return false;
        }
      }

      // Filtro por antigüedad
      if (this.filtrosAdicionales.basico.antiguedad) {
        const antiguedad = parseInt(this.filtrosAdicionales.basico.antiguedad);
        if (prop.antiguedad > antiguedad) {
          return false;
        }
      }

      // Filtro por implementación
      if (this.filtrosAdicionales.basico.implementacion) {
        if (prop.implementacion !== this.filtrosAdicionales.basico.implementacion) {
          return false;
        }
      }

      return true;
    });
  }

  limpiarFiltrosAdicionales() {
    this.filtrosAdicionales = {
      basico: {},
      avanzado: {}
    };
    
    // Recargar el panel actual
    const titulo = document.getElementById('tituloFiltro').textContent;
    if (titulo.includes('Básico')) {
      this.mostrarFiltroBasico();
    } else {
      this.mostrarFiltroAvanzado();
    }
  }

  mostrarFavoritos() {
    if (!this.usuarioLogueado) {
      document.getElementById('loginModal').style.display = 'flex';
      return;
    }

    alert('Función de favoritos en desarrollo');
    // TODO: Implementar vista de favoritos
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
    this.setupCardListeners();
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

  setupCardListeners() {
    // Hover sobre cards
    document.querySelectorAll('.property-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const propId = e.currentTarget.dataset.propertyId;
        this.activarPropiedad(propId);
      });

      card.addEventListener('mouseleave', () => {
        this.desactivarTodo();
      });
    });

    // Carruseles
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
  }

  renderMapa() {
    if (!this.map) {
      this.map = L.map('map').setView([-12.0464, -77.0428], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);
    }

    // Limpiar marcadores
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Crear marcadores
    this.propiedadesFiltradas.forEach((prop, index) => {
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-number" data-marker-id="${prop.id}">${index + 1}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`
          <div class="marker-popup">
            <strong>${prop.titulo}</strong><br>
            <small>📍 ${prop.direccion}</small><br>
            <strong class="popup-price">USD ${prop.precio_venta?.toLocaleString() || prop.precio_alquiler?.toLocaleString()}</strong>
          </div>
        `);

      marker.on('click', () => {
        this.activarPropiedad(prop.id);
        this.scrollToCard(prop.id);
      });

      marker.on('mouseover', () => this.activarPropiedad(prop.id));
      marker.on('mouseout', () => this.desactivarTodo());

      marker.propertyId = prop.id;
      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  activarPropiedad(propId) {
    this.desactivarTodo();
    const card = document.querySelector(`.property-card[data-property-id="${propId}"]`);
    card?.classList.add('highlighted');
    const markerDiv = document.querySelector(`.marker-number[data-marker-id="${propId}"]`);
    markerDiv?.classList.add('highlighted');
  }

  desactivarTodo() {
    document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
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

    currentIndex = (currentIndex + direccion + totalImagenes) % totalImagenes;

    imagenes.forEach((img, i) => img.classList.toggle('active', i === currentIndex));
    indicadores.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));

    carousel.dataset.current = currentIndex;
  }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
  new ResultadosPage();
});
