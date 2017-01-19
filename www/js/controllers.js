
angular.module('starter.controllers', [])

.controller('MenuCtrl', function($scope,MyService,$http,$cordovaGeolocation) {

  $scope.myFunc = function(e) {
        MyService.setProperty(e);
     
    };
    $cordovaGeolocation.getCurrentPosition()
    .then(function(position) {
      MyService.setLocation(position);
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
  var lat=MyService.getLat();
  var lon=MyService.getLon();
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
            icon: {url:value.iconMarKer},
            position: {lat: value.lat,lng: value.lng}
          });
          
         
          //Descripcion cada marcador en su infoWindows
          var infoWindow = new google.maps.InfoWindow({
            content:  '<div id= "contentInfo"><div id="name"> <b><u>'
            +value.name+'</b></u></div>'+ value.horario+'<br>Happy de '+value.start+' a '+value.end+
            '<br><div><a class="button button-clear button-dark" href="#/app/detalles"'
            +'ng-click="detalle()"><b>Ver Mas</b></a> </div></div>'
          })

          //Accion del click sobre cada marcador - Abrir/cerrar infoWindows
          google.maps.event.addListener(marker, 'click', function(idmarker,key){

            if( prev_infowindow ) {
              prev_infowindow.close();
            }
          
            //Guarda el valor del marcador clickeado para luego pasar este valor a detalle()
            MyService.setItem(value.id);

            prev_infowindow = infoWindow;
            infoWindow.open($scope.map, this);       
          });
        }
      })
      function CenterControl(controlDiv, map) {

              // Set CSS for the control border.
              var controlUI = document.createElement('div');
              controlUI.style.backgroundColor='#fff';
              controlUI.style.border = '2px solid #fff';
              controlUI.style.borderRadius = '3px';
              controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
              controlUI.style.marginBottom = '22px';
              controlUI.style.marginRight = '8px';
              controlUI.style.textAlign = 'center';
              controlDiv.appendChild(controlUI);

              // Set CSS for the control interior.
              var controlText = document.createElement('div');
              controlText.style.color = 'rgb(25,25,25)';
              controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
              controlText.style.fontSize = '12px';
              controlText.style.lineHeight = '38px';
              controlText.style.paddingLeft = '5px';
              controlText.style.paddingRight = '5px';
              controlText.innerHTML = '<b>GPS</b>';
              controlUI.appendChild(controlText);

              // Setup the click event listeners: go to your location.
              controlUI.addEventListener('click', function() {
                if (lat)
                map.setCenter(new google.maps.LatLng(lat, lon));
              });

            }


              // Create the DIV to hold the control and call the CenterControl() constructor
              // passing in this DIV.
              var centerControlDiv = document.createElement('div');
              var centerControl = new CenterControl(centerControlDiv, $scope.map);
              centerControlDiv.index = 1;
              $scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
    })
})


.controller('Lista',function($scope, MyService,$filter) {
  $scope.data=MyService.getArray();
  $scope.detalle = function(e) {
    MyService.setItem(e);
    }
   $scope.bounce = function(x) { 
  	      //Verifica si esta entre el horario y cambia el icono
  	      var today = $filter('date')(new Date(),'HH:mm:ss');
          if (today>x.start && today<x.end)
            return 0;
          else
          	return 1;
          }
})


.controller('Detalles',function($scope, MyService,$ionicHistory) {
$scope.data=MyService.getArray();
$scope.id=MyService.getItem();
$scope.item=$scope.data.marcadores[$scope.id];

      //creo un mini mapa con el marcador en el item.
      var myCenter = new google.maps.LatLng($scope.item.lat,$scope.item.lng);
      
      var mapProp = {
          center: myCenter,
          zoom: 15,
          draggable: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
      };
      $scope.mapa = new google.maps.Map(document.getElementById("mapa"),mapProp);
      marker = new google.maps.Marker({
          position: myCenter,
      });
      marker.setMap($scope.mapa);
      var html;
        angular.forEach($scope.item.image, function(value, key){
         html +=' <div class="mySlides fade"><img src='+
         value.imagen+' class="set"></div>';
        });
      document.getElementById('contenido').innerHTML=html;
      var slideIndex = 0;
      showSlides();
      //Controlador de la galeria de imagenes.
      function showSlides() {
          var i;
          var slides = document.getElementsByClassName("mySlides");
          for (i = 0; i < slides.length; i++) {
             slides[i].style.display = "none";
          }
          slideIndex++;
          if (slideIndex> slides.length) {slideIndex = 1}
          slides[slideIndex-1].style.display = "block";
          setTimeout(showSlides, 3000); // Change image every 2 seconds
      }


});