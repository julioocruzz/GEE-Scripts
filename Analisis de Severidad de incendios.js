// Definir la región de interés (ROI) y el rango de fechas
var roi = geometry2; // Ejemplo: Coordenadas de Madrid, España
var fechaPreIncendio = '2019-08-01';
var fechaPostIncendio = '2019-08-30';

// Cargar la colección de imágenes Sentinel-2
var coleccionSentinel2 = ee.ImageCollection('COPERNICUS/S2')
    .filterBounds(roi)
    .filterDate(fechaPreIncendio, fechaPostIncendio)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)); // Filtro de nubosidad

// Seleccionar la imagen más reciente antes del incendio (PreIncendio)
var PreIncendio = coleccionSentinel2
    .filterDate(fechaPreIncendio, '2019-08-17') // Ajustar la fecha según el caso
    .sort('system:time_start', false) // Ordenar por fecha, la más reciente primero
    .first();

// Seleccionar la imagen más temprana después del incendio (PostIncendio)
var PostIncendio = coleccionSentinel2
    .filterDate('2019-08-21', fechaPostIncendio) // Ajustar la fecha según el caso
    .sort('system:time_start', true) // Ordenar por fecha, la más temprana primero
    .first();

// Añadir la imagen PreIncendio a la vista
Map.addLayer(PreIncendio, {
    max: 4000.0,
    min: 0.0,
    gamma: 0.5,
    bands: ['B11', 'B8', 'B4']
}, 'PreIncendio');

// Calcular el índice NBR para la imagen PreIncendio
var NBRPreIncendio = PreIncendio.normalizedDifference(['B8', 'B12']);
Map.addLayer(NBRPreIncendio, {
    max: 1.0,
    min: 0.0,
    palette: ['#7F0010', '#D99143', '#C04529', '#E02E20', '#EC6521', '#F6D53B']
}, 'Mapa NBR PreIncendio');

// Añadir la imagen PostIncendio a la vista
Map.addLayer(PostIncendio, {
    max: 4000.0,
    min: 0.0,
    gamma: 0.5,
    bands: ['B11', 'B8', 'B4']
}, 'PostIncendio');

// Calcular el índice NBR para la imagen PostIncendio
var NBRPostIncendio = PostIncendio.normalizedDifference(['B8', 'B12']);
Map.addLayer(NBRPostIncendio, {
    max: 1.0,
    min: 0.0,
    palette: ['#7F0010', '#D99143', '#C04529', '#E02E20', '#EC6521', '#F6D53B']
}, 'Mapa NBR PostIncendio');

// Calcular el índice de severidad
var IndiceSeveridad = NBRPreIncendio.subtract(NBRPostIncendio);
Map.addLayer(IndiceSeveridad, {
    max: 1.0,
    min: 0.0,
    palette: ['011301', '011D01', '012E01', '023B01', '004C00', '056201',
        '207401', '3E8601', '529400', '74A901', '99B718', 'FCD163',
        'F1B555', 'DF923D', 'CE7E45', '66A000']
}, 'Índice severidad de incendio');

// Centrar el mapa en la región de interés con un zoom de 9
Map.centerObject(roi, 9);