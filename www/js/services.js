angular.module('starter.services', [])


    .service('MyService', function () {
        var property;
        var array;
        var item;
        var lat;
        var long;

        return {
            getLat: function () {
                return lat;
            },
            getLon: function () {
                return long;
            },
            setLocation: function(value) {
                lat = value.coords.latitude;
                long = value.coords.longitude;
            },
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
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
