var map
var markers = []
var filters = {sunday:false}
$(function () {
    $('input[name=filter]').change(function (e) {
     map_filter(this.id);
      filter_markers()
  });
})
var get_set_options = function() {
  ret_array = []
  for (option in filters) {if (window.CP.shouldStopExecution(1)){break;}
    if (filters[option]) {
      ret_array.push(option)
    }
  }
window.CP.exitedLoop(1);
  return ret_array;
}
var filter_markers = function() {  
  set_filters = get_set_options()
  for (i = 0; i < markers.length; i++) {if (window.CP.shouldStopExecution(3)){break;}
    marker = markers[i];
    keep=true
    mapset = map
    for (opt=0; opt<set_filters.length; opt++) {if (window.CP.shouldStopExecution(2)){break;}
      if (!marker.properties[set_filters[opt]]) {
        keep = false;
      }
    }
window.CP.exitedLoop(2);
    marker.setVisible(keep)
  }
window.CP.exitedLoop(3);
}
var map_filter = function(id_val) {
   if (filters[id_val]) 
      filters[id_val] = false
   else
      filters[id_val] = true
}
     var customLabel = {
        calle: 'afexcalle.png',
        mall: 'afexmall.png',
        galeria: 'afexcalle.png',
        aeropuerto: 'afexaeropuerto.png',
        mallnuevo: 'afexmallnuevo.png',
        callenuevo: 'afexcallenuevo.png'
      };
function loadMarkers() {
  console.log('creating markers')
  var infoWindow = new google.maps.InfoWindow({maxWidth: 350})
  geojson_url = 'https://raw.githubusercontent.com/afexmarketing/Maps-AFEX/master/collection.geojson'
  $.getJSON(geojson_url, function(result) {
      data = result['features']
      $.each(data, function(key, val) {
        var point = new google.maps.LatLng(
                parseFloat(val['geometry']['coordinates'][1]),
                parseFloat(val['geometry']['coordinates'][0]));
        var titleText = val['properties']['title']
        var descriptionText = val['properties']['description']
        var lunvieText = val['properties']['lunvie']
        var sabText = val['properties']['sab']
        var domText = val['properties']['dom']
        var tlfText = val['properties']['tlf']
        var icon = customLabel[val['properties']['tipo']] || {}
        var marker = new google.maps.Marker({
          position: point,
          title: titleText,
          map: map,
          properties: val['properties'],
          icon: icon
         });
        var markerInfo = "<div><h3>" + titleText + "</h3>Direcci&oacute;n: " + descriptionText + "<br><br>Horario de atención:<br>Lunes a Viernes <strong>" + lunvieText + "</strong> <br>S&aacute;bado <strong>" + sabText + "</strong> <br>Domingo <strong>" + domText +"</strong><br><br>Tel&eacute;fono <strong>" + tlfText + "</strong></div>"
        marker.addListener('click', function() {
              infoWindow.close()
              infoWindow.setContent(markerInfo)
              infoWindow.open(map, marker)
            });
        markers.push(marker)
      });
  });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(infoWindow.close());
}
google.maps.event.addDomListener(window, 'load', initMap);
function initAutocomplete() {
    map_options = {
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      center: {lat: -30, lng: -72}
    }
    map_document = document.getElementById('map')
    map = new google.maps.Map(map_document,map_options);
    loadMarkers()
  var infoWindowhere = new google.maps.InfoWindow()
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
  var here = new google.maps.Marker({position: pos, map: map, icon: 'here.png'});
      map.setCenter(pos);
      map.setZoom(13);
      infoWindowhere.close()
      infoWindowhere.setContent('Usted está aquí')
      infoWindowhere.open(map, here)
      ;
      markers.push(here)
    }, function() {
      handleLocationError(true, here, map.getCenter());
    });
  } else {
    handleLocationError(false, here, map.getCenter());
  }
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  var markers = [];
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}