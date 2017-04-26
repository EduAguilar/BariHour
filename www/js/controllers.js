
angular.module('starter.controllers', [])


.controller('HomeCtrl', function($scope) {

  $scope.options = {
    autoplay: 6000,
    initialSlide: 0,
    loop: true,
    speed: 300,
  }
})

.controller('login',function($scope, $timeout, firebase, $state,$ionicModal){

  firebase.auth().onAuthStateChanged(function(user) {
    //muestra loadin hasta que termina de realizar el proceso de autenticacion
    
    if (user) {
      //console.log('user onAuthStateChanged ', user)
      // el usuario que esta logueado en firebase en la esta aplicacion
      //para poder cambiar por ahora hay que eliminar el usuario
      
      $state.go('app.menu', {});
    } else {
      // No user is signed in.
       //console.log ('no perteneca a firebase');
    }
  });
  var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid;
  //if (user) {
  if (user != null) {
    $state.go('app.menu', {});
  } 
  else {
    // No user is signed in.
     //$state.go('app.home', {});
     $scope.login_social= function(google){
    
    //inicio con popup
    var provider = new firebase.auth.GoogleAuthProvider();
      //firebase.auth().signInWithPopup(provider)
      firebase.auth().signInWithRedirect(provider)
      .then(function (result){
        //   This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      //$state.go('app.menu', {});

      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.error("Fallo en Authentication google:", error);
         // ...
      })
      //$state.go('app.menu', {});

      //inicio con redirect
      /*var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // ...
        }
        // The signed-in user info.
        var user = result.user;
        $state.go('app.menu', {});
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
         // ...
      });*/
    }
    $scope.loginFace=function(Facebook){
        //console.log('face');
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithRedirect(provider)

        //firebase.auth().signInWithPopup(provider)
        .then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          //var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          //var credential = error.credential;
          if (errorCode === 'auth/wrong-password') {
          alert('password incorrecto');
        } else {
          alert(errorMessage);
        }
          // ...
        })
      }
      $scope.doLoginAction= function(creds){
        firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error("Fallo en Authentication :", erroCode);
          // ...
        });
      }// doLoginAction
      $scope.doCreateUserAction=function(creds){
        firebase.auth().createUserWithEmailAndPassword(creds.email, creds.password)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
      }
      $scope.doLoginAnonymus=function(){
      firebase.auth().signInAnonymously()
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });      
      }
    }//sale del else
})

