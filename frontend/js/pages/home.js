// Home Page - Match Property
class HomePage {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadTextos();
    this.renderFeatures();
    this.renderServices();
    this.renderFooter();
  }

  async loadTextos() {
    try {
      const response = await fetch('data/textos-landing.json');
      this.textos = await response.json();
    } catch (error) {
      console.error('Error cargando textos:', error);
    }
  }

  renderFeatures() {
    const grid = document.getElementById('featuresGrid');
    if (!grid || !this.textos) return;

    const html = this.textos.features.map(feature => `
      <div class="feature-card">
        <div class="feature-icon">${feature.icono}</div>
        <h3>${feature.titulo}</h3>
        <p>${feature.descripcion}</p>
      </div>
    `).join('');

    grid.innerHTML = html;
  }

  renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid || !this.textos) return;

    const html = this.textos.servicios.map(servicio => `
      <div class="service-card">
        <div class="service-icon">${servicio.icono}</div>
        <h3>${servicio.titulo}</h3>
      </div>
    `).join('');

    grid.innerHTML = html;
  }

  renderFooter() {
    if (!this.textos) return;

    // Misión en footer
    const misionEl = document.getElementById('footerMision');
    if (misionEl) {
      misionEl.textContent = this.textos.sobre.mision;
    }

    // Contacto en footer
    const direccionEl = document.getElementById('footerDireccion');
    const telefonoEl = document.getElementById('footerTelefono');
    const emailEl = document.getElementById('footerEmail');

    if (direccionEl) direccionEl.innerHTML = `📍 ${this.textos.contacto.direccion}`;
    if (telefonoEl) telefonoEl.innerHTML = `📞 ${this.textos.contacto.telefono}`;
    if (emailEl) emailEl.innerHTML = `📧 ${this.textos.contacto.email}`;
  }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
  new HomePage();
});
