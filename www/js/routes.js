
angular.module('starter.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html'
  
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
      
    })
  .state('app.menu', {
    url: '/menu',
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
    })
  .state('app.listaCerve', {
    url: '/listaCerve',
    templateUrl: 'templates/listaCerve.html',
    controller: 'Lista'
    })
  .state('app.listaBar', {
    url: '/listaBar',
    templateUrl: 'templates/listaBar.html',
    controller: 'Lista'     
    })
  .state('app.detalles', {
    url: '/detalles',
    templateUrl: 'templates/detalles.html',
    controller: 'Detalles'
    })
  .state('app.mapa', {
    url: '/mapa',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
});