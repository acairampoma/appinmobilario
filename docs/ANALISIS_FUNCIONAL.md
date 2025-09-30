# ANÁLISIS FUNCIONAL - SISTEMA INMOBILIARIO

## 1. VISIÓN GENERAL DEL SISTEMA

Sistema inmobiliario avanzado con capacidad de gestionar propiedades con características dinámicas y búsqueda flexible, permitiendo agregar infinitas características sin modificar la estructura de la base de datos.

---

## 2. MODELO DE DATOS - ARQUITECTURA EAV (Entity-Attribute-Value)

### 2.1 TABLAS PRINCIPALES

#### **PROPIEDADES**
Tabla principal que contiene la información base de cada propiedad.

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | INT (PK) | Identificador único | ✓ |
| codigo | VARCHAR(50) | Código interno de propiedad | ✓ |
| titulo | VARCHAR(200) | Título descriptivo | ✓ |
| descripcion | TEXT | Descripción detallada | ✓ |
| tipo_propiedad_id | INT (FK) | Tipo de inmueble | ✓ |
| tipo_operacion | ENUM('venta','alquiler','temporal') | Tipo de operación | ✓ |
| precio | DECIMAL(15,2) | Precio de la propiedad | ✓ |
| moneda | VARCHAR(3) | Código de moneda (USD, ARS) | ✓ |
| direccion | VARCHAR(255) | Dirección completa | ✓ |
| ciudad | VARCHAR(100) | Ciudad | ✓ |
| provincia | VARCHAR(100) | Provincia/Estado | ✓ |
| pais | VARCHAR(100) | País | ✓ |
| codigo_postal | VARCHAR(20) | Código postal | |
| latitud | DECIMAL(10,8) | Coordenada GPS | |
| longitud | DECIMAL(11,8) | Coordenada GPS | |
| area_total | DECIMAL(10,2) | Área total en m² | |
| area_construida | DECIMAL(10,2) | Área construida en m² | |
| habitaciones | INT | Número de habitaciones | |
| banos | INT | Número de baños | |
| ano_construccion | INT | Año de construcción | |
| estado | ENUM('nuevo','excelente','muy-bueno','bueno','refaccionar') | Estado de la propiedad | |
| disponible | BOOLEAN | Si está disponible | ✓ |
| destacada | BOOLEAN | Si es destacada | ✓ |
| usuario_id | INT (FK) | Usuario propietario/agente | ✓ |
| fecha_creacion | TIMESTAMP | Fecha de alta | ✓ |
| fecha_actualizacion | TIMESTAMP | Última actualización | ✓ |
| fecha_publicacion | TIMESTAMP | Fecha de publicación | |

---

#### **TIPOS_PROPIEDAD**
Catálogo de tipos de propiedades.

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | INT (PK) | Identificador único | ✓ |
| nombre | VARCHAR(50) | Nombre del tipo | ✓ |
| icono | VARCHAR(50) | Clase de icono FontAwesome | |
| descripcion | TEXT | Descripción del tipo | |
| activo | BOOLEAN | Si está activo | ✓ |

**Datos iniciales:**
- Apartamento
- Casa
- Oficina
- Local Comercial
- Terreno
- Bodega
- Consultorio
- Estacionamiento
- Quinta/Finca
- PentHouse

---

#### **CARACTERISTICAS** ⭐
Catálogo maestro de características disponibles (modelo flexible).

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | INT (PK) | Identificador único | ✓ |
| nombre | VARCHAR(100) | Nombre de la característica | ✓ |
| slug | VARCHAR(100) | Nombre normalizado | ✓ |
| descripcion | TEXT | Descripción de la característica | |
| tipo_dato | ENUM('boolean','number','text','select','multiselect','date') | Tipo de dato que acepta | ✓ |
| unidad_medida | VARCHAR(20) | Unidad (m², años, etc.) | |
| icono | VARCHAR(50) | Icono FontAwesome | |
| categoria | VARCHAR(50) | Categoría agrupadora | |
| opciones | JSON | Opciones para select/multiselect | |
| filtrable | BOOLEAN | Si se puede filtrar en búsqueda | ✓ |
| mostrar_tarjeta | BOOLEAN | Si se muestra en tarjeta | ✓ |
| orden | INT | Orden de visualización | |
| activo | BOOLEAN | Si está activa | ✓ |

