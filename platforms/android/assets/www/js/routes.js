
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
    templateUrl: 'templates/tabs.html',  
    })
  .state('app.menu', {
    url: '/menu',
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'
    })
  .state('app.listaCerve', {
    cache: false,
    url: '/listaCerve',
    templateUrl: 'templates/listaCerve.html',
    controller: 'Lista'
    })
  .state('app.listaBar', {
    cache: false,
    url: '/listaBar',
    animation: 'slide-in',
    templateUrl: 'templates/listaBar.html',
    controller: 'Lista'     
    })
  .state('app.listaPubs', {
    cache: false,
    url: '/listaPubs',
    templateUrl: 'templates/listaPubs.html',
    controller: 'Lista'     
    })  
  .state('app.detalles', {
    cache: false,
    url: '/detalles',
    templateUrl: 'templates/detalles.html',
    controller: 'Detalles'
    })
  .state('app.mapa', {
    cache:false,
    url: '/mapa',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
});