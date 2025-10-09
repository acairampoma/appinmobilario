// Página de Búsqueda Simplificada - Match Property
class BusquedaPage {
  constructor() {
    this.distritos = [];
    this.tiposInmuebles = [];
    this.filtrosSeleccionados = {
      distritos: [],
      tipo_inmueble_id: null,
      metraje: null,
      transaccion: 'compra',
      presupuesto: null
    };

    this.init();
  }

  async init() {
    await this.loadData();
    this.renderDistritos();
    this.renderTiposInmuebles();
    this.setupEventListeners();
    this.setupHamburgerMenu();
    this.setupPresupuestoDinamico();
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

  setupPresupuestoDinamico() {
    const radioCompra = document.querySelector('input[name="transaccion"][value="compra"]');
    const radioAlquiler = document.querySelector('input[name="transaccion"][value="alquiler"]');
    const labelPresupuesto = document.getElementById('labelPresupuesto');
    const inputPresupuesto = document.getElementById('presupuesto');
    const helperPresupuesto = document.getElementById('helperPresupuesto');

    const actualizarCampo = () => {
      const esCompra = radioCompra.checked;
      
      if (esCompra) {
        labelPresupuesto.textContent = '💰 Presupuesto Compra (USD)';
        inputPresupuesto.placeholder = '750,000';
        helperPresupuesto.textContent = '💡 Tolerancia ±15% (Sin IGV)';
      } else {
        labelPresupuesto.textContent = '💰 Presupuesto Alquiler (USD/mes)';
        inputPresupuesto.placeholder = '8,500';
        helperPresupuesto.textContent = '💡 Tolerancia ±15%';
      }

      // Actualizar valor en filtros
      this.filtrosSeleccionados.transaccion = esCompra ? 'compra' : 'alquiler';
    };

    radioCompra.addEventListener('change', actualizarCampo);
    radioAlquiler.addEventListener('change', actualizarCampo);
  }

  setupBackgroundChanger() {
    const tipoInmuebleSelect = document.getElementById('tipoInmueble');
    const filtrosCard = document.querySelector('.filtro-simplificado-card');

    if (!tipoInmuebleSelect || !filtrosCard) return;

    tipoInmuebleSelect.addEventListener('change', (e) => {
      // Remover el data-tipo previo
      filtrosCard.removeAttribute('data-tipo');

      const tipoId = e.target.value;
      if (!tipoId) return;

      // Buscar el tipo de inmueble en el array
      const tipoInmueble = this.tiposInmuebles.find(t => t.id == tipoId);
      if (!tipoInmueble) return;

      // Mapear nombre a slug para CSS
      const nombreLower = tipoInmueble.nombre.toLowerCase();
      let tipoSlug = '';

      if (nombreLower.includes('casa')) tipoSlug = 'casa';
      else if (nombreLower.includes('departamento')) tipoSlug = 'departamento';
      else if (nombreLower.includes('terreno')) tipoSlug = 'terreno';
      else if (nombreLower.includes('oficina')) tipoSlug = 'oficina';
      else if (nombreLower.includes('local')) tipoSlug = 'local';
      else if (nombreLower.includes('cochera') || nombreLower.includes('estacionamiento')) tipoSlug = 'cochera';

      if (tipoSlug) {
        filtrosCard.setAttribute('data-tipo', tipoSlug);
      }
    });
  }

  async loadData() {
    try {
      const [distritosRes, tiposRes] = await Promise.all([
        fetch('data/distritos.json'),
        fetch('data/tipos-inmuebles.json')
      ]);

      const distritosData = await distritosRes.json();
      const tiposData = await tiposRes.json();

      this.distritos = distritosData.distritos;
      this.tiposInmuebles = tiposData.tipos;
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
    });
  }

  setupEventListeners() {
    // Cambiar fondo según tipo de inmueble seleccionado
    this.setupBackgroundChanger();

    // Botón Hacer MATCH
    const btnHacerMatch = document.getElementById('btnHacerMatch');
    btnHacerMatch?.addEventListener('click', () => this.realizarBusqueda());

    // Input de metraje
    document.getElementById('metraje')?.addEventListener('input', (e) => {
      this.filtrosSeleccionados.metraje = e.target.value ? parseInt(e.target.value) : null;
    });

    // Input de presupuesto
    document.getElementById('presupuesto')?.addEventListener('input', (e) => {
      this.filtrosSeleccionados.presupuesto = e.target.value ? parseInt(e.target.value) : null;
    });
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

    // Preparar objeto de filtros para enviar
    const filtrosParaResultados = {
      distritos: this.filtrosSeleccionados.distritos,
      tipo_inmueble_id: this.filtrosSeleccionados.tipo_inmueble_id,
      metraje: this.filtrosSeleccionados.metraje,
      transaccion: this.filtrosSeleccionados.transaccion,
      presupuesto: this.filtrosSeleccionados.presupuesto
    };

    // Guardar filtros en localStorage
    localStorage.setItem('filtros_simplificados', JSON.stringify(filtrosParaResultados));

    // Redirigir a página de resultados
    window.location.href = 'resultados.html';
  }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
  new BusquedaPage();
});
