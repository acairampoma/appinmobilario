# GUÍA DE BÚSQUEDA INTELIGENTE Y GENERATIVA

## 🔍 Librerías JavaScript para Búsqueda Avanzada

### 1. **Fuse.js** ⭐⭐⭐⭐⭐ (RECOMENDADA)
**Búsqueda fuzzy ligera y potente**

**Características:**
- ✅ Búsqueda difusa (tolera errores de tipeo)
- ✅ Búsqueda por múltiples campos
- ✅ Ponderación de resultados
- ✅ Solo 12KB minificado
- ✅ Sin dependencias

**Instalación:**
```html
<!-- CDN -->
<script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
```

**Ejemplo de uso:**
```javascript
const fuse = new Fuse(propiedades, {
  keys: [
    { name: 'titulo', weight: 2 },
    { name: 'descripcion', weight: 1 },
    { name: 'ubicacion.distrito', weight: 1.5 },
    'caracteristicas.nombre'
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
});

const resultado = fuse.search('casa piscina surco');
// Retorna propiedades ordenadas por relevancia
```

---

### 2. **MiniSearch** ⭐⭐⭐⭐
**Motor de búsqueda full-text ultraligero**

**Características:**
- ✅ Búsqueda full-text
- ✅ Autocompletado
- ✅ Sugerencias
- ✅ Búsqueda por prefijo
- ✅ Solo 9KB

**Instalación:**
```html
<script src="https://cdn.jsdelivr.net/npm/minisearch@6.3.0/dist/umd/index.min.js"></script>
```

**Ejemplo:**
```javascript
const miniSearch = new MiniSearch({
  fields: ['titulo', 'descripcion', 'distrito'],
  storeFields: ['id', 'titulo', 'precio'],
  searchOptions: {
    boost: { titulo: 2, distrito: 1.5 },
    fuzzy: 0.2,
    prefix: true
  }
});

miniSearch.addAll(propiedades);

// Búsqueda con sugerencias
const results = miniSearch.search('cas miraflo', {
  fuzzy: 0.2,
  prefix: true
});

// Autocompletado
const suggestions = miniSearch.autoSuggest('cas');
// ['casa', 'casas', 'casa-oficina']
```

---

### 3. **Lunr.js** ⭐⭐⭐⭐
**Búsqueda full-text estilo Solr/Elasticsearch**

**Características:**
- ✅ Indexación potente
- ✅ Stemming (raíces de palabras)
- ✅ Búsqueda booleana (AND, OR, NOT)
- ✅ Wildcards

**Ejemplo:**
```javascript
const idx = lunr(function() {
  this.field('titulo', { boost: 10 });
  this.field('descripcion');
  this.field('distrito', { boost: 5 });
  this.ref('id');

  propiedades.forEach(prop => this.add(prop));
});

const results = idx.search('casa +piscina +surco');
```

---

### 4. **FlexSearch** ⭐⭐⭐⭐⭐
**Motor de búsqueda más rápido**

**Características:**
- ✅ Extremadamente rápido
- ✅ Búsqueda contextual
- ✅ Caché inteligente
- ✅ Búsqueda fonética

**Ejemplo:**
```javascript
const index = new FlexSearch.Document({
  document: {
    id: 'id',
    index: ['titulo', 'descripcion', 'distrito'],
    store: ['titulo', 'precio', 'imagen']
  },
  tokenize: 'forward',
  context: true
});

propiedades.forEach(prop => index.add(prop));

const results = index.search('casa con piscina');
```

---

### 5. **Natural.js** ⭐⭐⭐
**Procesamiento de lenguaje natural (NLP)**

**Características:**
- ✅ Tokenización
- ✅ Stemming en español
- ✅ Clasificación de texto
- ✅ Análisis de sentimientos
- ✅ Extracción de entidades

**Ejemplo:**
```javascript
const natural = require('natural');

// Tokenización en español
const tokenizer = new natural.WordTokenizer();
const tokens = tokenizer.tokenize('Busco casa con piscina en Surco');
// ['Busco', 'casa', 'con', 'piscina', 'en', 'Surco']

// Stemming
const stemmer = natural.PorterStemmerEs;
stemmer.stem('casas'); // 'cas'
stemmer.stem('piscinas'); // 'piscin'

// TF-IDF (Term Frequency-Inverse Document Frequency)
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

propiedades.forEach(prop => {
  tfidf.addDocument(prop.titulo + ' ' + prop.descripcion);
});

// Encontrar documentos similares
tfidf.tfidfs('casa piscina surco', (i, measure) => {
  console.log('Documento ' + i + ' es ' + measure + ' relevante');
});
```

---

## 🤖 BÚSQUEDA GENERATIVA CON IA

### **1. OpenAI GPT (API)** ⭐⭐⭐⭐⭐
**La mejor opción para NLP avanzado**

