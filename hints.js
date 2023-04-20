// Leaflet can be a bit old-fashioned.
// Here's some code to remove map markers.
map.eachLayer((layer) => {
  if (layer instanceof L.Marker) {
    layer.remove();
  }
});