.controller('userCtrl',function($scope, $timeout, firebase, $state){
  var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid;
  //if (user) {
  if (user != null) {
    //console.log ('userCtrl',user);
    //$state.go('app.menu', {});
    //muestro los valores de la base de datos firebase por consola
    /*user.providerData.forEach(function (profile) {
    console.log("Sign-in provider: "+profile.providerId);
    console.log("  Provider-specific UID: "+profile.uid);
    console.log("  Name: "+profile.displayName);
    console.log("  Email: "+profile.email);
    console.log("  Photo URL: "+profile.photoURL);
  });*/

    //User is signed in.
    $scope.name = user.displayName;
    $scope.email = user.email;
    $scope.photoUrl = user.photoURL;
    $scope.uid = user.uid;
    //console.log('email: ',$scope.uid);
  } 
  else {
    $state.go('home', {});
  };

  $scope.doLogout = function () {
      $timeout(function () {
        $state.go('home', {})
      }, 1);

      firebase.auth().signOut()
      .then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = null;
          // The signed-in user info.
          var user = null;
          // ...
        })
      console.log("Saliendo (user)...");

    }
    $scope.cambiarUser=function(){
      var user = firebase.auth().currentUser;
    user.delete()
    firebase.auth().signOut()
    //console.log("cambiar user ...");
    console.log("Saliendo (user)...");
      /*console.log ('cambiar usuario');
      var user= firebase.auth().currentUser;
      console.log("borrado ...",user);
      firebase.auth().signOut()
      console.log("Cambiar ...",user);*/
      $state.go('home', {})
    }
})

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
          
         
          //Descripcion para cada marcador en su infoWindows
          var infoWindow = new google.maps.InfoWindow({
            content:  '<div id="name"> <b><u>'
            +value.name+'</b></u><br>'+ value.horario+'<br>Happy de '+value.start+' a '+value.end+
            '<br><a class="button button-clear button-dark" href="#/app/detalles"'
            +'ng-click="detalle()"><b>Ver Mas</b></a></div>'
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
  var today = $filter('date')(new Date(),'HH:mm');

var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
var f=new Date();
var fecha=(diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());
var day= diasSemana[f.getDay()];

  $scope.detalle = function(e) {
    MyService.setItem(e);
    }

   $scope.bounce = function(id) { 
        var item=$scope.data.marcadores[id];
       
          //Verifica si esta entre el horario y cambia el icono
            if (today>item.start && today<item.end){
              return true;}
            else{
              return false;}
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
         html +=' <div class="mySlides fade set"><img src='+
         value.imagen+' ></div>';
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
})

.controller('PopupCtrl',function($scope, $ionicPopup, $timeout, $state, $firebase) {

// Triggered on a button click, or some other target
$scope.showPopup = function(a) {
  $scope.creds = {};


  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '    <label class="item item-input item-floating-label"><span class="input-label" style="color: #FFFFFF">Usuario</span><input type="text" placeholder="Usuario" ng-model="creds.email" style="color: #FFFFFF"></label><label class="item item-input item-floating-label"><span class="input-label" style="color: #FFFFFF">Contraseña</span><input type="password" placeholder="Contraseña" ng-model="creds.password" style="color: #FFFFFF"></label>',
    title: '<b>Iniciar Sesión</b>',
    subTitle: 'Por favor ingrese sus datos',
    scope: $scope,
    buttons: [
      {
        text: '<b>Entrar</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.creds.password) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.creds.email, $scope.creds.password;
          }


        }
      },
      { text: 'Cancelar' }
    ]
  });

  myPopup.then(function(res) {
    if(res) {    

        firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error("Fallo en Authentication :", erroCode);
          // ...
        });



       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }

  });


/*
  $timeout(function() {
     myPopup.close(); //close the popup after 10 seconds for some reason
  }, 10000);*/
 };


 // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Atención',
     template: 'Al ingresar como usuario anónimo, habran funcionalidades que no podra utilizar. Siempre recomendamos ingresar con usuario, en especial si es dueño de un local o administra uno. <br> Si aun así desea ingresar como anónimo haga click en <b>continuar</b> o en <b>cancelar</b> para iniciar sesion con algun usuario.',
     cancelText: 'Cancelar',
     okText: 'Continuar',
   });

   confirmPopup.then(function(res) {

     if(res) {    
      document.location.href = "#/app/menu";
     
      
       console.log('You are sure');
     } else {        
      $timeout(function () {
        $state.go('login', {})
      }, 1);

      firebase.auth().signOut()
      console.log("Saliendo (user)...");

     }
   });
 };

 // An alert dialog
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: '¡Bienvenido a BariHour!',
     template: 'Le damos la bienvenida a la aplicación, y esperamos que la disfrute.<br> Si tiene dudas sobre la aplicación siempre podrá acceder al menu de ayuda que se encuentra en la esquina superior derecha con el icono <button class="button button-clear button-stable  ion-information-circled"></button> <br> Para sugerencias o fallas puede reportarlas al correo barihours@gmail.com o contactarse con cualquiera del equipo de desarrollo.',
     buttons: [
      {
        text: '<b>Continuar</b>',
        type: 'button-positive',
      },
      { text: 'Cancelar' }
    ]
   });

   alertPopup.then(function(res) {
    console.log('Thank you for not eating my delicious ice cream cone');
   });
 };
});