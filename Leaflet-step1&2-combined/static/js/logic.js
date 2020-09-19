

var API_KEY = "pk.eyJ1IjoiaXlrMjA2IiwiYSI6ImNrZHFsam5vZzAzMGwzM251NXlydjJwMDIifQ.VLH8ElBIJmC4qeQoUM-n9g";



    // Adding tile layer
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
    });

var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
    });

var myMap = L.map("map-id", {
    center: [34.0522, -118.2437],
    zoom: 4,
    layers: [streetMap, satelliteMap, outdoorMap]
    });

streetMap.addTo(myMap);

var baseMaps = {
    Street: streetMap,
    Satellite: satelliteMap,
    Outdoor: outdoorMap
};


var tectonicLayer = new L.LayerGroup()
var earthquakeLayer = new L.LayerGroup()

var overlays = {
    Tectonic: tectonicLayer,
    Earthquakes : earthquakeLayer
};

L
  .control
  .layers(baseMaps, overlays)
  .addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
    function sortByColor(magnitude) {
        switch(true) {
            case magnitude > 5:
                return "#a83232";
            case magnitude > 4:
                return "#ea752c";
            case magnitude > 3:
                return "#e7ea2c";
            case magnitude > 2:
                return "#2c82e6";
            case magnitude > 1:
                return "#19e0ae";
            default:
                return "#e1ebe8";
        }
    };

    function EQRadius(magnitude) {
        return magnitude*6;
    };

    function styleFunction(feature) {
        return {
                opacitiy: 0.5,
                fillOpacity: 0.8,
                fillColor: sortByColor(feature.properties.mag),
                radius: EQRadius(feature.properties.mag),
                weight: 0.2
                
            }
        }
    
    L.geoJson(data,{
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
                },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude:" + feature.properties.mag + "<br>Location" + feature.properties.place);
        },
        style: styleFunction
        
    }).addTo(earthquakeLayer);
    earthquakeLayer.addTo(myMap);

    var legend = L.control({
        position: "bottomleft" 
    });

    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "legend");
        var intensity = [0, 1, 2, 3, 4, 5]
        var colors = [
            "#e1ebe8",
            "#19e0ae",
            "#2c82e6",
            "#e7ea2c",
            "#ea752c",
            "#a83232"
        ]
    for (var i = 0; i < intensity.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        intensity[i] + (intensity[i + 1] ? "&ndash;" + intensity[i + 1] + "<br>" : "+");
        }
        return div;
    }

    
    legend.addTo(myMap);

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(tectonicPlates) {
        L.geoJson(tectonicPlates, {
            color: "#420a16",
            weight: 2
        }).addTo(tectonicLayer);
        tectonicLayer.addTo(myMap);
    }
    )
})
