// Initialize the map object with Leaflet
const map = L.map('map', {
  minZoom: -0.6,
  maxZoom: 2.5,
  center: [0, 0],
  zoom: 0,
  crs: L.CRS.Simple
});

// Add image overlay to the map
const imageUrl = 'images/Hunt_Map_Blank.jpg';
const imageBounds = [[-500, -500], [500, 500]]; // 1000x1000m
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);

// Initialize Leaflet Draw Control
const drawnItems = new L.FeatureGroup().addTo(map);
const drawControl = new L.Control.Draw({
  draw: {
    polyline: { shapeOptions: { color: '#650000' } },
    polygon: false,
    rectangle: false,
    circle: { shapeOptions: { color: '#650000' } },
    circlemarker: false,
    marker: true
  },
  edit: { featureGroup: drawnItems, remove: true }
});
map.addControl(drawControl);

// Function to handle draw events
map.on(L.Draw.Event.CREATED, function(event) {
  const layer = event.layer;
  drawnItems.addLayer(layer);

  let popupContent = '';
  if (event.layerType === 'polyline') {
    const latlngs = layer.getLatLngs();
    const length = latlngs.reduce((acc, latlng, i, arr) => {
      if (i === arr.length - 1) return acc;
      return acc + map.distance(latlng, arr[i + 1]);
    }, 0);
    popupContent = `Distance: ${length.toFixed(2)} meters`;
  } else if (event.layerType === 'circle') {
    const radius = layer.getRadius();
    popupContent = `Radius: ${radius.toFixed(2)} meters`;
  } else if (event.layerType === 'marker') {
    const latlng = layer.getLatLng();
    popupContent = `Coordinates: [${latlng.lat.toFixed(2)}, ${latlng.lng.toFixed(2)}]`;
  }

  layer.bindPopup(popupContent).openPopup();
});

// Custom Control to Toggle Workbenches
const workbenchLayer = L.layerGroup();
L.Control.WrenchToggle = L.Control.extend({
  options: { position: 'topleft', iconUrl: 'images/wrench.png', title: 'Show/Hide Workbenches' },

  onAdd: function(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control wrench-control');
    container.title = this.options.title;

    const link = L.DomUtil.create('a', '', container);
    link.href = '#';
    link.title = this.options.title;

    const icon = L.DomUtil.create('img', 'wrench-icon', link);
    icon.src = this.options.iconUrl;

    L.DomEvent.on(link, 'click', (e) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      if (map.hasLayer(workbenchLayer)) {
        workbenchLayer.removeFrom(map);
      } else {
        workbenchLayer.addTo(map);
      }
    });

    return container;
  }
});
map.addControl(new L.Control.WrenchToggle());

// Function to add markers to the layer
function addMarkers(locations, layerGroup, iconUrl) {
  const icon = L.icon({ iconUrl: iconUrl, iconSize: [25, 25], iconAnchor: [12, 12] });

  locations.forEach(({ lat, lng, image }) => {
    L.marker([lat, lng], { icon })
      .bindPopup(`<img src="${image}" alt="Workbench Image" style="width: 500px; height: auto;">`)
      .addTo(layerGroup);
  });
}

// Add markers to workbench layer
addMarkers([
  { lat: 378, lng: -373, image: 'workbenches/Blackthorn Stockyard/' },
  { lat: 405, lng: -335, image: 'workbenches/Blackthorn Stockyard/' },
  { lat: 408, lng: -322, image: 'workbenches/Blackthorn Stockyard/' },
  { lat: 129, lng: -406, image: 'workbenches/Grizzly Lodge/' },
  { lat: 475, lng: -12, image: 'workbenches/The Gasworks/' },
  { lat: 415, lng: 10, image: 'workbenches/The Gasworks/' },
  { lat: 415, lng: 35, image: 'workbenches/The Gasworks/' },
  { lat: 405, lng: -60, image: 'workbenches/The Gasworks/' },
  { lat: 345, lng: -60, image: 'workbenches/The Gasworks/' },
  { lat: 98, lng: -120, image: 'workbenches/O Donovan Stone/' },
  { lat: 117, lng: -103, image: 'workbenches/O Donovan Stone/' },
  { lat: 207, lng: 34, image: 'workbenches/Monteros Malt/' },
  { lat: 255, lng: 30, image: 'workbenches/Monteros Malt/' },
  { lat: 230, lng: 12, image: 'workbenches/Monteros Malt/' },
  { lat: 406, lng: 324, image: 'workbenches/Terminus Railyard/' },
  { lat: 151, lng: 280, image: 'workbenches/East Mountain Corn/' },
  { lat: 122, lng: 188, image: 'workbenches/East Mountain Corn/' },
  { lat: 13, lng: 282, image: 'workbenches/Machine Gorge/' },
  { lat: 13, lng: 87, image: 'workbenches/Split River Mill/' },
  { lat: -287, lng: 342, image: 'workbenches/Miners Folly/' },
  { lat: -277, lng: 346, image: 'workbenches/Miners Folly/' },
  { lat: -402, lng: 160, image: 'workbenches/Graystone Pit/' },
  { lat: -378, lng: 162, image: 'workbenches/Graystone Pit/' },
  { lat: -374, lng: 150, image: 'workbenches/Graystone Pit/' },
  { lat: -152, lng: 130, image: 'workbenches/Oro Gordo Mine/' },
  { lat: -127, lng: 104, image: 'workbenches/Oro Gordo Mine/' },
  { lat: -131, lng: 34, image: 'workbenches/Oro Gordo Mine/' },
  { lat: -98, lng: -66, image: 'workbenches/La Plata Mine/' },
  { lat: -70, lng: -74, image: 'workbenches/La Plata Mine/' },
  { lat: -93, lng: -280, image: 'workbenches/Deadfall Timber/' },
  { lat: -96, lng: -420, image: 'workbenches/Deadfall Timber/' },
  { lat: -141, lng: -380, image: 'workbenches/Deadfall Timber/' },
  { lat: -335, lng: -372, image: 'workbenches/Preston Oil/' },
  { lat: -380, lng: -359, image: 'workbenches/Preston Oil/' },
  { lat: -380, lng: -127, image: 'workbenches/Kingfisher Foundry/' },
  { lat: -343, lng: -44, image: 'workbenches/Kingfisher Foundry/' },
  { lat: -298, lng: -81, image: 'workbenches/Kingfisher Foundry/' }
], workbenchLayer, 'images/marker.png');
workbenchLayer.addTo(map);