**Ejemplos de características:**

| nombre | tipo_dato | categoria | opciones |
|--------|-----------|-----------|----------|
| Piscina | boolean | Amenidades | null |
| Garage | boolean | Estacionamiento | null |
| Cantidad de cocheras | number | Estacionamiento | null |
| Amueblado | boolean | Estado | null |
| Ascensor | boolean | Edificio | null |
| Calefacción | select | Climatización | ["Gas", "Eléctrica", "Central", "Individual"] |
| Vista | select | Ubicación | ["Mar", "Montaña", "Ciudad", "Jardín"] |
| Orientación | select | Ubicación | ["Norte", "Sur", "Este", "Oeste"] |
| Seguridad 24hs | boolean | Seguridad | null |
| Antigüedad | number | Construcción | null |
| Mascotas permitidas | boolean | Políticas | null |

---

#### **PROPIEDADES_CARACTERISTICAS** ⭐⭐⭐
Tabla pivote que almacena los valores de características para cada propiedad (EAV).

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | INT (PK) | Identificador único | ✓ |
| propiedad_id | INT (FK) | ID de la propiedad | ✓ |
| caracteristica_id | INT (FK) | ID de la característica | ✓ |
| valor_boolean | BOOLEAN | Valor si es booleano | |
| valor_number | DECIMAL(15,2) | Valor si es numérico | |
| valor_text | TEXT | Valor si es texto | |
| valor_date | DATE | Valor si es fecha | |
| valor_json | JSON | Valor para multiselect | |
| fecha_creacion | TIMESTAMP | Fecha de creación | ✓ |

**Índices únicos:** (propiedad_id, caracteristica_id)

**Ejemplo de datos:**

| propiedad_id | caracteristica_id | nombre_caracteristica | valor_boolean | valor_number | valor_text |
|--------------|-------------------|----------------------|---------------|--------------|------------|
| 1 | 5 | Piscina | true | null | null |
| 1 | 8 | Garage | true | null | null |
| 1 | 12 | Cantidad de cocheras | null | 2 | null |
| 1 | 15 | Calefacción | null | null | Gas |
| 2 | 5 | Piscina | true | null | null |
| 2 | 20 | Vista | null | null | Jardín |

---

#### **IMAGENES**
Almacena las imágenes de cada propiedad.

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | INT (PK) | Identificador único | ✓ |
| propiedad_id | INT (FK) | ID de la propiedad | ✓ |
| url | VARCHAR(500) | URL de la imagen | ✓ |
| titulo | VARCHAR(200) | Título de la imagen | |
| descripcion | TEXT | Descripción | |
| orden | INT | Orden de visualización | ✓ |
| es_principal | BOOLEAN | Si es imagen principal | ✓ |
| fecha_subida | TIMESTAMP | Fecha de subida | ✓ |

---

#### **USUARIOS**
Usuarios del sistema (agentes, propietarios, administradores).

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | INT (PK) | Identificador único | ✓ |
| nombre | VARCHAR(100) | Nombre completo | ✓ |
| email | VARCHAR(150) | Email único | ✓ |
| telefono | VARCHAR(20) | Teléfono | |
| password | VARCHAR(255) | Contraseña hasheada | ✓ |
| rol | ENUM('admin','agente','cliente') | Rol del usuario | ✓ |
| activo | BOOLEAN | Si está activo | ✓ |
| fecha_registro | TIMESTAMP | Fecha de registro | ✓ |

---

#### **BUSQUEDAS_GUARDADAS**
Almacena búsquedas guardadas por usuarios.

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | INT (PK) | Identificador único | ✓ |
| usuario_id | INT (FK) | ID del usuario | ✓ |
| nombre | VARCHAR(100) | Nombre de la búsqueda | ✓ |
| filtros | JSON | Filtros aplicados | ✓ |
| notificar | BOOLEAN | Notificar nuevas propiedades | ✓ |
| fecha_creacion | TIMESTAMP | Fecha de creación | ✓ |

---

#### **FAVORITOS**
Propiedades favoritas de usuarios.

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | INT (PK) | Identificador único | ✓ |
| usuario_id | INT (FK) | ID del usuario | ✓ |
| propiedad_id | INT (FK) | ID de la propiedad | ✓ |
| fecha_guardado | TIMESTAMP | Fecha de guardado | ✓ |

