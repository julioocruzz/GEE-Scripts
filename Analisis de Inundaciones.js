//ANALISIS DE INUNDACIONES
// Definir la región de interés (ROI) como una geometría dibujada
var roi = geometry; // Asegúrate de haber dibujado una geometría en el mapa y que se llama "geometry"
// Declaramos dos  momentos temporales para disponer de los datos necesarios
// Declarar dos momentos temporales para disponer de los datos necesarios
var Tiempo1 = ee.ImageCollection('COPERNICUS/S2')
  .filterDate('2025-01-09', '2025-01-10') // Momento temporal 1 previo a inundación
  .filterBounds(roi) // Filtro espacial para limitar las imágenes al ROI
  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'Less_Than', 1); // Filtro de nubes
var Secano = Tiempo1.reduce(ee.Reducer.median());

var Tiempo2 = ee.ImageCollection('COPERNICUS/S2')
  .filterDate('2025-03-07', '2025-03-09') // Momento temporal 2 durante la inundación
  .filterBounds(roi) // Filtro espacial para limitar las imágenes al ROI
  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'Less_Than', 40); // Filtro de nubes
var Inundacion = Tiempo2.reduce(ee.Reducer.median());

// Analizamos los valores de humedad a partir de las bandas 8 y 11
var Humedad2 = Inundacion.normalizedDifference (['B8_median', 'B11_median']);
var Humedad1 = Secano.normalizedDifference (['B8_median', 'B11_median']);

// Simbolizamos los valores de humedad en el momento de la inundacion
Map.addLayer(Humedad2, {min: -1, max: 0.7, palette: ['#0000ff', 'F1B555', '99B718', '66A000', '3E8601', 
    '056201', '023B01', '011D01', 'blue']},'Inundacion');


// Simbolizamos los valores de humedad previos a la inundacion y vinculamos vistas comparativas
var MapasVinculados = ui.Map();
MapasVinculados.addLayer(Humedad1, {min: -1, max: 0.6, palette: ['#0000ff', 'F1B555', '99B718', '66A000', '3E8601', 
    '056201', '023B01', '011D01', 'blue']},'Pre-Inundacion');

var SWIPE = ui.Map.Linker([ui.root.widgets().get(0), MapasVinculados]);

// Integramos el efecto swipe creando una cortinilla horizontal o vertical
var SWIPE2 = ui.SplitPanel({
  firstPanel: SWIPE.get(0),
  secondPanel: SWIPE.get(1),
  orientation: 'horizontal', //'horizontal' o 'vertical'
  wipe: true,
  style: {stretch: 'both'}});
ui.root.widgets().reset([SWIPE2]);

// Mostramos los mapas vinculados con efecto swipe, centrando den zona AOI y asignando zoom
MapasVinculados.setCenter(-0.89, 37.73, 12);




//VISUALIZAR IMAGENES
// Definir la región de interés (ROI) como una geometría dibujada
var roi = geometry; // Asegúrate de haber dibujado una geometría en el mapa y que se llama "geometry"

// Declarar dos momentos temporales para disponer de los datos necesarios
var Tiempo1 = ee.ImageCollection('COPERNICUS/S2')
  .filterDate('2025-01-09', '2025-01-10') // Momento temporal 1 previo a inundación
  .filterBounds(roi) // Filtro espacial para limitar las imágenes al ROI
  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'Less_Than', 1); // Filtro de nubes

var Tiempo2 = ee.ImageCollection('COPERNICUS/S2')
  .filterDate('2025-03-05', '2025-03-06') // Momento temporal 2 durante la inundación
  .filterBounds(roi) // Filtro espacial para limitar las imágenes al ROI
  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'Less_Than', 40); // Filtro de nubes

// Obtener la lista de imágenes en cada colección
var listaTiempo1 = Tiempo1.toList(Tiempo1.size());
var listaTiempo2 = Tiempo2.toList(Tiempo2.size());

// Imprimir el número de imágenes en cada colección
print('Número de imágenes en Tiempo1:', Tiempo1.size());
print('Número de imágenes en Tiempo2:', Tiempo2.size());

// Función para agregar imágenes al mapa con un nombre específico
var agregarImagenesAlMapa = function(coleccion, nombre) {
  var tamaño = coleccion.size().getInfo(); // Obtener el tamaño de la colección
  for (var i = 0; i < tamaño; i++) {
    var imagen = ee.Image(coleccion.get(i)); // Obtener la imagen i-ésima
    var fecha = imagen.date().format('YYYY-MM-dd').getInfo(); // Obtener la fecha de la imagen
    Map.addLayer(imagen, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, nombre + ' ' + fecha); // Añadir al mapa
  }
};

// Añadir imágenes de Tiempo1 al mapa
agregarImagenesAlMapa(listaTiempo1, 'Tiempo1');

// Añadir imágenes de Tiempo2 al mapa
agregarImagenesAlMapa(listaTiempo2, 'Tiempo2');

// Centrar el mapa en la ROI
Map.centerObject(roi, 10); // Ajusta el nivel de zoom según sea necesario