```javascript
async function busquedaGenerativa(consulta) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'Eres un asistente de búsqueda inmobiliaria. Extrae los parámetros de búsqueda de la consulta del usuario.'
      }, {
        role: 'user',
        content: consulta
      }],
      functions: [{
        name: 'buscar_propiedades',
        parameters: {
          type: 'object',
          properties: {
            tipo_inmueble: { type: 'string' },
            distrito: { type: 'string' },
            precio_min: { type: 'number' },
            precio_max: { type: 'number' },
            caracteristicas: { type: 'array', items: { type: 'string' } },
            dormitorios_min: { type: 'number' }
          }
        }
      }]
    })
  });

  return response.json();
}

// Uso
const consulta = 'Necesito una casa con jardín y piscina en Surco, máximo 700 mil dólares';
const parametros = await busquedaGenerativa(consulta);

// Resultado:
// {
//   tipo_inmueble: 'casa',
//   distrito: 'Santiago de Surco',
//   precio_max: 700000,
//   caracteristicas: ['jardin', 'piscina']
// }
```

---

### **2. Compromise.js** ⭐⭐⭐⭐
**NLP en JavaScript sin servidor**

```javascript
import nlp from 'compromise';

function extraerParametrosBusqueda(texto) {
  const doc = nlp(texto);

  // Extraer ubicaciones
  const lugares = doc.places().out('array');

  // Extraer números (precios, cantidades)
  const numeros = doc.numbers().out('array');

  // Extraer características
  const sustantivos = doc.nouns().out('array');

  return {
    lugares,
    numeros,
    caracteristicas: sustantivos
  };
}

// Ejemplo
const consulta = 'Busco departamento de 3 habitaciones en Miraflores por 250 mil';
const params = extraerParametrosBusqueda(consulta);
// {
//   lugares: ['Miraflores'],
//   numeros: [3, 250],
//   caracteristicas: ['departamento', 'habitaciones']
// }
```

---

### **3. TensorFlow.js + USE (Universal Sentence Encoder)** ⭐⭐⭐⭐
**Embeddings semánticos en el navegador**

```javascript
import * as use from '@tensorflow-models/universal-sentence-encoder';

let model;

async function inicializarModelo() {
  model = await use.load();
}

async function busquedaSemantica(consulta, propiedades) {
  // Codificar consulta
  const queryEmbedding = await model.embed([consulta]);

  // Codificar títulos de propiedades
  const titulos = propiedades.map(p => p.titulo + ' ' + p.descripcion);
  const propertyEmbeddings = await model.embed(titulos);

  // Calcular similitud coseno
  const similarities = [];
  const queryVector = await queryEmbedding.array();
  const propertyVectors = await propertyEmbeddings.array();

  propertyVectors[0].forEach((_, i) => {
    const similarity = cosineSimilarity(queryVector[0], propertyVectors[0][i]);
    similarities.push({ index: i, score: similarity });
  });

  // Ordenar por relevancia
  return similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(s => propiedades[s.index]);
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}
```

---

## 🎯 IMPLEMENTACIÓN RECOMENDADA (Sin Backend)

### **Combinación: Fuse.js + Compromise.js + Reglas Personalizadas**

