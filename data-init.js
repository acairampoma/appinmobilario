// Data initializer: loads estructura_datos.json, maps it, updates globals, and fixes Fuse config
(function () {
  const YEAR_NOW = new Date().getFullYear();

  function mapJsonToProperties(items) {
    return items.map((it) => {
      const isVenta = it.operacion === 'venta';
      const price = isVenta ? (it.precioVenta ?? 0) : (it.precioAlquiler ?? 0);

      const parts = [];
      if (it.ubicacion?.distrito) parts.push(it.ubicacion.distrito);
      if (it.ubicacion?.provincia) parts.push(it.ubicacion.provincia);
      if (it.ubicacion?.departamento && !parts.includes(it.ubicacion.departamento))
        parts.push(it.ubicacion.departamento);
      const location = parts.join(', ');

      const area = it.areaConstruida ?? it.areaTerreno ?? it.area_total ?? 0;
      const year = it.antiguedad != null ? YEAR_NOW - Number(it.antiguedad) : (it.anio ?? YEAR_NOW);

      const caracteristicas = Array.isArray(it.caracteristicas)
        ? it.caracteristicas.map((c) => ({ id: c.caracteristicaId ?? c.id ?? 0, slug: c.slug, valor: c.valor }))
        : [];

      const images = Array.isArray(it.imagenes)
        ? it.imagenes
            .slice()
            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((img) => img.url)
        : [];

      let type = it.tipoInmueble;
      if (type === 'departamento') type = 'apartamento';

      return {
        id: it.id,
        type,
        operation: it.operacion,
        title: it.titulo,
        location,
        price,
        currency: it.moneda || 'USD',
        bedrooms: it.dormitorios ?? 0,
        bathrooms: it.banos ?? 0,
        area,
        year,
        condition: it.estado || '',
        description: it.descripcion || '',
        caracteristicas,
        images: images.length ? images : ['https://via.placeholder.com/800x600?text=Sin+Imagen'],
      };
    });
  }

  function fixedInitializeFuse() {
    if (typeof Fuse === 'undefined') return;
    if (!Array.isArray(sampleProperties)) return;
    fuseInstance = new Fuse(sampleProperties, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'location', weight: 1.5 },
        { name: 'type', weight: 1.2 },
        { name: 'operation', weight: 1 },
        { name: 'caracteristicas.slug', weight: 0.8 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }

  // Override hideLoading to respect currentView
  function overrideHideLoading() {
    if (typeof hideLoading === 'function') {
      const original = hideLoading;
      hideLoading = function () {
        original();
        try {
          const el = document.getElementById('propertiesContainer');
          if (el) el.style.display = (currentView === 'list') ? 'block' : 'grid';
        } catch (e) {}
      };
    }
  }

  async function loadData() {
    try {
      const resp = await fetch('estructura_datos.json', { cache: 'no-store' });
      if (!resp.ok) throw new Error('estructura_datos.json HTTP ' + resp.status);
      const json = await resp.json();
      if (Array.isArray(json?.propiedadesEjemplo)) {
        const mapped = mapJsonToProperties(json.propiedadesEjemplo);
        if (mapped.length) {
          // Replace in-memory dataset
          if (Array.isArray(sampleProperties)) {
            sampleProperties.length = 0;
            mapped.forEach((p) => sampleProperties.push(p));
          }
          filteredProperties = mapped.slice();

          // Rebuild Fuse with corrected keys
          fixedInitializeFuse();

          // Refresh UI if functions exist
          if (typeof renderProperties === 'function') renderProperties();
          if (typeof updateStats === 'function') updateStats();
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar estructura_datos.json, usando datos en duro:', err.message);
      // Ensure at least we fix Fuse keys and override hideLoading
      fixedInitializeFuse();
    } finally {
      overrideHideLoading();
    }
  }

  // Wait for DOM and app.js to be ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(loadData, 0);
  } else {
    document.addEventListener('DOMContentLoaded', loadData);
  }
})();
