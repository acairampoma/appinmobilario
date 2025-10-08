// Página de Búsqueda - Match Property
class BusquedaPage {
  constructor() {
    this.distritos = [];
    this.tiposInmuebles = [];
    this.caracteristicas = [];
    this.filtrosSeleccionados = {
      distritos: [],
      tipo_inmueble_id: null,
      transaccion: 'ambos',
      area: null,
      parqueos: null,
      presupuesto_compra: null,
      presupuesto_alquiler: null,
      antiguedad: null,
      implementacion: null,
      caracteristicas_valores: []
    };

    this.init();
  }

  async init() {
    await this.loadData();
    this.renderDistritos();
    this.renderTiposInmuebles();
    this.setupEventListeners();
    this.setupHamburgerMenu();
  }

  setupBackgroundChanger() {
    const tipoInmuebleCheckboxes = document.querySelectorAll('input[name="tipo_inmueble"]');
    const filtrosCard = document.querySelector('.filtros-basicos-card');

    const tipoMap = {
      '1': 'casa',
      '2': 'departamento',
      '3': 'terreno',
      '4': 'oficina',
      '5': 'local',
      '6': 'cochera'
    };

    tipoInmuebleCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        // Remover todos los data-tipo previos
        Object.values(tipoMap).forEach(tipo => {
          filtrosCard.removeAttribute('data-tipo');
        });

        // Si hay algún checkbox marcado, agregar el data-tipo correspondiente
        const checkedCheckbox = document.querySelector('input[name="tipo_inmueble"]:checked');
        if (checkedCheckbox) {
          const tipoId = checkedCheckbox.value;
          const tipoSlug = tipoMap[tipoId];
          if (tipoSlug) {
            filtrosCard.setAttribute('data-tipo', tipoSlug);
          }
        }
      });
    });
  }

  setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });

      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
    }
  }

  async loadData() {
    try {
      const [distritosRes, tiposRes, caracteristicasRes] = await Promise.all([
        fetch('data/distritos.json'),
        fetch('data/tipos-inmuebles.json'),
        fetch('data/caracteristicas.json')
      ]);

      const distritosData = await distritosRes.json();
      const tiposData = await tiposRes.json();
      const caracteristicasData = await caracteristicasRes.json();

      this.distritos = distritosData.distritos;
      this.tiposInmuebles = tiposData.tipos;
      this.caracteristicas = caracteristicasData.caracteristicas;
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }

  renderDistritos() {
    const container = document.getElementById('distritosCheckboxes');
    if (!container) return;

    const html = this.distritos.map(distrito => `
      <div class="checkbox-item">
        <input type="checkbox" id="distrito_${distrito.id}" value="${distrito.id}" name="distritos">
        <label for="distrito_${distrito.id}">${distrito.nombre}</label>
      </div>
    `).join('');

    container.innerHTML = html;

    // Event listeners para checkboxes
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.filtrosSeleccionados.distritos.push(parseInt(e.target.value));
        } else {
          this.filtrosSeleccionados.distritos = this.filtrosSeleccionados.distritos.filter(
            id => id !== parseInt(e.target.value)
          );
        }
      });
    });
  }

  renderTiposInmuebles() {
    const select = document.getElementById('tipoInmueble');
    if (!select) return;

    const html = this.tiposInmuebles.map(tipo => `
      <option value="${tipo.id}">${tipo.icono} ${tipo.nombre}</option>
    `).join('');

    select.innerHTML = `<option value="">Selecciona un tipo...</option>` + html;

    // Event listener para cambio de tipo
    select.addEventListener('change', (e) => {
      this.filtrosSeleccionados.tipo_inmueble_id = e.target.value ? parseInt(e.target.value) : null;
      this.renderCaracteristicasAvanzadas();
    });
  }

  renderCaracteristicasAvanzadas() {
    const container = document.getElementById('caracteristicasAvanzadas');
    if (!container || !this.filtrosSeleccionados.tipo_inmueble_id) {
      if (container) container.innerHTML = '';
      return;
    }

    // Filtrar características por tipo de inmueble
    const caracsDelTipo = this.caracteristicas.filter(
      c => c.tipo_inmueble_id === this.filtrosSeleccionados.tipo_inmueble_id
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
    const html = Object.entries(categorias).map(([categoria, items]) => `
      <div class="categoria-section">
        <h3>${this.formatCategoria(categoria)}</h3>
        <div class="categoria-items">
          ${items.map(item => this.renderCaracteristicaInput(item)).join('')}
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  formatCategoria(categoria) {
    const nombres = {
      'AREAS_COMUNES_EDIFICIO': '🏢 Áreas Comunes del Edificio',
      'ASCENSORES': '🛗 Ascensores',
      'IMPLEMENTACION_DETALLE': '🔧 Implementación / Detalle',
      'SOPORTE_EDIFICIO': '⚡ Soporte del Edificio',
      'CERCANIA_ESTRATEGICA': '📍 Cercanía Estratégica a',
      'VISTA_OFICINA': '🏙️ Vista de la Oficina'
    };
    return nombres[categoria] || categoria;
  }

  renderCaracteristicaInput(carac) {
    if (carac.tipo_input === 'checkbox') {
      return `
        <div class="checkbox-item">
          <input type="checkbox" id="carac_${carac.id}" value="${carac.id}" name="caracteristicas">
          <label for="carac_${carac.id}">${carac.nombre}</label>
        </div>
      `;
    } else if (carac.tipo_input === 'number') {
      return `
        <div class="form-group">
          <label for="carac_${carac.id}">${carac.nombre}</label>
          <input type="number" id="carac_${carac.id}" class="form-control" placeholder="Cantidad" data-carac-id="${carac.id}">
          ${carac.unidad ? `<small>${carac.unidad}</small>` : ''}
        </div>
      `;
    }
    return '';
  }

  setupEventListeners() {
    // Cambiar fondo según tipo de inmueble seleccionado
    this.setupBackgroundChanger();

    // Botón Filtros Avanzados
    const btnFiltrosAvanzados = document.getElementById('btnFiltrosAvanzados');
    const filtrosAvanzados = document.getElementById('filtrosAvanzados');
    btnFiltrosAvanzados?.addEventListener('click', () => {
      if (filtrosAvanzados.style.display === 'none') {
        filtrosAvanzados.style.display = 'block';
        btnFiltrosAvanzados.textContent = '⚙️ Ocultar Filtros Avanzados';
      } else {
        filtrosAvanzados.style.display = 'none';
        btnFiltrosAvanzados.textContent = '⚙️ Filtros Avanzados';
      }
    });

    // Botón Buscar
    const btnBuscar = document.getElementById('btnBuscar');
    btnBuscar?.addEventListener('click', () => this.realizarBusqueda());

    // Botón Aplicar Filtros
    const btnAplicar = document.getElementById('btnAplicarFiltros');
    btnAplicar?.addEventListener('click', () => this.realizarBusqueda());

    // Botón Limpiar
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    btnLimpiar?.addEventListener('click', () => this.limpiarFiltros());

    // Inputs de filtros avanzados
    document.getElementById('areaRequerida')?.addEventListener('input', (e) => {
      this.filtrosSeleccionados.area = e.target.value ? parseInt(e.target.value) : null;
    });

    document.getElementById('parqueosRequeridos')?.addEventListener('input', (e) => {
      this.filtrosSeleccionados.parqueos = e.target.value ? parseInt(e.target.value) : null;
    });

    document.getElementById('presupuestoCompra')?.addEventListener('input', (e) => {
      this.filtrosSeleccionados.presupuesto_compra = e.target.value ? parseInt(e.target.value) : null;
    });

    document.getElementById('presupuestoAlquiler')?.addEventListener('input', (e) => {
      this.filtrosSeleccionados.presupuesto_alquiler = e.target.value ? parseInt(e.target.value) : null;
    });

    document.getElementById('antiguedad')?.addEventListener('input', (e) => {
      this.filtrosSeleccionados.antiguedad = e.target.value ? parseInt(e.target.value) : null;
    });

    document.getElementById('implementacion')?.addEventListener('change', (e) => {
      this.filtrosSeleccionados.implementacion = e.target.value || null;
    });

    // Radio buttons transacción
    document.querySelectorAll('input[name="transaccion"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.filtrosSeleccionados.transaccion = e.target.value;
      });
    });
  }

  limpiarFiltros() {
    // Resetear filtros
    this.filtrosSeleccionados = {
      distritos: [],
      tipo_inmueble_id: null,
      transaccion: 'ambos',
      area: null,
      parqueos: null,
      presupuesto_compra: null,
      presupuesto_alquiler: null,
      antiguedad: null,
      implementacion: null,
      caracteristicas_valores: []
    };

    // Limpiar checkboxes de distritos
    document.querySelectorAll('input[name="distritos"]').forEach(cb => cb.checked = false);

    // Limpiar select de tipo
    document.getElementById('tipoInmueble').value = '';

    // Limpiar inputs
    document.getElementById('areaRequerida').value = '';
    document.getElementById('parqueosRequeridos').value = '';
    document.getElementById('presupuestoCompra').value = '';
    document.getElementById('presupuestoAlquiler').value = '';
    document.getElementById('antiguedad').value = '';
    document.getElementById('implementacion').value = '';

    // Resetear radio
    document.querySelector('input[name="transaccion"][value="ambos"]').checked = true;

    // Limpiar características avanzadas
    document.getElementById('caracteristicasAvanzadas').innerHTML = '';
  }

  realizarBusqueda() {
    // Validar que al menos tenga distrito y tipo
    if (this.filtrosSeleccionados.distritos.length === 0) {
      alert('Por favor selecciona al menos un distrito');
      return;
    }

    if (!this.filtrosSeleccionados.tipo_inmueble_id) {
      alert('Por favor selecciona un tipo de inmueble');
      return;
    }

    // Guardar filtros en localStorage
    localStorage.setItem('filtros_busqueda', JSON.stringify(this.filtrosSeleccionados));

    // Redirigir a página de resultados
    window.location.href = 'resultados.html';
  }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
  new BusquedaPage();
});