---

## 3. VENTAJAS DEL MODELO EAV

### ✅ **Flexibilidad Total**
- Agregar nuevas características sin modificar tablas
- Diferentes tipos de propiedades con características únicas
- Adaptable a cualquier mercado inmobiliario

### ✅ **Escalabilidad**
- No hay límite de características
- Crecimiento horizontal sin impacto
- Performance con índices adecuados

### ✅ **Mantenibilidad**
- Cambios en catálogo sin tocar datos
- Fácil activar/desactivar características
- Control granular de visualización

### ✅ **Búsqueda Avanzada**
- Filtros dinámicos según características activas
- Combinación de múltiples criterios
- Búsqueda por rangos en valores numéricos

---

## 4. MOTOR DE BÚSQUEDA AVANZADO

### 4.1 Tipos de Filtros

#### **Filtros Básicos**
- Tipo de operación (venta/alquiler)
- Tipo de propiedad
- Ubicación (ciudad, provincia)
- Rango de precio
- Habitaciones (mínimo)
- Baños (mínimo)
- Área (rango)

#### **Filtros por Características** ⭐
- Características booleanas (tiene/no tiene)
- Características numéricas (rangos)
- Características de selección (valores específicos)
- Combinación AND/OR

#### **Filtros Geográficos**
- Búsqueda por radio (distancia desde punto)
- Búsqueda por polígono (zona específica)
- Búsqueda por barrios

### 4.2 Query SQL Ejemplo

```sql
-- Búsqueda de propiedades con características específicas
SELECT DISTINCT p.*
FROM propiedades p
LEFT JOIN propiedades_caracteristicas pc ON p.id = pc.propiedad_id
LEFT JOIN caracteristicas c ON pc.caracteristica_id = c.id
WHERE p.disponible = true
  AND p.tipo_operacion = 'venta'
  AND p.precio BETWEEN 200000 AND 500000
  AND p.habitaciones >= 3
  -- Filtrar por característica "Piscina"
  AND EXISTS (
    SELECT 1 FROM propiedades_caracteristicas pc2
    JOIN caracteristicas c2 ON pc2.caracteristica_id = c2.id
    WHERE pc2.propiedad_id = p.id
      AND c2.slug = 'piscina'
      AND pc2.valor_boolean = true
  )
  -- Filtrar por característica "Garage"
  AND EXISTS (
    SELECT 1 FROM propiedades_caracteristicas pc3
    JOIN caracteristicas c3 ON pc3.caracteristica_id = c3.id
    WHERE pc3.propiedad_id = p.id
      AND c3.slug = 'garage'
      AND pc3.valor_boolean = true
  )
ORDER BY p.fecha_publicacion DESC
LIMIT 50;
```

---

## 5. ÍNDICES RECOMENDADOS

```sql
-- Índices en PROPIEDADES
CREATE INDEX idx_propiedades_tipo_operacion ON propiedades(tipo_operacion);
CREATE INDEX idx_propiedades_precio ON propiedades(precio);
CREATE INDEX idx_propiedades_ciudad ON propiedades(ciudad);
CREATE INDEX idx_propiedades_disponible ON propiedades(disponible);
CREATE INDEX idx_propiedades_destacada ON propiedades(destacada);
CREATE INDEX idx_propiedades_tipo_id ON propiedades(tipo_propiedad_id);

-- Índices en PROPIEDADES_CARACTERISTICAS
CREATE INDEX idx_pc_propiedad ON propiedades_caracteristicas(propiedad_id);
CREATE INDEX idx_pc_caracteristica ON propiedades_caracteristicas(caracteristica_id);
CREATE INDEX idx_pc_valor_boolean ON propiedades_caracteristicas(valor_boolean);
CREATE INDEX idx_pc_valor_number ON propiedades_caracteristicas(valor_number);
CREATE UNIQUE INDEX idx_pc_unique ON propiedades_caracteristicas(propiedad_id, caracteristica_id);

-- Índices en CARACTERISTICAS
CREATE INDEX idx_caracteristicas_slug ON caracteristicas(slug);
CREATE INDEX idx_caracteristicas_activo ON caracteristicas(activo);
CREATE INDEX idx_caracteristicas_filtrable ON caracteristicas(filtrable);

-- Índices en IMAGENES
CREATE INDEX idx_imagenes_propiedad ON imagenes(propiedad_id);
CREATE INDEX idx_imagenes_principal ON imagenes(es_principal);
```

