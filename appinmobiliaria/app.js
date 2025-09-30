// Catálogo de características dinámicas
const caracteristicasCatalogo = [
    { id: 1, nombre: 'Piscina', slug: 'piscina', tipo: 'boolean', categoria: 'Amenidades', icono: 'fa-swimming-pool' },
    { id: 2, nombre: 'Garage', slug: 'garage', tipo: 'boolean', categoria: 'Estacionamiento', icono: 'fa-car' },
    { id: 3, nombre: 'Cocheras', slug: 'cocheras', tipo: 'number', categoria: 'Estacionamiento', icono: 'fa-car', unidad: 'unidades' },
    { id: 4, nombre: 'Jardín', slug: 'jardin', tipo: 'boolean', categoria: 'Amenidades', icono: 'fa-seedling' },
    { id: 5, nombre: 'Terraza', slug: 'terraza', tipo: 'boolean', categoria: 'Amenidades', icono: 'fa-tree' },
    { id: 6, nombre: 'Balcón', slug: 'balcon', tipo: 'boolean', categoria: 'Amenidades', icono: 'fa-building' },
    { id: 7, nombre: 'Amueblado', slug: 'amueblado', tipo: 'boolean', categoria: 'Estado', icono: 'fa-couch' },
    { id: 8, nombre: 'Ascensor', slug: 'ascensor', tipo: 'boolean', categoria: 'Edificio', icono: 'fa-elevator' },
    { id: 9, nombre: 'Seguridad 24hs', slug: 'seguridad_24hs', tipo: 'boolean', categoria: 'Seguridad', icono: 'fa-shield-alt' },
    { id: 10, nombre: 'Calefacción', slug: 'calefaccion', tipo: 'select', categoria: 'Climatización', icono: 'fa-fire', opciones: ['Gas', 'Eléctrica', 'Central', 'Individual'] },
    { id: 11, nombre: 'Aire Acondicionado', slug: 'aire_acondicionado', tipo: 'boolean', categoria: 'Climatización', icono: 'fa-wind' },
    { id: 12, nombre: 'Vista', slug: 'vista', tipo: 'select', categoria: 'Ubicación', icono: 'fa-eye', opciones: ['Mar', 'Montaña', 'Ciudad', 'Jardín', 'Calle'] },
    { id: 13, nombre: 'Orientación', slug: 'orientacion', tipo: 'select', categoria: 'Ubicación', icono: 'fa-compass', opciones: ['Norte', 'Sur', 'Este', 'Oeste', 'Noreste', 'Noroeste', 'Sureste', 'Suroeste'] },
    { id: 14, nombre: 'Mascotas', slug: 'mascotas', tipo: 'boolean', categoria: 'Políticas', icono: 'fa-dog' },
    { id: 15, nombre: 'Gimnasio', slug: 'gimnasio', tipo: 'boolean', categoria: 'Amenidades', icono: 'fa-dumbbell' },
    { id: 16, nombre: 'Quincho', slug: 'quincho', tipo: 'boolean', categoria: 'Amenidades', icono: 'fa-fire' },
    { id: 17, nombre: 'Sum', slug: 'sum', tipo: 'boolean', categoria: 'Amenidades', icono: 'fa-users' },
    { id: 18, nombre: 'Antigüedad', slug: 'antiguedad', tipo: 'number', categoria: 'Construcción', icono: 'fa-calendar', unidad: 'años' }
];

