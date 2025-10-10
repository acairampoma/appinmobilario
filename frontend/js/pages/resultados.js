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
    this.debouncedPreview = null;

    this.init();
  }

  renderResumenGenericosMobile() {
    const box = document.getElementById('resumenGenericosMobile');
    if (!box) return;
    const fs = this.filtrosSimplificados || {};

    // Distritos
    const distritos = Array.isArray(fs.distritos_ids) && fs.distritos_ids.length > 0
      ? fs.distritos_ids.map(id => this.distritos.find(d => d.id === id)?.nombre).filter(Boolean).join(', ')
      : (fs.distrito_id ? (this.distritos.find(d => d.id === fs.distrito_id)?.nombre || '') : '—');

    // Tipo de inmueble
    const tipoInmueble = fs.tipo_inmueble_id
      ? (this.tiposInmuebles.find(t => t.id === fs.tipo_inmueble_id)?.nombre || '—')
      : '—';

    // Área/metraje
    const metragem = fs.area ? `${fs.area} m²` : '—';

    // Condición (compra/alquiler)
    const condicion = fs.transaccion ? (fs.transaccion === 'compra' ? 'Compra' : 'Alquiler') : '—';

    // Presupuesto (dependiendo de transacción)
    let presupuesto = '—';
    if (fs.transaccion === 'compra' && fs.presupuesto_compra) {
      presupuesto = `${Number(fs.presupuesto_compra).toLocaleString()} USD`;
    } else if (fs.transaccion === 'alquiler' && fs.presupuesto_alquiler) {
      presupuesto = `${Number(fs.presupuesto_alquiler).toLocaleString()} USD/mes`;
    }

    box.innerHTML = `
      <div class="item"><span>Distrito(s)</span><strong>${distritos || '—'}</strong></div>
      <div class="item"><span>Tipo Inmueble</span><strong>${tipoInmueble}</strong></div>
      <div class="item"><span>Área</span><strong>${metragem}</strong></div>
      <div class="item"><span>Transacción</span><strong>${condicion}</strong></div>
      <div class="item"><span>Presupuesto</span><strong>${presupuesto}</strong></div>
    `;
  }

  setupMobileFilters() {
    const btnOpen = document.getElementById('btnToggleMobileFilters');
    const drawer = document.getElementById('mobileFiltersDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const btnClose = document.getElementById('btnCloseMobileFilters');
    const btnAplicar = document.getElementById('btnAplicarFiltrosMobile');
    const btnLimpiar = document.getElementById('btnLimpiarFiltrosMobile');

    const open = () => { 
      if (drawer) { 
        drawer.classList.add('open'); 
        drawer.setAttribute('aria-hidden','false'); 
      }
      if (backdrop) {
        backdrop.classList.add('active');
      }
    };
    
    const close = () => { 
      if (drawer) { 
        drawer.classList.remove('open'); 
        drawer.setAttribute('aria-hidden','true'); 
      }
      if (backdrop) {
        backdrop.classList.remove('active');
      }
    };

    btnOpen?.addEventListener('click', () => {
      // Pintar contenido al abrir
      this.renderResumenGenericosMobile();
      const contBasMob = document.getElementById('contenedorBasicoMobile');
      const contAvzMob = document.getElementById('contenedorAvanzadoMobile');
      if (contBasMob) contBasMob.innerHTML = this.generarHTMLFiltroBasico();
      if (contAvzMob) contAvzMob.innerHTML = this.generarHTMLFiltroAvanzado();
      this.attachBasicoInlineListeners();
      this.attachAvanzadoInlineListeners();
      // Abrir
      open();
      // Abrir acordeón genéricos por defecto en móvil (ya configurado en HTML)
      // Los filtros genéricos ya están abiertos por defecto en el HTML
      // Listeners acordeón móvil (reutiliza setupAccordion visual)
      this.setupAccordion();
    });
    btnClose?.addEventListener('click', close);
    backdrop?.addEventListener('click', close); // Cerrar al hacer click en el backdrop

    btnAplicar?.addEventListener('click', () => {
      this.aplicarFiltrosCompletos();
      close();
    });
    btnLimpiar?.addEventListener('click', () => {
      this.limpiarFiltrosAdicionales();
      // Re-pintar vacíos
      const contBasMob = document.getElementById('contenedorBasicoMobile');
      const contAvzMob = document.getElementById('contenedorAvanzadoMobile');
      if (contBasMob) contBasMob.innerHTML = this.generarHTMLFiltroBasico();
      if (contAvzMob) contAvzMob.innerHTML = this.generarHTMLFiltroAvanzado();
      this.attachBasicoInlineListeners();
      this.attachAvanzadoInlineListeners();
      this.renderChipsActivos();
    });
  }

  async init() {
    // 1. Cargar datos del backend PRIMERO
    await this.cargarDatos();

    // 2. Cargar configuración del usuario
    this.cargarUsuarioLogueado();
    this.cargarFavoritos();
    this.cargarFiltrosSimplificados();

    // 3. Aplicar filtros
    this.aplicarFiltrosIniciales();
    this.mostrarImagenReferencial();

    // 4. Configurar eventos
    this.setupEventListeners();
    this.setupHamburgerMenu();
    this.setupPresupuesto();

    // 5. Mostrar layout de 3 columnas
    this.mostrarLayoutTresColumnas();

    // 6. Configurar drawer móvil
    this.setupMobileFilters();

    // 7. En móvil, forzar mostrar mapa y resultados
    if (window.innerWidth <= 1024) {
      console.log('🔧 Modo móvil detectado, configurando vista...');
      
      // Ocultar imagenReferencial y mostrar mainContainer
      const imagenRef = document.getElementById('imagenReferencial');
      const mainContainer = document.getElementById('mainContainer');
      const mapPlaceholder = document.getElementById('mapPlaceholder');
      const mapCanvas = document.getElementById('map');
      const propertiesList = document.getElementById('propertiesList');
      const placeholderResultados = document.getElementById('placeholderResultados');
      
      if (imagenRef) imagenRef.style.display = 'none';
      if (mainContainer) mainContainer.style.display = 'grid';
      
      // Ocultar placeholders y mostrar contenido real
      if (mapPlaceholder) mapPlaceholder.style.display = 'none';
      if (placeholderResultados) placeholderResultados.style.display = 'none';
      if (mapCanvas) mapCanvas.style.display = 'block';
      if (propertiesList) propertiesList.style.display = 'flex';
      
      console.log('📍 Renderizando resultados y mapa...');
      
      // Renderizar contenido
      this.renderResultados();
      
      // Esperar un momento antes de inicializar el mapa
      setTimeout(() => {
        this.renderMapa();
        
        // Forzar invalidateSize del mapa después de inicializar
        setTimeout(() => {
          if (this.map) {
            console.log('🗺️ Ajustando tamaño del mapa...');
            this.map.invalidateSize();
          }
        }, 200);
      }, 100);
    }
  }

  // Utilidad debounce
  debounce(fn, delay = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
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

  guardarFiltrosAdicionales() {
    localStorage.setItem('filtros_adicionales', JSON.stringify(this.filtrosAdicionales));
  }

  async cargarDatos() {
    try {
      console.log('📡 Cargando datos del backend...');
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

      console.log('✅ Datos cargados:');
      console.log('   - Propiedades:', this.propiedades.length);
      console.log('   - Características:', this.caracteristicas.length);
      console.log('   - Tipos Inmuebles:', this.tiposInmuebles.length);
      console.log('   - Distritos:', this.distritos.length);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    }
  }

  cargarFiltrosSimplificados() {
    const filtrosStr = localStorage.getItem('filtros_simplificados');
    if (filtrosStr) {
      this.filtrosSimplificados = JSON.parse(filtrosStr);
      console.log('✅ Filtros cargados desde localStorage:', this.filtrosSimplificados);
    } else {
      console.warn('⚠️ No se encontraron filtros en localStorage');
    }

    // Cargar filtros adicionales (básico y avanzado) si existen
    const filtrosAdicionalesStr = localStorage.getItem('filtros_adicionales');
    if (filtrosAdicionalesStr) {
      try {
        const filtrosGuardados = JSON.parse(filtrosAdicionalesStr);
        this.filtrosAdicionales = {
          basico: filtrosGuardados.basico || {},
          avanzado: filtrosGuardados.avanzado || {}
        };
        console.log('✅ Filtros adicionales cargados:', this.filtrosAdicionales);
      } catch (e) {
        console.log('⚠️ Error cargando filtros adicionales');
      }
    }
  }

  aplicarFiltrosIniciales() {
    if (!this.filtrosSimplificados) {
      this.propiedadesFiltradas = this.propiedades;
      return;
    }

    this.propiedadesFiltradas = this.propiedades.filter(prop => {
      // Filtro por distritos múltiples
      if (Array.isArray(this.filtrosSimplificados.distritos_ids) && this.filtrosSimplificados.distritos_ids.length > 0) {
        if (!this.filtrosSimplificados.distritos_ids.includes(prop.distrito_id)) {
          return false;
        }
      } else if (this.filtrosSimplificados.distrito_id) {
        // Compatibilidad hacia atrás por si viene un solo distrito_id
        if (prop.distrito_id !== this.filtrosSimplificados.distrito_id) {
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

    // Obtener nombres de distritos seleccionados
    let nombreDistrito = '';
    if (Array.isArray(this.filtrosSimplificados?.distritos_ids) && this.filtrosSimplificados.distritos_ids.length > 0) {
      const nombres = this.filtrosSimplificados.distritos_ids
        .map(id => this.distritos.find(d => d.id === id)?.nombre)
        .filter(Boolean);
      nombreDistrito = nombres.join(', ');
    } else if (this.filtrosSimplificados?.distrito_id) {
      const distrito = this.distritos.find(d => d.id === this.filtrosSimplificados.distrito_id);
      nombreDistrito = distrito ? distrito.nombre : '';
    }

    // Actualizar contador
    document.getElementById('numResultados').textContent = numResultados;
    document.getElementById('numDistritos').textContent = nombreDistrito;
    document.getElementById('resultadosCount').textContent =
      numResultados === 0 ? 'Resultados de Búsqueda' : `${numResultados} ${numResultados === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`;

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

  // ======== FILTROS INLINE (EN IMAGEN REFERENCIAL) ========
  mostrarFiltroBasicoInline() {
    const container = document.getElementById('filtrosInline');
    if (!container) return;
    // Botones activos
    document.getElementById('toggleFiltroBasico')?.classList.add('active');
    document.getElementById('toggleFiltroAvanzado')?.classList.remove('active');

    container.innerHTML = this.generarHTMLFiltroBasico();
    this.cargarValoresFiltroBasico();
    this.attachBasicoInlineListeners();
    this.renderChipsActivos();
  }

  mostrarFiltroAvanzadoInline() {
    const container = document.getElementById('filtrosInline');
    if (!container) return;
    // Botones activos
    document.getElementById('toggleFiltroBasico')?.classList.remove('active');
    document.getElementById('toggleFiltroAvanzado')?.classList.add('active');

    if (!this.filtrosSimplificados?.tipo_inmueble_id) {
      container.innerHTML = '<p class="mensaje-info">⚠️ Debes seleccionar un tipo de inmueble primero</p>';
      return;
    }
    container.innerHTML = this.generarHTMLFiltroAvanzado();
    this.attachAvanzadoInlineListeners();
    this.renderChipsActivos();
  }

  attachBasicoInlineListeners() {
    // Guardar al vuelo para chips/estado
    const radios = document.querySelectorAll('input[name="transaccion_basico"]');
    if (!this.debouncedPreview) this.debouncedPreview = this.debounce(this.actualizarPreview.bind(this), 350);

    radios.forEach(r => r.addEventListener('change', (e) => {
      this.filtrosAdicionales.basico.transaccion = e.target.value;
      this.renderChipsActivos();
      this.debouncedPreview();
    }));

    ['area_basico','parqueos_basico','presupuesto_compra_basico','presupuesto_alquiler_basico','antiguedad_basico'].forEach(id => {
      const el = document.getElementById(id);
      el?.addEventListener('input', () => { this.renderChipsActivos(); this.debouncedPreview(); });
    });

    // Pills de transacción
    document.querySelectorAll('.pill-tx').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const value = e.currentTarget.dataset.tx;
        // Toggle única selección
        document.querySelectorAll('.pill-tx').forEach(p => { p.classList.remove('active'); p.setAttribute('aria-pressed','false'); });
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('aria-pressed','true');
        // Sincronizar radios ocultos
        document.querySelectorAll('input[name="transaccion_basico"]').forEach(r => { r.checked = (r.value === value); });
        this.filtrosAdicionales.basico.transaccion = value;
        this.renderChipsActivos();
        this.debouncedPreview();
      });
    });

    // Pills genéricas que apuntan a inputs numéricos
    document.querySelectorAll('.pills-row[data-target-input] .pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.pills-row');
        const targetSel = row.getAttribute('data-target-input');
        const input = document.querySelector(targetSel);
        const val = e.currentTarget.getAttribute('data-val');
        if (input) input.value = val;
        // Activar visual
        row.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderChipsActivos();
        this.debouncedPreview();
      });
    });

    // Pills de implementación (sin select)
    document.querySelectorAll('.pill-implementacion').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const value = e.currentTarget.dataset.val;
        const wasActive = e.currentTarget.classList.contains('active');
        
        // Toggle: si ya estaba activo, lo desactivamos
        document.querySelectorAll('.pill-implementacion').forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-pressed', 'false');
        });
        
        if (!wasActive) {
          e.currentTarget.classList.add('active');
          e.currentTarget.setAttribute('aria-pressed', 'true');
          this.filtrosAdicionales.basico.implementacion = value;
        } else {
          this.filtrosAdicionales.basico.implementacion = null;
        }
        
        this.renderChipsActivos();
        this.debouncedPreview();
      });
    });
  }

  attachAvanzadoInlineListeners() {
    // Sub-accordion headers (categorías)
    document.querySelectorAll('.accordion-header-avanzado').forEach(header => {
      header.addEventListener('click', (e) => {
        const categoria = e.currentTarget.getAttribute('data-categoria');
        const content = document.querySelector(`.accordion-content-avanzado[data-categoria="${categoria}"]`);

        if (!content) return;

        const wasExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true';

        // Close all panels in same container
        const container = e.currentTarget.closest('.contenedor-avanzado');
        if (container) {
          container.querySelectorAll('.accordion-header-avanzado').forEach(h => {
            h.setAttribute('aria-expanded', 'false');
          });
          container.querySelectorAll('.accordion-content-avanzado').forEach(c => {
            c.classList.remove('open');
          });
        }

        // Toggle current panel
        if (!wasExpanded) {
          e.currentTarget.setAttribute('aria-expanded', 'true');
          content.classList.add('open');
        }
      });
    });

    // Pill buttons (checkbox filters)
    document.querySelectorAll('.pill[data-tipo="checkbox"]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const categoria = e.currentTarget.getAttribute('data-cat');
        const caracId = parseInt(e.currentTarget.getAttribute('data-carac-id'));

        // Initialize category if needed
        if (!this.filtrosAdicionales.avanzado[categoria]) {
          this.filtrosAdicionales.avanzado[categoria] = {};
        }

        // Toggle value
        const isActive = this.filtrosAdicionales.avanzado[categoria][caracId] === true;
        if (isActive) {
          delete this.filtrosAdicionales.avanzado[categoria][caracId];
        } else {
          this.filtrosAdicionales.avanzado[categoria][caracId] = true;
        }

        // Update UI
        e.currentTarget.classList.toggle('active');
        e.currentTarget.setAttribute('aria-pressed', !isActive ? 'true' : 'false');

        // Update counter badge
        this.actualizarBadgeCategoria(categoria);

        // Re-render and preview
        this.renderChipsActivos();
        this.debouncedPreview?.();
      });
    });

    // Number inputs
    document.querySelectorAll('.number-filter-inline input[type="number"]').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const categoria = e.currentTarget.getAttribute('data-cat');
        const caracId = parseInt(e.currentTarget.getAttribute('data-carac-id'));
        const value = parseFloat(e.currentTarget.value);

        // Initialize category if needed
        if (!this.filtrosAdicionales.avanzado[categoria]) {
          this.filtrosAdicionales.avanzado[categoria] = {};
        }

        // Store or remove value
        if (!isNaN(value) && value > 0) {
          this.filtrosAdicionales.avanzado[categoria][caracId] = value;
        } else {
          delete this.filtrosAdicionales.avanzado[categoria][caracId];
        }

        // Update counter badge
        this.actualizarBadgeCategoria(categoria);

        // Re-render and preview
        this.renderChipsActivos();
        this.debouncedPreview?.();
      });
    });

    // Old checkbox structure (for backwards compatibility)
    document.querySelectorAll('input[name="caracteristicas_avanzado"]').forEach(cb => {
      cb.addEventListener('change', () => { this.renderChipsActivos(); this.debouncedPreview?.(); });
    });
  }

  actualizarBadgeCategoria(categoria) {
    // Update the counter badge for a specific category
    const header = document.querySelector(`.accordion-header-avanzado[data-categoria="${categoria}"]`);
    if (!header) return;

    const count = this.contarCriteriosActivosCategoria(categoria);
    let badge = header.querySelector('.badge-counter');

    if (count > 0) {
      if (!badge) {
        // Create badge
        badge = document.createElement('span');
        badge.className = 'badge-counter';
        // Insert before the arrow
        const arrow = header.querySelector('.accordion-arrow');
        header.insertBefore(badge, arrow);
      }
      badge.textContent = count;
    } else {
      // Remove badge
      if (badge) badge.remove();
    }
  }

  // Captura UI actual hacia estado y recalcula conteo en imagen
  capturarDesdeUI() {
    // Básico
    this.filtrosAdicionales.basico = {
      transaccion: document.querySelector('input[name="transaccion_basico"]:checked')?.value,
      area: document.getElementById('area_basico')?.value,
      parqueos: document.getElementById('parqueos_basico')?.value,
      presupuesto_compra: document.getElementById('presupuesto_compra_basico')?.value,
      presupuesto_alquiler: document.getElementById('presupuesto_alquiler_basico')?.value,
      antiguedad: document.getElementById('antiguedad_basico')?.value,
      implementacion: document.getElementById('implementacion_basico')?.value
    };

    // Avanzado
    const checkboxes = document.querySelectorAll('input[name="caracteristicas_avanzado"]:checked');
    const caracsChecked = Array.from(checkboxes).map(cb => parseInt(cb.value));
    const numbers = Array.from(document.querySelectorAll('input[data-carac-id]'))
      .map(inp => ({ id: parseInt(inp.dataset.caracId), val: parseFloat(inp.value) }))
      .filter(x => !isNaN(x.val) && x.val > 0);
    this.filtrosAdicionales.avanzado = { checkboxes: caracsChecked, numbers };
  }

  actualizarPreview() {
    // Recalcular sin salir de la imagen referencial
    this.capturarDesdeUI();
    this.aplicarFiltrosIniciales();
    this.aplicarFiltrosBasicos();
    this.aplicarFiltrosAvanzados();

    // Actualizar contadores en la cabecera
    const numResultados = this.propiedadesFiltradas.length;
    document.getElementById('numResultados').textContent = numResultados;
    document.getElementById('resultadosCount').textContent =
      numResultados === 0 ? 'Resultados de Búsqueda' : `${numResultados} ${numResultados === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`;
  }

  renderChipsActivos() {
    const bar = document.getElementById('filtrosAplicados');
    if (!bar) return;

    const chips = [];
    // Básico
    const b = this.filtrosAdicionales.basico;
    if (b?.transaccion) chips.push({ label: `Transacción: ${b.transaccion}`, kind: 'basico', key: 'transaccion' });
    if (b?.area) chips.push({ label: `Área ≥ ${b.area} m²`, kind: 'basico', key: 'area' });
    if (b?.parqueos) chips.push({ label: `Parqueos ≥ ${b.parqueos}`, kind: 'basico', key: 'parqueos' });
    if (b?.presupuesto_compra) chips.push({ label: `Compra ≤ ${Number(b.presupuesto_compra).toLocaleString()} USD`, kind: 'basico', key: 'presupuesto_compra' });
    if (b?.presupuesto_alquiler) chips.push({ label: `Alquiler ≤ ${Number(b.presupuesto_alquiler).toLocaleString()} USD/mes`, kind: 'basico', key: 'presupuesto_alquiler' });
    if (b?.antiguedad) chips.push({ label: `Antigüedad ≤ ${b.antiguedad} años`, kind: 'basico', key: 'antiguedad' });
    if (b?.implementacion) chips.push({ label: `Impl.: ${b.implementacion}`, kind: 'basico', key: 'implementacion' });

    // Avanzado - new category-based structure
    for (const [categoria, filtros] of Object.entries(this.filtrosAdicionales.avanzado)) {
      for (const [caracId, value] of Object.entries(filtros)) {
        const id = parseInt(caracId);
        const carac = this.caracteristicas.find(c => c.id === id);

        if (!carac) continue;

        if (carac.tipo_input === 'checkbox') {
          chips.push({
            label: carac.nombre,
            kind: 'avz_check',
            key: `${categoria}_${id}`,
            categoria
          });
        } else if (carac.tipo_input === 'number') {
          chips.push({
            label: `${carac.nombre} ≥ ${value}${carac.unidad ? ' ' + carac.unidad : ''}`,
            kind: 'avz_num',
            key: `${categoria}_${id}`,
            categoria
          });
        }
      }
    }

    // Avanzado - old structure (backwards compatibility)
    const checked = Array.from(document.querySelectorAll('input[name="caracteristicas_avanzado"]:checked'))
      .map(cb => parseInt(cb.value));
    const nombresChecked = checked.map(id => ({ id, nombre: this.caracteristicas.find(c => c.id === id)?.nombre })).filter(x => x.nombre);
    nombresChecked.forEach(x => chips.push({ label: x.nombre, kind: 'avz_check', key: String(x.id) }));

    // Pintar chips
    if (chips.length === 0) {
      bar.innerHTML = '<span class="chip muted">Sin filtros adicionales</span>';
    } else {
      bar.innerHTML = chips.map(c => `
        <span class="chip" data-kind="${c.kind}" data-key="${c.key}"${c.categoria ? ` data-categoria="${c.categoria}"` : ''}>
          ${c.label}
          <button type="button" class="chip__close" aria-label="Quitar">×</button>
        </span>
      `).join('');
    }
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

  // Mostrar layout 3 columnas (Filtros | Resultados | Mapa)
  mostrarLayoutTresColumnas() {
    const imagenRef = document.getElementById('imagenReferencial');
    const mainContainer = document.getElementById('mainContainer');
    imagenRef.style.display = 'none';
    mainContainer.style.display = 'grid';
    this.mostrandoResultados = true;

    // Cargar resumen de genéricos y filtros en acordeón
    this.renderResumenGenericos();
    document.getElementById('contenedorBasico').innerHTML = this.generarHTMLFiltroBasico();
    document.getElementById('contenedorAvanzado').innerHTML = this.generarHTMLFiltroAvanzado();
    this.attachBasicoInlineListeners();
    this.attachAvanzadoInlineListeners();
    this.setupAccordion();
    this.renderChipsActivos();

    // Resultados + mapa
    this.renderResultados();
    this.renderMapa();

    // Rellenar versión móvil de filtros
    this.renderResumenGenericosMobile();
    const contBasMob = document.getElementById('contenedorBasicoMobile');
    const contAvzMob = document.getElementById('contenedorAvanzadoMobile');
    if (contBasMob) contBasMob.innerHTML = this.generarHTMLFiltroBasico();
    if (contAvzMob) contAvzMob.innerHTML = this.generarHTMLFiltroAvanzado();
    this.attachBasicoInlineListeners();
    this.attachAvanzadoInlineListeners();
  }

  // Resumen de filtros simplificados en columna izquierda
  renderResumenGenericos() {
    const box = document.getElementById('resumenGenericos');
    if (!box) return;
    const fs = this.filtrosSimplificados || {};

    console.log('🎨 Renderizando resumen genéricos...');
    console.log('   distritos disponibles:', this.distritos.length);
    console.log('   tipos inmuebles disponibles:', this.tiposInmuebles.length);
    console.log('   distritos_ids en filtros:', fs.distritos_ids);
    console.log('   tipo_inmueble_id en filtros:', fs.tipo_inmueble_id);

    // Distritos
    const distritos = Array.isArray(fs.distritos_ids) && fs.distritos_ids.length > 0
      ? fs.distritos_ids.map(id => this.distritos.find(d => d.id === id)?.nombre).filter(Boolean).join(', ')
      : (fs.distrito_id ? (this.distritos.find(d => d.id === fs.distrito_id)?.nombre || '') : '—');

    // Tipo de inmueble
    const tipoInmueble = fs.tipo_inmueble_id
      ? (this.tiposInmuebles.find(t => t.id === fs.tipo_inmueble_id)?.nombre || '—')
      : '—';

    console.log('   distritos calculados:', distritos);
    console.log('   tipo inmueble calculado:', tipoInmueble);

    // Área/metraje
    const metragem = fs.area ? `${fs.area} m²` : '—';

    // Condición (compra/alquiler)
    const condicion = fs.transaccion ? (fs.transaccion === 'compra' ? 'Compra' : 'Alquiler') : '—';

    // Presupuesto (dependiendo de transacción)
    let presupuesto = '—';
    if (fs.transaccion === 'compra' && fs.presupuesto_compra) {
      presupuesto = `${Number(fs.presupuesto_compra).toLocaleString()} USD`;
    } else if (fs.transaccion === 'alquiler' && fs.presupuesto_alquiler) {
      presupuesto = `${Number(fs.presupuesto_alquiler).toLocaleString()} USD/mes`;
    }

    box.innerHTML = `
      <div class="item"><span>Distrito(s)</span><strong>${distritos || '—'}</strong></div>
      <div class="item"><span>Tipo Inmueble</span><strong>${tipoInmueble}</strong></div>
      <div class="item"><span>Área</span><strong>${metragem}</strong></div>
      <div class="item"><span>Transacción</span><strong>${condicion}</strong></div>
      <div class="item"><span>Presupuesto</span><strong>${presupuesto}</strong></div>
    `;
  }

  // Acordeón simple sin librerías
  setupAccordion() {
    // Lógica del acordeón: solo un panel abierto a la vez
    document.querySelectorAll('.accordion-header').forEach(header => {
      // Remover listener anterior si existe
      const oldListener = header._accordionListener;
      if (oldListener) {
        header.removeEventListener('click', oldListener);
      }
      
      // Crear nuevo listener
      const newListener = (e) => {
        const acordeonId = e.currentTarget.getAttribute('data-accordion');
        const content = document.querySelector(`.accordion-content[data-accordion="${acordeonId}"]`);

        if (!content) return;

        const isOpen = content.classList.contains('open');
        const wasExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true';

        // Cerrar todos los paneles del mismo contenedor (desktop o mobile)
        const container = e.currentTarget.closest('.filters-inner, .drawer-body');
        if (container) {
          container.querySelectorAll('.accordion-header').forEach(h => {
            h.setAttribute('aria-expanded', 'false');
          });
          container.querySelectorAll('.accordion-content').forEach(c => {
            c.classList.remove('open');
          });
        }

        // Alternar el panel actual
        if (!wasExpanded) {
          e.currentTarget.setAttribute('aria-expanded', 'true');
          content.classList.add('open');
        }

        // Verificar si debe mostrar resultados
        this.verificarMostrarResultadosPorAcordeon();
      };
      
      // Guardar referencia y agregar listener
      header._accordionListener = newListener;
      header.addEventListener('click', newListener);
    });

    // Abrir "Filtros Genéricos" por defecto en desktop
    const genericosDesktop = document.querySelector('.filters-section .accordion-header[data-accordion="genericos"]');
    if (genericosDesktop) {
      genericosDesktop.setAttribute('aria-expanded', 'true');
      document.querySelector('.filters-section .accordion-content[data-accordion="genericos"]')?.classList.add('open');
    }

    // Verificar estado inicial
    this.verificarMostrarResultadosPorAcordeon();

    // Botones aplicar/limpiar de la columna
    document.getElementById('btnAplicarFiltrosCol')?.addEventListener('click', () => {
      this.aplicarFiltrosCompletos();
    });

    document.getElementById('btnLimpiarFiltrosCol')?.addEventListener('click', () => {
      this.limpiarFiltrosAdicionales();
      // Re-render contenido básico y avanzado vacíos
      document.getElementById('contenedorBasico').innerHTML = this.generarHTMLFiltroBasico();
      document.getElementById('contenedorAvanzado').innerHTML = this.generarHTMLFiltroAvanzado();
      this.attachBasicoInlineListeners();
      this.attachAvanzadoInlineListeners();
      this.renderChipsActivos();
    });
  }

  verificarMostrarResultadosPorAcordeon() {
    // Verificar si Filtro Básico o Filtros Avanzados están abiertos
    const basicoAbierto = document.querySelector('.accordion-header[data-accordion="basico"][aria-expanded="true"]') !== null;
    const avanzadoAbierto = document.querySelector('.accordion-header[data-accordion="avanzado"][aria-expanded="true"]') !== null;

    const mostrarResultados = basicoAbierto || avanzadoAbierto;

    const placeholderResultados = document.getElementById('placeholderResultados');
    const propertiesList = document.getElementById('propertiesList');
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    const mapCanvas = document.getElementById('map');

    if (mostrarResultados) {
      // Mostrar resultados y mapa
      if (placeholderResultados) placeholderResultados.style.display = 'none';
      if (propertiesList) propertiesList.style.display = 'flex';
      if (mapPlaceholder) mapPlaceholder.style.display = 'none';
      if (mapCanvas) mapCanvas.style.display = 'block';
      
      // Renderizar resultados y mapa
      this.renderResultados();
      this.renderMapa();
      
      // Forzar que el mapa se redibuje correctamente
      if (this.map) {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      }
    } else {
      // Mostrar placeholders
      if (placeholderResultados) placeholderResultados.style.display = 'flex';
      if (propertiesList) propertiesList.style.display = 'none';
      if (mapPlaceholder) mapPlaceholder.style.display = 'flex';
      if (mapCanvas) mapCanvas.style.display = 'none';
    }
  }

  setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const headerActions = document.getElementById('headerActions');

    if (!hamburger || !headerActions) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      headerActions.classList.toggle('active');
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !headerActions.contains(e.target)) {
        hamburger.classList.remove('active');
        headerActions.classList.remove('active');
      }
    });
  }

  setupPresupuesto() {
    // Esta función maneja la lógica de presupuesto dinámico
    // Por ahora solo placeholder, se puede expandir después
    const radios = document.querySelectorAll('input[name="transaccion"], input[name="transaccion_basico"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        // Lógica para cambiar labels de presupuesto según transacción
        // (ya implementada en otros listeners)
      });
    });
  }

  setupEventListeners() {
    // Toggle Filtro Básico
    document.getElementById('toggleFiltroBasico')?.addEventListener('click', () => {
      this.mostrarFiltroBasicoInline();
    });

    // Toggle Filtro Avanzado
    document.getElementById('toggleFiltroAvanzado')?.addEventListener('click', () => {
      this.mostrarFiltroAvanzadoInline();
    });

    // Botón Aplicar Filtros Inline
    document.getElementById('btnAplicarFiltrosInline')?.addEventListener('click', () => {
      this.aplicarFiltrosCompletos();
    });

    // Botón Limpiar Filtros Inline
    document.getElementById('btnLimpiarFiltrosInline')?.addEventListener('click', () => {
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

    // Cargar filtro básico por defecto
    this.mostrarFiltroBasicoInline();

    // Delegación: quitar chips
    const chipsBar = document.getElementById('filtrosAplicados');
    chipsBar?.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip__close');
      if (!btn) return;
      const chip = btn.closest('.chip');
      const kind = chip?.dataset.kind;
      const key = chip?.dataset.key;
      if (!kind) return;

      if (kind === 'basico') {
        // Campos básicos
        if (key === 'transaccion') {
          document.querySelectorAll('input[name="transaccion_basico"]').forEach(r => r.checked = false);
          delete this.filtrosAdicionales.basico.transaccion;
        } else if (key === 'implementacion') {
          const sel = document.getElementById('implementacion_basico');
          if (sel) sel.value = '';
          delete this.filtrosAdicionales.basico.implementacion;
        } else {
          const idMap = {
            area: 'area_basico',
            parqueos: 'parqueos_basico',
            presupuesto_compra: 'presupuesto_compra_basico',
            presupuesto_alquiler: 'presupuesto_alquiler_basico',
            antiguedad: 'antiguedad_basico'
          };
          const inputId = idMap[key];
          const el = document.getElementById(inputId);
          if (el) el.value = '';
          delete this.filtrosAdicionales.basico[key];
        }
      } else if (kind === 'avz_check' || kind === 'avz_num') {
        // New category-based structure: key format is "CATEGORIA_ID"
        if (key.includes('_')) {
          const parts = key.split('_');
          const caracId = parts.pop(); // Last part is the ID
          const categoria = parts.join('_'); // Rest is the category

          // Remove from state
          if (this.filtrosAdicionales.avanzado[categoria]) {
            delete this.filtrosAdicionales.avanzado[categoria][caracId];

            // Update UI
            const pill = document.querySelector(`.pill[data-cat="${categoria}"][data-carac-id="${caracId}"]`);
            if (pill) {
              pill.classList.remove('active');
              pill.setAttribute('aria-pressed', 'false');
            }

            const input = document.querySelector(`.number-filter-inline input[data-cat="${categoria}"][data-carac-id="${caracId}"]`);
            if (input) input.value = '';

            // Update badge
            this.actualizarBadgeCategoria(categoria);
          }
        } else {
          // Old structure (backwards compatibility)
          const cb = document.getElementById(`carac_${key}`);
          if (cb) cb.checked = false;
          const inp = document.querySelector(`input[data-carac-id="${key}"]`);
          if (inp) inp.value = '';
        }
      }

      this.renderChipsActivos();
      this.debouncedPreview?.();
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
          <div class="pills-row" role="group" aria-label="Transacción">
            <button type="button" class="pill pill-tx" data-tx="compra" aria-pressed="${this.filtrosAdicionales.basico.transaccion === 'compra' ? 'true' : 'false'}">
              <i class="fa-solid fa-hand-holding-dollar"></i> Compra
            </button>
            <button type="button" class="pill pill-tx" data-tx="alquiler" aria-pressed="${this.filtrosAdicionales.basico.transaccion === 'alquiler' ? 'true' : 'false'}">
              <i class="fa-solid fa-key"></i> Alquiler
            </button>
          </div>
          <!-- Radios ocultos por accesibilidad -->
          <div class="radio-group" style="display:none;">
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
          <div class="pills-row" data-target-input="#area_basico">
            <button type="button" class="pill" data-val="300">≥ 300</button>
            <button type="button" class="pill" data-val="500">≥ 500</button>
            <button type="button" class="pill" data-val="1000">≥ 1000</button>
          </div>
          <input type="number" id="area_basico" class="form-control" placeholder="460" value="${this.filtrosAdicionales.basico.area || ''}">
          <small>💡 El sistema busca ±15%</small>
        </div>

        <div class="form-group">
          <label for="parqueos_basico">Parqueos Requeridos</label>
          <div class="pills-row" data-target-input="#parqueos_basico">
            <button type="button" class="pill" data-val="2">≥ 2</button>
            <button type="button" class="pill" data-val="4">≥ 4</button>
            <button type="button" class="pill" data-val="8">≥ 8</button>
          </div>
          <input type="number" id="parqueos_basico" class="form-control" placeholder="8" value="${this.filtrosAdicionales.basico.parqueos || ''}">
          <small>💡 El sistema contempla ±20%</small>
        </div>

        <div class="form-group">
          <label for="presupuesto_compra_basico">Presupuesto Compra (USD)</label>
          <div class="pills-row" data-target-input="#presupuesto_compra_basico">
            <button type="button" class="pill" data-val="500000">≤ 500,000</button>
            <button type="button" class="pill" data-val="750000">≤ 750,000</button>
            <button type="button" class="pill" data-val="1000000">≤ 1,000,000</button>
          </div>
          <input type="number" id="presupuesto_compra_basico" class="form-control" placeholder="750,000" value="${this.filtrosAdicionales.basico.presupuesto_compra || ''}">
          <small>(Sin IGV) 💡 Tolerancia ±15%</small>
        </div>

        <div class="form-group">
          <label for="presupuesto_alquiler_basico">Presupuesto Alquiler (USD/mes)</label>
          <div class="pills-row" data-target-input="#presupuesto_alquiler_basico">
            <button type="button" class="pill" data-val="5000">≤ 5,000</button>
            <button type="button" class="pill" data-val="8000">≤ 8,000</button>
            <button type="button" class="pill" data-val="12000">≤ 12,000</button>
          </div>
          <input type="number" id="presupuesto_alquiler_basico" class="form-control" placeholder="8,500" value="${this.filtrosAdicionales.basico.presupuesto_alquiler || ''}">
          <small>💡 Tolerancia ±15%</small>
        </div>

        <div class="form-group">
          <label for="antiguedad_basico">Antigüedad (No mayor a años)</label>
          <div class="pills-row" data-target-input="#antiguedad_basico">
            <button type="button" class="pill" data-val="5">≤ 5</button>
            <button type="button" class="pill" data-val="10">≤ 10</button>
            <button type="button" class="pill" data-val="15">≤ 15</button>
          </div>
          <input type="number" id="antiguedad_basico" class="form-control" placeholder="15" value="${this.filtrosAdicionales.basico.antiguedad || ''}">
        </div>

        <div class="form-group">
          <label>Nivel de Implementación</label>
          <div class="pills-row" role="group" aria-label="Nivel de Implementación">
            <button type="button" class="pill pill-implementacion ${this.filtrosAdicionales.basico.implementacion === 'Amoblado FULL' ? 'active' : ''}" data-val="Amoblado FULL" aria-pressed="${this.filtrosAdicionales.basico.implementacion === 'Amoblado FULL' ? 'true' : 'false'}">
              <i class="fa-solid fa-couch"></i> FULL
            </button>
            <button type="button" class="pill pill-implementacion ${this.filtrosAdicionales.basico.implementacion === 'Implementada' ? 'active' : ''}" data-val="Implementada" aria-pressed="${this.filtrosAdicionales.basico.implementacion === 'Implementada' ? 'true' : 'false'}">
              <i class="fa-solid fa-toolbox"></i> Impl.
            </button>
            <button type="button" class="pill pill-implementacion ${this.filtrosAdicionales.basico.implementacion === 'Semi Implementada' ? 'active' : ''}" data-val="Semi Implementada" aria-pressed="${this.filtrosAdicionales.basico.implementacion === 'Semi Implementada' ? 'true' : 'false'}">
              <i class="fa-solid fa-screwdriver-wrench"></i> Semi
            </button>
            <button type="button" class="pill pill-implementacion ${this.filtrosAdicionales.basico.implementacion === 'Por Implementar' ? 'active' : ''}" data-val="Por Implementar" aria-pressed="${this.filtrosAdicionales.basico.implementacion === 'Por Implementar' ? 'true' : 'false'}">
              <i class="fa-solid fa-box-open"></i> Por impl.
            </button>
          </div>
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
    console.log('🔍 Generando filtros avanzados...');
    console.log('   tipo_inmueble_id:', this.filtrosSimplificados?.tipo_inmueble_id);
    console.log('   características totales:', this.caracteristicas.length);

    // Si no hay tipo de inmueble, mostrar mensaje
    if (!this.filtrosSimplificados?.tipo_inmueble_id || this.caracteristicas.length === 0) {
      console.warn('⚠️ No hay tipo_inmueble_id o no hay características');
      return `
        <div style="padding: 20px; text-align: center; color: var(--gris-medio);">
          <p><i class="fa-solid fa-info-circle"></i></p>
          <p>Selecciona un tipo de inmueble en la búsqueda básica para ver filtros avanzados</p>
        </div>
      `;
    }

    // Filtrar características por tipo de inmueble
    const caracsDelTipo = this.caracteristicas.filter(
      c => c.tipo_inmueble_id === this.filtrosSimplificados.tipo_inmueble_id
    );

    console.log('   características del tipo:', caracsDelTipo.length);

    if (caracsDelTipo.length === 0) {
      return `
        <div style="padding: 20px; text-align: center; color: var(--gris-medio);">
          <p>No hay filtros avanzados disponibles para este tipo de inmueble</p>
        </div>
      `;
    }

    // Agrupar por categoría
    const categorias = {};
    caracsDelTipo.forEach(carac => {
      if (!categorias[carac.categoria]) {
        categorias[carac.categoria] = [];
      }
      categorias[carac.categoria].push(carac);
    });

    // Mapa de iconos por categoría
    const iconMap = {
      'AREAS_COMUNES_EDIFICIO': 'fa-building',
      'SERVICIOS': 'fa-wrench',
      'SEGURIDAD': 'fa-shield-halved',
      'TECNOLOGIA_CONECTIVIDAD': 'fa-wifi',
      'SOSTENIBILIDAD': 'fa-leaf',
      'ESPACIOS_PERSONALES': 'fa-door-open',
      'COMPLEMENTARIOS': 'fa-box',
      'OTROS': 'fa-circle-info'
    };

    // Renderizar con acordeón interno por categoría
    return Object.entries(categorias).map(([categoria, items]) => {
      const icon = iconMap[categoria] || 'fa-circle-info';
      const countActive = this.contarCriteriosActivosCategoria(categoria);
      const badgeHTML = countActive > 0 ? `<span class="badge-counter">${countActive}</span>` : '';

      return `
        <div class="accordion-item-avanzado">
          <button class="accordion-header-avanzado" type="button" data-categoria="${categoria}" aria-expanded="false">
            <i class="fa-solid ${icon}"></i>
            <span>${this.formatCategoria(categoria)}</span>
            ${badgeHTML}
            <i class="fa-solid fa-chevron-down accordion-arrow"></i>
          </button>
          <div class="accordion-content-avanzado" data-categoria="${categoria}">
            <div class="pills-row">
              ${items.map(item => this.renderCaracteristicaPill(item)).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  contarCriteriosActivosCategoria(categoria) {
    if (!this.filtrosAdicionales.avanzado[categoria]) return 0;
    return Object.keys(this.filtrosAdicionales.avanzado[categoria]).length;
  }

  renderCaracteristicaPill(item) {
    if (item.tipo_input === 'checkbox') {
      const isActive = this.filtrosAdicionales.avanzado[item.categoria]?.[item.id] === true;
      return `
        <button
          type="button"
          class="pill ${isActive ? 'active' : ''}"
          data-cat="${item.categoria}"
          data-carac-id="${item.id}"
          data-tipo="checkbox"
          aria-pressed="${isActive ? 'true' : 'false'}"
        >
          ${item.nombre}
        </button>
      `;
    }

    if (item.tipo_input === 'number') {
      const value = this.filtrosAdicionales.avanzado[item.categoria]?.[item.id] || '';
      return `
        <div class="number-filter-inline">
          <label>${item.nombre}</label>
          <input
            type="number"
            class="form-control form-control-sm"
            value="${value}"
            data-cat="${item.categoria}"
            data-carac-id="${item.id}"
            placeholder="0"
          >
        </div>
      `;
    }

    return '';
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
      implementacion: this.filtrosAdicionales.basico.implementacion // Ya se actualiza con los pills
    };

    // Capturar valores del filtro avanzado
    const checkboxes = document.querySelectorAll('input[name="caracteristicas_avanzado"]:checked');
    const caracsChecked = Array.from(checkboxes).map(cb => parseInt(cb.value));

    const numbers = Array.from(document.querySelectorAll('input[data-carac-id]'))
      .map(inp => ({ id: parseInt(inp.dataset.caracId), val: parseFloat(inp.value) }))
      .filter(x => !isNaN(x.val) && x.val > 0);

    this.filtrosAdicionales.avanzado = {
      checkboxes: caracsChecked,
      numbers: numbers
    };

    // Aplicar filtros
    this.aplicarFiltrosIniciales();
    this.aplicarFiltrosBasicos();
    this.aplicarFiltrosAvanzados();

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

  aplicarFiltrosAvanzados() {
    // Check if there are any advanced filters
    const hasFilters = Object.values(this.filtrosAdicionales.avanzado).some(
      categoria => Object.keys(categoria).length > 0
    );

    if (!hasFilters) return;

    this.propiedadesFiltradas = this.propiedadesFiltradas.filter(prop => {
      // Iterate through all categories
      for (const [categoria, filtros] of Object.entries(this.filtrosAdicionales.avanzado)) {
        // Skip empty categories
        if (Object.keys(filtros).length === 0) continue;

        // Check each filter in this category
        for (const [caracId, value] of Object.entries(filtros)) {
          const id = parseInt(caracId);
          const carac = this.caracteristicas.find(c => c.id === id);

          if (!carac) continue;

          // Find if property has this characteristic
          const propCarac = prop.caracteristicas?.find(pc => pc.caracteristica_id === id);

          if (carac.tipo_input === 'checkbox') {
            // Checkbox: property must have this characteristic
            if (!propCarac) return false;
          } else if (carac.tipo_input === 'number') {
            // Number: property value must be >= filter value
            if (!propCarac || !propCarac.valor_numerico) return false;
            if (parseFloat(propCarac.valor_numerico) < parseFloat(value)) return false;
          }
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
        <button class="favorite-btn" data-property-id="${prop.id}" aria-label="Marcar favorito">${this.favoritos.includes(prop.id) ? '❤' : '♡'}</button>
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

    // Botones de favorito
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const propId = parseInt(e.currentTarget.dataset.propertyId);
        const idx = this.favoritos.indexOf(propId);
        if (idx >= 0) {
          this.favoritos.splice(idx, 1);
        } else {
          this.favoritos.push(propId);
        }
        this.guardarFavoritos();
        // Actualizar icono en botón
        e.currentTarget.textContent = this.favoritos.includes(propId) ? '❤' : '♡';
      });
    });
  }

  renderMapa() {
    const mapCanvas = document.getElementById('map');
    
    // Forzar que el mapa sea visible antes de inicializar
    if (mapCanvas) {
      mapCanvas.style.display = 'block';
    }
    
    // Inicializar mapa si no existe
    if (!this.map && mapCanvas) {
      try {
        this.map = L.map('map').setView([-12.0464, -77.0428], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(this.map);
        
        // Forzar redimensionamiento
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
          }
        }, 100);
      } catch (error) {
        console.error('Error inicializando mapa:', error);
        return;
      }
    }

    if (!this.map) return;

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

    // Ajustar zoom para mostrar todos los marcadores
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1), {
        maxZoom: 15,  // Limitar el zoom máximo para que no se aleje demasiado
        animate: true
      });
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
