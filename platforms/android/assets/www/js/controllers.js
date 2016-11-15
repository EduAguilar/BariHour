angular.module('starter.controllers', ['ngCordova'])
.controller('MapCtrl', function($scope,$cordovaGeolocation, $http, $filter) {
  


  var options = {timeout: 5, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 //defino estilo de mapa para borrar negocios
    var myStyle = [
    {
    stylers: [
      { hue: "#00ffe6" },
      { saturation: -20 }
    ]
  },
     
{         
          featureType: "poi.business", 
          elementType: "labels", 
          stylers: [ 
              { visibility: "off" } 
          ]
        }
        ];
        var styledMap = new google.maps.StyledMapType(myStyle, {name: "Styled Map"});
    //GPS aveces incorrecto
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    latLngCentro = new google.maps.LatLng(-41.135893,  -71.310535);
    var mapOptions = {
      mapTypeControlOptions: { 
        mapTypeIds: ['myStyle'] 
      }, 
      center: latLngCentro,
      zoom: 17,
      mapTipeId: 'myStyle'
    };
    //Creo mapa
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Le asigno el estilo de mapa personalizado
    $scope.map.mapTypes.set('map_style', styledMap);
    $scope.map.setMapTypeId('map_style');
    var markers=[];
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: latLng
  });  
    //Espera hasta que el mapa haya cargado
google.maps.event.addListenerOnce($scope.map, 'idle', function(){



directionsDisplay = new google.maps.DirectionsRenderer({
              });
start  = new google.maps.LatLng(-41.135893,  -71.310535);
  end = new google.maps.LatLng(-41.135893,  -71.310000);   
var directionsService = new google.maps.DirectionsService();
var request = {
                  origin: start,
                  destination: end,
                  optimizeWaypoints: true,
                  travelMode: google.maps.DirectionsTravelMode.WALKING
              };
directionsService.route(request, function(response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                      directionsDisplay.setDirections(response);
                      var route = response.routes[0];

                  }
              });














//Hora actual en hh:mm:ss
var today = $filter('date')(new Date(),'HH:mm:ss');
//Marcadores
//Carga Json
$http.get('js/markers.json').then(function(response){
            $scope.data = response.data;
  //Loop json
  angular.forEach($scope.data.marcadores, function(value, key){
  //Verifica si esta entre el horario y cambia el icono
  if (today>value.start && today<value.end){
      //value.icon="";
       var animation=google.maps.Animation.BOUNCE}
  //Setea marcador
  marker = new google.maps.Marker({
      map: $scope.map,
      animation: animation,
      title: value.descrip,
      icon: {url:value.icon},
      position: {lat: value.lat,
                  lng: value.lng}
  });  
  //setTimeout(marker, 15);

    //Descripcion cada marcador   
   var infoWindow = new google.maps.InfoWindow({
      content: value.descrip
    });
   //Agrega Evento de click
   google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
  });
       markers.push(marker);








})  

})  
})
})
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('PlaylistsCtrl', function($scope) {
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