// Datos de ejemplo basados en estructura típica de inmobiliarias
const sampleProperties = [
    {
        id: 1,
        type: 'apartamento',
        operation: 'venta',
        title: 'Moderno Apartamento en Palermo',
        location: 'Palermo, Buenos Aires',
        price: 280000,
        currency: 'USD',
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        year: 2020,
        condition: 'excelente',
        description: 'Hermoso apartamento con vista panorámica y todas las comodidades. Ideal para parejas o familias pequeñas. Zona céntrica con todos los servicios.',
        caracteristicas: [
            { id: 2, slug: 'garage', valor: true },
            { id: 5, slug: 'terraza', valor: true },
            { id: 7, slug: 'amueblado', valor: true },
            { id: 8, slug: 'ascensor', valor: true },
            { id: 11, slug: 'aire_acondicionado', valor: true },
            { id: 3, slug: 'cocheras', valor: 1 },
            { id: 10, slug: 'calefaccion', valor: 'Central' },
            { id: 12, slug: 'vista', valor: 'Ciudad' }
        ],
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'
        ]
    },
    {
        id: 2,
        type: 'casa',
        operation: 'venta',
        title: 'Casa Familiar en San Isidro',
        location: 'San Isidro, Buenos Aires',
        price: 450000,
        currency: 'USD',
        bedrooms: 4,
        bathrooms: 3,
        area: 220,
        year: 2015,
        condition: 'muy-bueno',
        description: 'Amplia casa familiar con jardín y piscina. Perfecta para familias que buscan espacio y confort. Barrio residencial tranquilo.',
        caracteristicas: [
            { id: 1, slug: 'piscina', valor: true },
            { id: 4, slug: 'jardin', valor: true },
            { id: 2, slug: 'garage', valor: true },
            { id: 3, slug: 'cocheras', valor: 3 },
            { id: 11, slug: 'aire_acondicionado', valor: true },
            { id: 10, slug: 'calefaccion', valor: 'Gas' },
            { id: 16, slug: 'quincho', valor: true },
            { id: 9, slug: 'seguridad_24hs', valor: true },
            { id: 18, slug: 'antiguedad', valor: 9 }
        ],
        images: [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
        ]
    },
    {
        id: 3,
        type: 'oficina',
        operation: 'alquiler',
        title: 'Oficina Premium en Puerto Madero',
        location: 'Puerto Madero, Buenos Aires',
        price: 2500,
        currency: 'USD',
        bedrooms: 0,
        bathrooms: 2,
        area: 120,
        year: 2018,
        condition: 'excelente',
        description: 'Oficina premium en el corazón financiero. Completamente equipada y lista para trabajar. Excelente conectividad.',
        caracteristicas: [
            { id: 8, slug: 'ascensor', valor: true },
            { id: 7, slug: 'amueblado', valor: true },
            { id: 11, slug: 'aire_acondicionado', valor: true },
            { id: 9, slug: 'seguridad_24hs', valor: true },
            { id: 12, slug: 'vista', valor: 'Ciudad' }
        ],
        images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
        ]
    },
    {
        id: 4,
        type: 'apartamento',
        operation: 'alquiler',
        title: 'Loft en Barracas',
        location: 'Barracas, Buenos Aires',
        price: 800,
        currency: 'USD',
        bedrooms: 1,
        bathrooms: 1,
        area: 60,
        year: 2019,
        condition: 'nuevo',
        description: 'Loft moderno estilo industrial con terraza privada. Ideal para jóvenes profesionales. Zona emergente con excelentes servicios.',
        caracteristicas: [
            { id: 5, slug: 'terraza', valor: true },
            { id: 7, slug: 'amueblado', valor: true },
            { id: 11, slug: 'aire_acondicionado', valor: true },
            { id: 10, slug: 'calefaccion', valor: 'Eléctrica' },
            { id: 18, slug: 'antiguedad', valor: 5 }
        ],
        images: [
            'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560185127-6a6f4f8b8c0e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop'
        ]
    },
    {
        id: 5,
        type: 'local',
        operation: 'alquiler',
        title: 'Local Comercial en Microcentro',
        location: 'Microcentro, Buenos Aires',
        price: 1500,
        currency: 'USD',
        bedrooms: 0,
        bathrooms: 1,
        area: 80,
        year: 2010,
        condition: 'bueno',
        description: 'Local comercial con excelente ubicación y alto tránsito peatonal. Perfecto para cualquier tipo de comercio.',
        caracteristicas: [
            { id: 11, slug: 'aire_acondicionado', valor: true },
            { id: 18, slug: 'antiguedad', valor: 14 }
        ],
        images: [
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&h=600&fit=crop'
        ]
    },
    {
        id: 6,
        type: 'casa',
        operation: 'venta',
        title: 'Chalet en Vicente López',
        location: 'Vicente López, Buenos Aires',
        price: 380000,
        currency: 'USD',
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        year: 2012,
        condition: 'muy-bueno',
        description: 'Hermoso chalet con amplio jardín, piscina y quincho. Perfecto para disfrutar en familia. Barrio seguro y tranquilo.',
        caracteristicas: [
            { id: 4, slug: 'jardin', valor: true },
            { id: 2, slug: 'garage', valor: true },
            { id: 1, slug: 'piscina', valor: true },
            { id: 3, slug: 'cocheras', valor: 2 },
            { id: 16, slug: 'quincho', valor: true },
            { id: 11, slug: 'aire_acondicionado', valor: true },
            { id: 10, slug: 'calefaccion', valor: 'Central' },
            { id: 14, slug: 'mascotas', valor: true },
            { id: 18, slug: 'antiguedad', valor: 12 }
        ],
        images: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop'
        ]
    }
];

let filteredProperties = [...sampleProperties];
let currentView = 'grid';
let fuseInstance = null;
let lastDetectedParams = null;
let currentImageIndex = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    renderProperties();
    setupEventListeners();
    updateStats();
    generateDynamicFilters();
    initializeFuse();
    setupSmartSearch();
});

// Inicializar Fuse.js
function initializeFuse() {
    fuseInstance = new Fuse(sampleProperties, {
        keys: [
            { name: 'titulo', weight: 2 },
            { name: 'descripcion', weight: 1 },
            { name: 'ubicacion.distrito', weight: 1.5 },
            { name: 'ubicacion.provincia', weight: 1 },
            { name: 'type', weight: 1.2 },
            { name: 'caracteristicas.slug', weight: 0.8 }
        ],
        threshold: 0.4,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true
    });
}

// Configurar búsqueda inteligente
function setupSmartSearch() {
    const searchInput = document.getElementById('mainSearch');
    const suggestionsBox = document.getElementById('searchSuggestions');

    // Búsqueda en tiempo real con debounce
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (query.length >= 3) {
            searchTimeout = setTimeout(() => {
                showQuickSuggestions(query);
            }, 300);
        } else {
            suggestionsBox.style.display = 'none';
        }
    });

    // Ejecutar búsqueda al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSmartSearch();
            suggestionsBox.style.display = 'none';
        }
    });

    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

