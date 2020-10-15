var topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    minZoom: 1.5,
    maxZoom: 18,
    id: "mapbox.topomap",
    accessToken : API_KEY
});

var watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18, 
    id: "mapbox.watercolor",
    subdomains: 'abcd',
	minZoom: 1.5,
	maxZoom: 16,
    ext: 'jpg',
    accessToken : API_KEY
});

var natgeo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    minZoom: 1.5,
    maxZoom: 16,
    id: "mapbox.natgeo",
    accessToken: API_KEY
});

var myMap = L.map("map", {
    center: [
        0, 0
    ],
    zoom: 2,
    layers: [topomap, watercolor, natgeo]
});

topomap.addTo(myMap);

var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

var baseMaps = {
    Topomap: topomap,
    WaterColor: watercolor,
    NatGeo: natgeo
  };
  
var overlays = {
"Tectonic Plates": tectonicplates,
Earthquakes: earthquakes
};

L
    .control
    .layers(baseMaps, overlays)
    .addTo(myMap)

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {
// data = d
    function styleParameters(feature) {
            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: getColor(feature.properties.mag),
                color: "#000000",
                radius: getRadius(feature.properties.mag),
                stroke: true,
                weight: 0.5
        };
    }

    function getColor(magnitude) {
        switch(true) {
            case magnitude > 5:
                return "#4F0147";
            case magnitude > 4:
                return "#DB3A34";
            case magnitude > 3: 
                return "#FF8552";
            case magnitude > 2:
                return "#FFC100";
            case magnitude > 1:
                return "#F1A66A";
            default:
                return "#FFEAAE";
        }
    }

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleParameters,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakes);

    earthquakes.addTo(myMap);

    var legend = L.control({
        position: "bottomright"
        });
        
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];

        var colors = [
        "#FFEAAE",
        "#F1A66A",
        "#FFC100",
        "##FF8552",
        "#DB3A34",
        "#4F0147"  
        ];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
              grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
          return div;
        };

        legend.addTo(myMap);

        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
        function(platedata) {
        
          L.geoJson(platedata, {
            color: "black",
            weight: 2
          })
          .addTo(tectonicplates);
             
          tectonicplates.addTo(myMap);
        });
    });