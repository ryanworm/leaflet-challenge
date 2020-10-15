var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2.1
});


L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/outdoors-v11",
        tileSize: 512,
        minZoom: 1.5,
        maxZoom: 16,
        zoomOffset: -1,
        accessToken: API_KEY
    }
).addTo(myMap)

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

    // magnitude = m
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
    }).addTo(myMap)

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
            "#FF8552",
            "#DB3A34",
            "#4F0147"    
        ];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
            return div;
        };
        legend.addTo(myMap);
    });

