
angular.module('starter.controllers', [])



.controller('AppCtrl', function($scope,MyService,$http,$cordovaGeolocation) {

  $scope.myFunc = function(e) {
        MyService.setProperty(e);
     
    };
    $cordovaGeolocation.getCurrentPosition()
    .then(function() {
    })
    .catch(function() {
      console.log("Error de ubicacion")
      alert("Por favor enciende el GPS")

    })

    if(MyService.setArray()==null){
    $http.get('js/markers.json').then(function(response){
    MyService.setArray(response.data);
            })}
  })
  
.controller('MapCtrl', function($scope,$cordovaGeolocation, $http, $filter, MyService) {

  $scope.centrado=(MyService.getUbicacion());
  $scope.opcion=(MyService.getProperty());
  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var marker = new google.maps.Marker({
        map: $scope.map,
        position: latLng
      });  

    })
  //defino estilo de mapa para borrar negocios
  var myStyle = [{
    stylers: [
      { hue: "#00ffe6" },
      { saturation: -20 }
    ]},  
    {
      featureType: "poi.business", 
      elementType: "labels", 
      stylers: [{ visibility: "off"}]
    }
  ];

  var styledMap = new google.maps.StyledMapType(myStyle, {name: "Styled Map"});
  
  //GPS aveces incorrecto
  /*var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);*/
  latLngCentro = new google.maps.LatLng(-41.135893,  -71.310535);
 
  var mapOptions = {
    mapTypeControlOptions: {
      mapTypeIds: ['myStyle']}, 
      center: latLngCentro,
      zoom: 17,
      mapTipeId: 'myStyle'
  };
  
  //Creo mapa
  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Le asigno el estilo de mapa personalizado
    $scope.map.mapTypes.set('map_style', styledMap);
    $scope.map.setMapTypeId('map_style');

    //valor inicial para variable de infowindow
    var prev_infowindow =false; 

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      //Espera hasta que el mapa haya cargado
      var today = $filter('date')(new Date(),'HH:mm:ss');
    
      //Marcadores
      $scope.data=MyService.getArray();

      //Loop json
      angular.forEach($scope.data.marcadores, function(value, key){
        //Verifica si esta entre el horario y cambia el icono
        if ($scope.opcion==value.tipo|| $scope.opcion==0){
          if (today>value.start && today<value.end){
            var animation=google.maps.Animation.BOUNCE
          }
          //Setea marcador
          marker = new google.maps.Marker({
            map: $scope.map,
            animation: animation,
            title: value.name,
            icon: {url:value.icon},
            position: {lat: value.lat,lng: value.lng}
          });

          //Descripcion cada marcador   
          var infoWindow = new google.maps.InfoWindow({
            content: value.name           


          });

          google.maps.event.addListener(marker, 'click', function(){
            if( prev_infowindow ) {
              prev_infowindow.close();
            }

            prev_infowindow = infoWindow;
            infoWindow.open($scope.map, this);
          });
        }
      })
    })
})


.controller('Lista',function($scope, MyService,$filter) {
  $scope.data=MyService.getArray();
  $scope.detalle = function(e) {
    MyService.setItem(e);
    };
})

.controller('Detalles',function($scope, MyService) {
$scope.data=MyService.getArray();
$scope.id=MyService.getItem();
$scope.item=$scope.data.marcadores[$scope.id];

});


/*directionsDisplay = new google.maps.DirectionsRenderer({
=======



});
/*

directionsDisplay = new google.maps.DirectionsRenderer({
>>>>>>> 0d4084245e29ca74499f5a469a91f78669b54722
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
*/