```javascript
// 1. Configurar Fuse.js
const fuse = new Fuse(propiedades, {
  keys: ['titulo', 'descripcion', 'ubicacion.distrito', 'caracteristicas.nombre'],
  threshold: 0.4,
  includeScore: true
});

// 2. Procesamiento NLP básico
function procesarConsultaNatural(consulta) {
  const doc = nlp(consulta.toLowerCase());

  const parametros = {
    texto: consulta,
    tipoInmueble: null,
    distrito: null,
    caracteristicas: [],
    precioMin: null,
    precioMax: null,
    dormitorios: null
  };

  // Detectar tipo de inmueble
  const tipos = {
    'casa': ['casa', 'casas', 'chalet', 'vivienda'],
    'departamento': ['departamento', 'depa', 'flat', 'piso'],
    'oficina': ['oficina', 'oficinas'],
    'terreno': ['terreno', 'lote']
  };

  for (const [tipo, palabras] of Object.entries(tipos)) {
    if (palabras.some(p => consulta.toLowerCase().includes(p))) {
      parametros.tipoInmueble = tipo;
      break;
    }
  }

  // Detectar ubicación (distritos de Lima)
  const distritos = [
    'miraflores', 'san isidro', 'surco', 'la molina',
    'san borja', 'barranco', 'jesús maría'
  ];

  distritos.forEach(distrito => {
    if (consulta.toLowerCase().includes(distrito)) {
      parametros.distrito = distrito;
    }
  });

  // Detectar características
  const caracteristicas = {
    'piscina': ['piscina', 'pool'],
    'jardin': ['jardín', 'jardin', 'garden'],
    'cochera': ['cochera', 'garage', 'estacionamiento'],
    'ascensor': ['ascensor', 'elevador']
  };

  for (const [car, palabras] of Object.entries(caracteristicas)) {
    if (palabras.some(p => consulta.toLowerCase().includes(p))) {
      parametros.caracteristicas.push(car);
    }
  }

  // Detectar números (precio, habitaciones)
  const numeros = consulta.match(/\d+/g);
  if (numeros) {
    numeros.forEach(num => {
      const valor = parseInt(num);
      if (valor >= 100) { // Probablemente sea precio
        if (!parametros.precioMax || valor > parametros.precioMax) {
          parametros.precioMax = valor * 1000; // Asumir miles
        }
      } else if (valor <= 10) { // Probablemente dormitorios
        parametros.dormitorios = valor;
      }
    });
  }

  return parametros;
}

// 3. Generar sugerencias inteligentes
function generarSugerencias(parametros, propiedades) {
  const sugerencias = [];

  // Sugerir tipos de inmuebles similares
  if (parametros.tipoInmueble === 'casa') {
    sugerencias.push('¿También te interesan chalets o casas de playa?');
  }

  // Sugerir zonas alternativas
  if (parametros.distrito) {
    const zonasAlternativas = {
      'miraflores': ['Barranco', 'San Isidro', 'Surco'],
      'surco': ['La Molina', 'San Borja', 'Monterrico'],
      'san isidro': ['Miraflores', 'San Borja', 'Jesús María']
    };

    const alternativas = zonasAlternativas[parametros.distrito] || [];
    if (alternativas.length > 0) {
      sugerencias.push(`¿Consideras también ${alternativas.join(', ')}?`);
    }
  }

  // Sugerir características adicionales
  if (parametros.caracteristicas.includes('piscina')) {
    sugerencias.push('¿Te gustaría que también tenga quincho o jardín?');
  }

  // Sugerir ajuste de precio
  if (parametros.precioMax) {
    const propiedadesCercanas = propiedades.filter(p =>
      p.precioVenta &&
      p.precioVenta > parametros.precioMax &&
      p.precioVenta <= parametros.precioMax * 1.2
    );

    if (propiedadesCercanas.length > 0) {
      sugerencias.push(`Hay ${propiedadesCercanas.length} propiedades excelentes por hasta ${Math.round(parametros.precioMax * 1.2 / 1000)}k`);
    }
  }

  return sugerencias;
}

// 4. Búsqueda completa
function busquedaInteligente(consulta, propiedades) {
  // Procesar lenguaje natural
  const parametros = procesarConsultaNatural(consulta);

  // Búsqueda con Fuse.js
  let resultados = fuse.search(consulta).map(r => r.item);

  // Filtrar por parámetros extraídos
  if (parametros.tipoInmueble) {
    resultados = resultados.filter(p => p.tipoInmueble === parametros.tipoInmueble);
  }

  if (parametros.distrito) {
    resultados = resultados.filter(p =>
      p.ubicacion.distrito.toLowerCase().includes(parametros.distrito)
    );
  }

  if (parametros.caracteristicas.length > 0) {
    resultados = resultados.filter(p =>
      parametros.caracteristicas.every(car =>
        p.caracteristicas.some(c => c.slug === car && c.valor)
      )
    );
  }

  // Generar sugerencias
  const sugerencias = generarSugerencias(parametros, propiedades);

  return {
    parametros,
    resultados,
    sugerencias,
    total: resultados.length
  };
}

// EJEMPLO DE USO
const consulta = 'Busco casa con piscina en Surco máximo 700 mil';
const resultado = busquedaInteligente(consulta, propiedades);

console.log('Parámetros detectados:', resultado.parametros);
console.log('Resultados:', resultado.resultados);
console.log('Sugerencias:', resultado.sugerencias);
```

---

## 📊 COMPARACIÓN DE LIBRERÍAS

| Librería | Tamaño | Velocidad | Complejidad | Fuzzy Search | NLP | Recomendado Para |
|----------|--------|-----------|-------------|--------------|-----|------------------|
| **Fuse.js** | 12KB | Media | Baja | ✅ | ❌ | Búsqueda rápida y fuzzy |
| **MiniSearch** | 9KB | Alta | Media | ✅ | ❌ | Autocompletado |
| **FlexSearch** | 8KB | Muy Alta | Media | ❌ | ❌ | Millones de registros |
| **Lunr.js** | 35KB | Media | Alta | ❌ | ❌ | Búsqueda avanzada |
| **Compromise** | 200KB | Media | Media | ❌ | ✅ | NLP en español |
| **Natural.js** | Grande | Media | Alta | ❌ | ✅ | NLP avanzado |

---

## ✅ RECOMENDACIÓN FINAL

**Para tu proyecto inmobiliario, usa:**

1. **Fuse.js** → Búsqueda principal (fuzzy search)
2. **Reglas personalizadas** → Detección de tipos, distritos, características
3. **LocalStorage/IndexedDB** → Caché de búsquedas frecuentes
4. **Sugerencias basadas en contexto** → Análisis de consultas similares

**Ventajas:**
- ✅ Sin backend necesario
- ✅ Rápido y ligero
- ✅ Funciona offline
- ✅ Fácil de implementar
- ✅ Buen equilibrio entre simplicidad y potencia

**Próximos pasos:**
1. Integrar Fuse.js en tu sistema actual
2. Crear diccionario de sinónimos para español
3. Implementar sistema de sugerencias inteligentes
4. Agregar historial de búsquedas
5. Analytics de consultas para mejorar el sistema