---

## 6. API REST - ENDPOINTS

### **GET /api/propiedades**
Búsqueda avanzada de propiedades

**Query Parameters:**
```json
{
  "tipo_operacion": "venta",
  "tipo_propiedad_id": 1,
  "precio_min": 200000,
  "precio_max": 500000,
  "habitaciones_min": 3,
  "ciudad": "Buenos Aires",
  "caracteristicas": {
    "piscina": true,
    "garage": true,
    "cantidad_cocheras_min": 2,
    "calefaccion": "Gas"
  },
  "page": 1,
  "limit": 20,
  "sort": "precio_asc"
}
```

### **GET /api/propiedades/:id**
Detalle completo de una propiedad con todas sus características

### **GET /api/caracteristicas**
Listado de todas las características disponibles para filtros

### **GET /api/caracteristicas/activas**
Características activas y filtrables

### **POST /api/propiedades**
Crear nueva propiedad

**Body:**
```json
{
  "titulo": "Casa en venta",
  "tipo_propiedad_id": 2,
  "precio": 450000,
  "caracteristicas": [
    {
      "caracteristica_id": 5,
      "valor_boolean": true
    },
    {
      "caracteristica_id": 12,
      "valor_number": 2
    }
  ]
}
```

---

## 7. INTERFACE DE BÚSQUEDA

### 7.1 Filtros Dinámicos
- El frontend consulta `/api/caracteristicas/activas`
- Genera filtros dinámicamente según tipo de dato
- Boolean → Checkbox
- Number → Slider de rango
- Select → Dropdown
- Text → Input de búsqueda

### 7.2 Búsqueda en Tiempo Real
- Debounce de 300ms en inputs
- Actualización automática de resultados
- Contador de propiedades encontradas
- Paginación infinita o clásica

### 7.3 Guardado de Búsquedas
- Usuario puede guardar combinación de filtros
- Notificaciones de nuevas propiedades que coincidan
- Gestión de búsquedas guardadas

---

## 8. SCRIPTS SQL DE CREACIÓN

### Crear características iniciales:
```sql
INSERT INTO caracteristicas (nombre, slug, tipo_dato, categoria, filtrable, mostrar_tarjeta, activo) VALUES
('Piscina', 'piscina', 'boolean', 'Amenidades', true, true, true),
('Garage', 'garage', 'boolean', 'Estacionamiento', true, true, true),
('Cantidad de cocheras', 'cantidad_cocheras', 'number', 'Estacionamiento', true, true, true),
('Jardín', 'jardin', 'boolean', 'Amenidades', true, true, true),
('Terraza', 'terraza', 'boolean', 'Amenidades', true, true, true),
('Balcón', 'balcon', 'boolean', 'Amenidades', true, true, true),
('Amueblado', 'amueblado', 'boolean', 'Estado', true, true, true),
('Ascensor', 'ascensor', 'boolean', 'Edificio', true, true, true),
('Portero', 'portero', 'boolean', 'Edificio', true, false, true),
('Seguridad 24hs', 'seguridad_24hs', 'boolean', 'Seguridad', true, true, true),
('Calefacción', 'calefaccion', 'select', 'Climatización', true, true, true),
('Aire acondicionado', 'aire_acondicionado', 'boolean', 'Climatización', true, true, true),
('Vista', 'vista', 'select', 'Ubicación', true, false, true),
('Orientación', 'orientacion', 'select', 'Ubicación', true, false, true),
('Mascotas permitidas', 'mascotas', 'boolean', 'Políticas', true, false, true);
```

---

## 9. CONCLUSIÓN

Este diseño permite:
- ✅ Características infinitas sin cambiar estructura
- ✅ Búsqueda flexible y potente
- ✅ Escalabilidad horizontal
- ✅ Fácil mantenimiento
- ✅ Performance optimizado con índices
- ✅ Adaptable a cualquier tipo de inmueble