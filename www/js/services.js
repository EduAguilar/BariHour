angular.module('starter.services', [])


    .service('MyService', function () {
        var property;
        var array;
        var ubicacion;
        var item;

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            },
            setUbicacion: function (value) {
                ubicacion=value;
            },
            getUbicacion: function () {
                return ubicacion;
            },
            getArray: function () {
                return array;
            },
            setArray: function(value) {
                array = value;
            },
            getItem: function () {
                return item;
            },
            setItem: function (value) {
                item=value;
            }
        };
    })