// Mostrar sugerencias rápidas
function showQuickSuggestions(query) {
    const results = fuseInstance.search(query).slice(0, 5);
    const suggestionsBox = document.getElementById('searchSuggestions');

    if (results.length > 0) {
        let html = '';
        results.forEach(result => {
            const prop = result.item;
            html += `
                <div class="suggestion-item" onclick="selectProperty(${prop.id})">
                    <i class="fas ${getTypeIcon(prop.type)} suggestion-icon"></i>
                    <strong>${prop.title}</strong>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 3px;">
                        ${prop.location} · ${formatPrice(prop.price, prop.currency)}
                    </div>
                </div>
            `;
        });
        suggestionsBox.innerHTML = html;
        suggestionsBox.style.display = 'block';
    } else {
        suggestionsBox.style.display = 'none';
    }
}

function selectProperty(id) {
    showPropertyDetails(id);
    document.getElementById('searchSuggestions').style.display = 'none';
}

function getTypeIcon(type) {
    const icons = {
        'apartamento': 'fa-building',
        'casa': 'fa-home',
        'oficina': 'fa-briefcase',
        'local': 'fa-store',
        'terreno': 'fa-mountain'
    };
    return icons[type] || 'fa-home';
}

// Generar filtros dinámicos basados en el catálogo de características
function generateDynamicFilters() {
    const container = document.getElementById('dynamicFilters');
    const categorias = {};

    // Agrupar características por categoría
    caracteristicasCatalogo.forEach(car => {
        if (!categorias[car.categoria]) {
            categorias[car.categoria] = [];
        }
        categorias[car.categoria].push(car);
    });

    let html = '';

    // Generar filtros por categoría
    Object.keys(categorias).forEach(categoria => {
        const caracteristicas = categorias[categoria];

        html += `<div class="filter-group">`;
        html += `<label><i class="fas fa-tags"></i> ${categoria}</label>`;

        // Características booleanas como checkboxes
        const booleans = caracteristicas.filter(c => c.tipo === 'boolean');
        if (booleans.length > 0) {
            html += `<div class="checkbox-group">`;
            booleans.forEach(car => {
                html += `
                    <div class="checkbox-item" data-caracteristica="${car.slug}" data-tipo="boolean">
                        <i class="fas ${car.icono}"></i> ${car.nombre}
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Características numéricas como inputs de rango
        const numbers = caracteristicas.filter(c => c.tipo === 'number');
        numbers.forEach(car => {
            html += `
                <div style="margin-top: 10px;">
                    <label style="font-size: 14px; font-weight: 400;">${car.nombre} ${car.unidad ? `(${car.unidad})` : ''}</label>
                    <div class="filter-row">
                        <input type="number" class="filter-input" placeholder="Mín." data-caracteristica="${car.slug}" data-tipo="number-min">
                        <input type="number" class="filter-input" placeholder="Máx." data-caracteristica="${car.slug}" data-tipo="number-max">
                    </div>
                </div>
            `;
        });

        // Características de selección como dropdowns
        const selects = caracteristicas.filter(c => c.tipo === 'select');
        selects.forEach(car => {
            html += `
                <div style="margin-top: 10px;">
                    <label style="font-size: 14px; font-weight: 400;">${car.nombre}</label>
                    <select class="filter-input" data-caracteristica="${car.slug}" data-tipo="select">
                        <option value="">Cualquiera</option>
                        ${car.opciones.map(op => `<option value="${op}">${op}</option>`).join('')}
                    </select>
                </div>
            `;
        });

        html += `</div>`;
    });

    container.innerHTML = html;

    // Agregar event listeners a los nuevos checkboxes
    container.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });

    // Checkbox items
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Real-time search
    document.getElementById('mainSearch').addEventListener('input', debounce(performSearch, 300));

    // Modal events
    document.getElementById('propertyModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

function switchView(viewType) {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewType}"]`).classList.add('active');

    currentView = viewType;
    renderProperties();
}

function applyFilters() {
    showLoading();

    setTimeout(() => {
        const filters = getActiveFilters();
        filteredProperties = sampleProperties.filter(property => {
            return matchesFilters(property, filters);
        });

        renderProperties();
        updateStats();
        hideLoading();
        showNotification(`Se encontraron ${filteredProperties.length} propiedades`);
    }, 500);
}

function getActiveFilters() {
    const filters = {
        operation: document.getElementById('operationType').value,
        location: document.getElementById('location').value.toLowerCase(),
        priceMin: parseFloat(document.getElementById('priceMin').value) || 0,
        priceMax: parseFloat(document.getElementById('priceMax').value) || Infinity,
        bedrooms: document.getElementById('bedrooms').value,
        bathrooms: document.getElementById('bathrooms').value,
        areaMin: parseFloat(document.getElementById('areaMin').value) || 0,
        areaMax: parseFloat(document.getElementById('areaMax').value) || Infinity,
        yearFrom: parseInt(document.getElementById('yearFrom').value) || 0,
        yearTo: parseInt(document.getElementById('yearTo').value) || new Date().getFullYear(),
        condition: document.getElementById('condition').value,
        types: [],
        caracteristicas: {}
    };

    // Get selected property types
    document.querySelectorAll('.checkbox-item[data-type].active').forEach(item => {
        filters.types.push(item.getAttribute('data-type'));
    });

    // Get selected características booleanas
    document.querySelectorAll('.checkbox-item[data-caracteristica].active').forEach(item => {
        const slug = item.getAttribute('data-caracteristica');
        filters.caracteristicas[slug] = { tipo: 'boolean', valor: true };
    });

    // Get características numéricas (rangos)
    document.querySelectorAll('input[data-tipo="number-min"]').forEach(input => {
        const slug = input.getAttribute('data-caracteristica');
        const min = parseFloat(input.value);
        if (!isNaN(min)) {
            if (!filters.caracteristicas[slug]) {
                filters.caracteristicas[slug] = { tipo: 'number' };
            }
            filters.caracteristicas[slug].min = min;
        }
    });

    document.querySelectorAll('input[data-tipo="number-max"]').forEach(input => {
        const slug = input.getAttribute('data-caracteristica');
        const max = parseFloat(input.value);
        if (!isNaN(max)) {
            if (!filters.caracteristicas[slug]) {
                filters.caracteristicas[slug] = { tipo: 'number' };
            }
            filters.caracteristicas[slug].max = max;
        }
    });

    // Get características de selección
    document.querySelectorAll('select[data-caracteristica]').forEach(select => {
        const slug = select.getAttribute('data-caracteristica');
        const value = select.value;
        if (value) {
            filters.caracteristicas[slug] = { tipo: 'select', valor: value };
        }
    });

    return filters;
}

function matchesFilters(property, filters) {
    // Operation type
    if (filters.operation && property.operation !== filters.operation) {
        return false;
    }

    // Location
    if (filters.location && !property.location.toLowerCase().includes(filters.location)) {
        return false;
    }

    // Price range
    if (property.price < filters.priceMin || property.price > filters.priceMax) {
        return false;
    }

    // Bedrooms
    if (filters.bedrooms && property.bedrooms !== parseInt(filters.bedrooms)) {
        return false;
    }

    // Bathrooms
    if (filters.bathrooms && property.bathrooms !== parseInt(filters.bathrooms)) {
        return false;
    }

    // Area
    if (property.area < filters.areaMin || property.area > filters.areaMax) {
        return false;
    }

    // Year
    if (property.year < filters.yearFrom || property.year > filters.yearTo) {
        return false;
    }

    // Condition
    if (filters.condition && property.condition !== filters.condition) {
        return false;
    }

    // Property types
    if (filters.types.length > 0 && !filters.types.includes(property.type)) {
        return false;
    }

    // Características dinámicas
    for (const slug in filters.caracteristicas) {
        const filterCar = filters.caracteristicas[slug];
        const propertyCar = property.caracteristicas.find(c => c.slug === slug);

        if (filterCar.tipo === 'boolean') {
            // Para booleanos, verificar que exista y sea true
            if (!propertyCar || !propertyCar.valor) {
                return false;
            }
        } else if (filterCar.tipo === 'number') {
            // Para numéricos, verificar rangos
            if (!propertyCar) return false;
            if (filterCar.min !== undefined && propertyCar.valor < filterCar.min) {
                return false;
            }
            if (filterCar.max !== undefined && propertyCar.valor > filterCar.max) {
                return false;
            }
        } else if (filterCar.tipo === 'select') {
            // Para selects, verificar valor exacto
            if (!propertyCar || propertyCar.valor !== filterCar.valor) {
                return false;
            }
        }
    }

    return true;
}

// BÚSQUEDA INTELIGENTE CON NLP
function performSmartSearch() {
    const query = document.getElementById('mainSearch').value.trim();

    if (!query) {
        filteredProperties = [...sampleProperties];
        renderProperties();
        updateStats();
        return;
    }

    showLoading();

    setTimeout(() => {
        // 1. Detectar parámetros de la consulta
        const params = detectSearchParams(query);
        lastDetectedParams = params;

        // 2. Mostrar parámetros detectados
        displayDetectedParams(params);

        // 3. Buscar con Fuse.js
        let results = fuseInstance.search(query).map(r => r.item);

        // 4. Aplicar filtros detectados
        results = applyDetectedParams(results, params);

        // 5. Generar sugerencias inteligentes
        const suggestions = generateSmartSuggestions(params, results);
        displaySmartSuggestions(suggestions);

        // 6. Mostrar resultados
        filteredProperties = results;
        renderProperties();
        updateStats();
        hideLoading();

        showNotification(`Encontramos ${results.length} propiedades que coinciden con tu búsqueda`);
    }, 500);
}

// Detectar parámetros de búsqueda mediante NLP simple
function detectSearchParams(query) {
    const q = query.toLowerCase();
    const params = {
        original: query,
        tipoInmueble: null,
        distritos: [],
        caracteristicas: [],
        precioMin: null,
        precioMax: null,
        dormitorios: null,
        banos: null,
        operacion: null
    };

    // Detectar tipo de inmueble
    const tipos = {
        'apartamento': ['apartamento', 'depa', 'departamento', 'piso', 'flat'],
        'casa': ['casa', 'casas', 'chalet', 'vivienda', 'residencia'],
        'oficina': ['oficina', 'oficinas', 'consultorio'],
        'local': ['local', 'local comercial', 'tienda'],
        'terreno': ['terreno', 'lote', 'tierra']
    };

    for (const [tipo, palabras] of Object.entries(tipos)) {
        if (palabras.some(p => q.includes(p))) {
            params.tipoInmueble = tipo;
            break;
        }
    }

    // Detectar distritos de Lima
    const distritos = {
        'miraflores': ['miraflores', 'miraflore'],
        'san isidro': ['san isidro', 'sanisidro', 'isidro'],
        'surco': ['surco', 'santiago de surco'],
        'la molina': ['la molina', 'molina'],
        'san borja': ['san borja', 'sanborja', 'borja'],
        'barranco': ['barranco'],
        'jesús maría': ['jesus maria', 'jesús maría'],
        'lince': ['lince'],
        'magdalena': ['magdalena'],
        'pueblo libre': ['pueblo libre'],
        'callao': ['callao'],
        'chorrillos': ['chorrillos']
    };

    for (const [distrito, variantes] of Object.entries(distritos)) {
        if (variantes.some(v => q.includes(v))) {
            params.distritos.push(distrito);
        }
    }

    // Detectar características
    const caracteristicas = {
        'piscina': ['piscina', 'pool', 'alberca'],
        'jardin': ['jardín', 'jardin', 'garden', 'área verde'],
        'garage': ['garage', 'cochera', 'estacionamiento', 'parking'],
        'terraza': ['terraza', 'balcón', 'balcon'],
        'ascensor': ['ascensor', 'elevador', 'lift'],
        'amueblado': ['amueblado', 'amoblado', 'muebles', 'equipado'],
        'aire_acondicionado': ['aire', 'aire acondicionado', 'a/c', 'climatizado'],
        'seguridad_24hs': ['seguridad', 'vigilancia', 'custodia', 'guardian'],
        'gimnasio': ['gimnasio', 'gym', 'fitness'],
        'quincho': ['quincho', 'parrilla', 'bbq']
    };

    for (const [slug, palabras] of Object.entries(caracteristicas)) {
        if (palabras.some(p => q.includes(p))) {
            params.caracteristicas.push(slug);
        }
    }

    // Detectar operación
    if (q.includes('alquiler') || q.includes('alquilar') || q.includes('rentar')) {
        params.operacion = 'alquiler';
    } else if (q.includes('venta') || q.includes('comprar') || q.includes('vender')) {
        params.operacion = 'venta';
    }

    // Detectar números (dormitorios, precios)
    const numeros = q.match(/\d+/g);
    if (numeros) {
        numeros.forEach(num => {
            const valor = parseInt(num);

            // Detectar dormitorios (1-10)
            if ((q.includes('dormitorio') || q.includes('habitacion') || q.includes('cuarto')) &&
                valor >= 1 && valor <= 10) {
                params.dormitorios = valor;
            }
            // Detectar baños (1-10)
            else if (q.includes('baño') && valor >= 1 && valor <= 10) {
                params.banos = valor;
            }
            // Detectar precio (asumimos miles o millones)
            else if (valor >= 100) {
                if (q.includes('mil') || q.includes('k')) {
                    const precio = valor * 1000;
                    if (q.includes('hasta') || q.includes('máximo') || q.includes('max')) {
                        params.precioMax = precio;
                    } else if (q.includes('desde') || q.includes('mínimo') || q.includes('min')) {
                        params.precioMin = precio;
                    } else {
                        params.precioMax = precio;
                    }
                } else if (q.includes('millón') || q.includes('millon') || q.includes('m')) {
                    const precio = valor * 1000000;
                    params.precioMax = precio;
                } else if (valor >= 50000) {
                    // Asumir que es precio directo
                    if (q.includes('hasta') || q.includes('máximo')) {
                        params.precioMax = valor;
                    } else {
                        params.precioMax = valor;
                    }
                }
            }
        });
    }

    return params;
}

// Aplicar parámetros detectados a los resultados
function applyDetectedParams(results, params) {
    let filtered = results;

    if (params.tipoInmueble) {
        filtered = filtered.filter(p => p.type === params.tipoInmueble);
    }

    if (params.distritos.length > 0) {
        filtered = filtered.filter(p =>
            params.distritos.some(d =>
                p.location.toLowerCase().includes(d)
            )
        );
    }

    if (params.operacion) {
        filtered = filtered.filter(p => p.operation === params.operacion);
    }

    if (params.precioMax) {
        filtered = filtered.filter(p => p.price <= params.precioMax);
    }

    if (params.precioMin) {
        filtered = filtered.filter(p => p.price >= params.precioMin);
    }

    if (params.dormitorios) {
        filtered = filtered.filter(p => p.bedrooms >= params.dormitorios);
    }

    if (params.banos) {
        filtered = filtered.filter(p => p.bathrooms >= params.banos);
    }

    if (params.caracteristicas.length > 0) {
        filtered = filtered.filter(p =>
            params.caracteristicas.every(car =>
                p.caracteristicas.some(c => c.slug === car && c.valor)
            )
        );
    }

    return filtered;
}

function performSearch() {
    performSmartSearch();
}

function renderProperties() {
    const container = document.getElementById('propertiesContainer');

    if (filteredProperties.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 10px;">No se encontraron propiedades</h3>
                <p style="color: var(--text-secondary);">Prueba ajustando los filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    let html = '';

    filteredProperties.forEach(property => {
        html += currentView === 'grid' ? renderPropertyCard(property) : renderPropertyListItem(property);
    });

    container.innerHTML = html;

    // Update grid class based on view
    if (currentView === 'list') {
        container.className = 'properties-list';
    } else {
        container.className = 'properties-grid';
    }
}

function renderPropertyCard(property) {
    const formatPrice = (price, currency) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency === 'USD' ? 'USD' : 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getTypeIcon = (type) => {
        const icons = {
            'apartamento': 'fas fa-building',
            'casa': 'fas fa-home',
            'oficina': 'fas fa-briefcase',
            'local': 'fas fa-store',
            'terreno': 'fas fa-mountain'
        };
        return icons[type] || 'fas fa-home';
    };

    const getOperationBadge = (operation) => {
        const badges = {
            'venta': { text: 'En Venta', class: 'success' },
            'alquiler': { text: 'Alquiler', class: 'warning' },
            'temporal': { text: 'Temporal', class: 'info' }
        };
        const badge = badges[operation] || badges['venta'];
        return `<div class="property-badge" style="background: var(--${badge.class}-color);">${badge.text}</div>`;
    };

    return `
        <div class="property-card" onclick="showPropertyDetails(${property.id})">
            <div class="property-image">
                <img src="${property.images[0]}" alt="${property.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x600?text=Imagen+No+Disponible'">
                <div class="property-type">
                    <i class="${getTypeIcon(property.type)}"></i>
                    ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </div>
                ${getOperationBadge(property.operation)}
            </div>
            <div class="property-details">
                <div class="property-price">${formatPrice(property.price, property.currency)}</div>
                <div class="property-title">${property.title}</div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                <div class="property-features">
                    ${property.bedrooms > 0 ? `<div class="feature"><i class="fas fa-bed"></i> ${property.bedrooms} hab.</div>` : ''}
                    <div class="feature"><i class="fas fa-bath"></i> ${property.bathrooms} baños</div>
                    <div class="feature"><i class="fas fa-ruler-combined"></i> ${property.area} m²</div>
                    <div class="feature"><i class="fas fa-calendar"></i> ${property.year}</div>
                </div>
                <div class="property-features" style="border-top: 1px solid var(--border-color); padding-top: 10px; margin-top: 10px;">
                    ${property.caracteristicas.slice(0, 5).map(car => {
                        const catalogoCar = caracteristicasCatalogo.find(c => c.slug === car.slug);
                        if (!catalogoCar) return '';
                        if (catalogoCar.tipo === 'boolean' && car.valor) {
                            return `<div class="feature" title="${catalogoCar.nombre}"><i class="fas ${catalogoCar.icono}"></i></div>`;
                        } else if (catalogoCar.tipo === 'number') {
                            return `<div class="feature" title="${catalogoCar.nombre}"><i class="fas ${catalogoCar.icono}"></i> ${car.valor}</div>`;
                        }
                        return '';
                    }).join('')}
                    ${property.caracteristicas.length > 5 ? `<div class="feature">+${property.caracteristicas.length - 5}</div>` : ''}
                </div>
                <div class="property-actions">
                    <button class="btn-primary" onclick="event.stopPropagation(); contactProperty(${property.id})">
                        <i class="fas fa-phone"></i> Contactar
                    </button>
                    <button class="btn-secondary" onclick="event.stopPropagation(); saveProperty(${property.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPropertyListItem(property) {
    // Similar structure but in list format
    return `
        <div class="property-list-item" style="display: flex; background: white; border-radius: 15px; margin-bottom: 20px; overflow: hidden; box-shadow: var(--shadow-md);">
            <div style="width: 200px; height: 150px; flex-shrink: 0; overflow: hidden;">
                <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'">
            </div>
            <div style="padding: 20px; flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div>
                        <div class="property-price">${new Intl.NumberFormat('es-AR', {style: 'currency', currency: 'USD'}).format(property.price)}</div>
                        <div class="property-title">${property.title}</div>
                    </div>
                    <div class="property-badge" style="background: var(--success-color);">${property.operation}</div>
                </div>
                <div class="property-location" style="margin-bottom: 15px;">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </div>
                <div class="property-features">
                    ${property.bedrooms > 0 ? `<div class="feature"><i class="fas fa-bed"></i> ${property.bedrooms} hab.</div>` : ''}
                    <div class="feature"><i class="fas fa-bath"></i> ${property.bathrooms} baños</div>
                    <div class="feature"><i class="fas fa-ruler-combined"></i> ${property.area} m²</div>
                </div>
            </div>
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 10px; justify-content: center;">
                <button class="btn-primary" onclick="contactProperty(${property.id})">Contactar</button>
                <button class="btn-secondary" onclick="saveProperty(${property.id})">Guardar</button>
            </div>
        </div>
    `;
}

function showPropertyDetails(id) {
    const property = sampleProperties.find(p => p.id === id);
    if (!property) return;

    currentImageIndex = 0;
    const modal = document.getElementById('propertyModal');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
        <div>
            <div class="image-gallery">
                <button class="gallery-nav prev" onclick="event.stopPropagation(); changeImage(${property.id}, -1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <img src="${property.images[0]}" alt="${property.title}" class="gallery-main-image" id="mainImage">
                <button class="gallery-nav next" onclick="event.stopPropagation(); changeImage(${property.id}, 1)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="gallery-thumbnails">
                ${property.images.map((img, index) => `
                    <img src="${img}"
                         alt="Vista ${index + 1}"
                         class="gallery-thumbnail ${index === 0 ? 'active' : ''}"
                         onclick="event.stopPropagation(); selectImage(${property.id}, ${index})"
                         data-index="${index}">
                `).join('')}
            </div>
            <div style="margin-bottom: 25px;">
            <h2>${property.title}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 15px;">
                <i class="fas fa-map-marker-alt"></i> ${property.location}
            </p>
            <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">
                ${new Intl.NumberFormat('es-AR', {style: 'currency', currency: property.currency}).format(property.price)}
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
            <div style="text-align: center; padding: 15px; background: var(--bg-secondary); border-radius: 10px;">
                <i class="fas fa-bed" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 5px;"></i>
                <div>${property.bedrooms} Habitaciones</div>
            </div>
            <div style="text-align: center; padding: 15px; background: var(--bg-secondary); border-radius: 10px;">
                <i class="fas fa-bath" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 5px;"></i>
                <div>${property.bathrooms} Baños</div>
            </div>
            <div style="text-align: center; padding: 15px; background: var(--bg-secondary); border-radius: 10px;">
                <i class="fas fa-ruler-combined" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 5px;"></i>
                <div>${property.area} m²</div>
            </div>
            <div style="text-align: center; padding: 15px; background: var(--bg-secondary); border-radius: 10px;">
                <i class="fas fa-calendar" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 5px;"></i>
                <div>Año ${property.year}</div>
            </div>
        </div>

        ${property.caracteristicas && property.caracteristicas.length > 0 ? `
            <div style="margin-bottom: 25px;">
                <h3 style="margin-bottom: 15px;">Características</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                    ${property.caracteristicas.map(car => {
                        const catalogoCar = caracteristicasCatalogo.find(c => c.slug === car.slug);
                        if (!catalogoCar) return '';

                        let valorDisplay = '';
                        if (catalogoCar.tipo === 'boolean' && car.valor) {
                            valorDisplay = '<i class="fas fa-check" style="color: var(--success-color);"></i>';
                        } else if (catalogoCar.tipo === 'number') {
                            valorDisplay = `${car.valor} ${catalogoCar.unidad || ''}`;
                        } else if (catalogoCar.tipo === 'select') {
                            valorDisplay = car.valor;
                        } else {
                            return '';
                        }

                        return `
                            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--bg-secondary); border-radius: 10px;">
                                <i class="fas ${catalogoCar.icono}" style="color: var(--primary-color); font-size: 1.2rem;"></i>
                                <div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">${catalogoCar.nombre}</div>
                                    <div style="font-weight: 600;">${valorDisplay}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        ` : ''}

        <div style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 10px;">Descripción</h3>
            <p>${property.description}</p>
        </div>

        <div style="display: flex; gap: 15px;">
            <button class="btn-primary" style="flex: 1;" onclick="contactProperty(${property.id})">
                <i class="fas fa-phone"></i> Contactar Agente
            </button>
            <button class="btn-secondary" onclick="saveProperty(${property.id})">
                <i class="fas fa-heart"></i> Guardar
            </button>
            <button class="btn-secondary" onclick="shareProperty(${property.id})">
                <i class="fas fa-share"></i> Compartir
            </button>
        </div>
    `;

    modal.style.display = 'block';
}

function changeImage(propertyId, direction) {
    const property = sampleProperties.find(p => p.id === propertyId);
    if (!property) return;

    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = property.images.length - 1;
    if (currentImageIndex >= property.images.length) currentImageIndex = 0;

    const mainImage = document.getElementById('mainImage');
    mainImage.src = property.images[currentImageIndex];

    // Update thumbnails
    document.querySelectorAll('.gallery-thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function selectImage(propertyId, index) {
    const property = sampleProperties.find(p => p.id === propertyId);
    if (!property) return;

    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    mainImage.src = property.images[index];

    // Update thumbnails
    document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function closeModal() {
    document.getElementById('propertyModal').style.display = 'none';
    currentImageIndex = 0;
}

function contactProperty(id) {
    showNotification('Contacto iniciado. El agente se comunicará contigo pronto.');
}

function saveProperty(id) {
    showNotification('Propiedad guardada en tus favoritos.');
}

function shareProperty(id) {
    showNotification('Link de la propiedad copiado al portapapeles.');
}

// Mostrar parámetros detectados
function displayDetectedParams(params) {
    const container = document.getElementById('detectedParams');
    let badges = [];

    if (params.tipoInmueble) {
        badges.push(`<span class="param-badge"><i class="fas fa-home"></i> ${params.tipoInmueble}</span>`);
    }

    params.distritos.forEach(d => {
        badges.push(`<span class="param-badge"><i class="fas fa-map-marker-alt"></i> ${d}</span>`);
    });

    if (params.operacion) {
        badges.push(`<span class="param-badge"><i class="fas fa-tag"></i> ${params.operacion}</span>`);
    }

    if (params.dormitorios) {
        badges.push(`<span class="param-badge"><i class="fas fa-bed"></i> ${params.dormitorios}+ dorm.</span>`);
    }

    if (params.banos) {
        badges.push(`<span class="param-badge"><i class="fas fa-bath"></i> ${params.banos}+ baños</span>`);
    }

    if (params.precioMax) {
        const precio = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(params.precioMax);
        badges.push(`<span class="param-badge"><i class="fas fa-dollar-sign"></i> hasta ${precio}</span>`);
    }

    params.caracteristicas.forEach(car => {
        const carInfo = caracteristicasCatalogo.find(c => c.slug === car);
        if (carInfo) {
            badges.push(`<span class="param-badge"><i class="fas ${carInfo.icono}"></i> ${carInfo.nombre}</span>`);
        }
    });

    if (badges.length > 0) {
        container.innerHTML = `
            <div class="detected-params">
                <strong style="margin-right: 10px;"><i class="fas fa-brain"></i> Entendí que buscas:</strong>
                ${badges.join('')}
            </div>
        `;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// Generar sugerencias inteligentes
function generateSmartSuggestions(params, results) {
    const suggestions = [];

    // Sugerir zonas alternativas
    if (params.distritos.length > 0) {
        const zonasAlternativas = {
            'miraflores': ['Barranco', 'San Isidro', 'Surco'],
            'surco': ['La Molina', 'San Borja', 'Monterrico'],
            'san isidro': ['Miraflores', 'San Borja', 'Jesús María'],
            'la molina': ['Surco', 'Ate', 'Chacarilla'],
            'barranco': ['Miraflores', 'Chorrillos']
        };

        params.distritos.forEach(d => {
            if (zonasAlternativas[d]) {
                suggestions.push(`¿También te interesa buscar en ${zonasAlternativas[d].join(', ')}?`);
            }
        });
    }

    // Sugerir características adicionales
    if (params.caracteristicas.includes('piscina') && !params.caracteristicas.includes('jardin')) {
        suggestions.push('Las propiedades con piscina suelen tener jardín. ¿Te gustaría verlas?');
    }

    if (params.caracteristicas.includes('jardin') && !params.caracteristicas.includes('quincho')) {
        suggestions.push('¿Te interesa que tenga quincho o parrilla para reuniones?');
    }

    if (params.tipoInmueble === 'casa' && !params.caracteristicas.includes('garage')) {
        suggestions.push('¿Es importante que tenga cochera/garage?');
    }

    // Sugerir ajuste de precio
    if (params.precioMax && results.length < 5) {
        const propiedadesCercanas = sampleProperties.filter(p =>
            p.price > params.precioMax &&
            p.price <= params.precioMax * 1.15
        );

        if (propiedadesCercanas.length > 0) {
            const nuevoPrecio = new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            }).format(params.precioMax * 1.15);
            suggestions.push(`Hay ${propiedadesCercanas.length} propiedades excelentes aumentando tu presupuesto a ${nuevoPrecio}`);
        }
    }

    // Sugerir más dormitorios si no hay muchos resultados
    if (params.dormitorios && results.length < 3) {
        suggestions.push(`¿Considerarías propiedades con ${params.dormitorios - 1} dormitorios? Tenemos más opciones.`);
    }

    return suggestions;
}

// Mostrar sugerencias inteligentes
function displaySmartSuggestions(suggestions) {
    const container = document.getElementById('smartSuggestions');

    if (suggestions.length > 0) {
        container.innerHTML = `
            <div class="smart-suggestions">
                <h4><i class="fas fa-lightbulb"></i> Sugerencias para ti:</h4>
                <ul>
                    ${suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        `;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

function formatPrice(price, currency) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function clearFilters() {
    // Reset all form inputs
    document.querySelectorAll('.filter-input').forEach(input => {
        input.value = '';
    });

    // Reset all checkboxes
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('active');
    });

    // Reset search
    document.getElementById('mainSearch').value = '';

    // Hide detected params and suggestions
    document.getElementById('detectedParams').style.display = 'none';
    document.getElementById('smartSuggestions').style.display = 'none';

    // Reset properties
    filteredProperties = [...sampleProperties];
    renderProperties();
    updateStats();

    showNotification('Filtros eliminados');
}

function updateStats() {
    document.getElementById('currentCount').textContent = filteredProperties.length;
    document.getElementById('totalCount').textContent = sampleProperties.length;
    document.getElementById('totalProperties').textContent = sampleProperties.length.toLocaleString();
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('propertiesContainer').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('propertiesContainer').style.display = 'grid';
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}