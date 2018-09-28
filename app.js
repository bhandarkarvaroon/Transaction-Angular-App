var app;
(function () {
    'use strict'; //Defines that JavaScript code should be executed in "strict mode"  
    app = angular.module("myApp", ['ngAnimate', 'ui.bootstrap']);
    
    app.directive("userPanel",function(){
        return {
            templateUrl:'UserPanel.html'
        }
    });
})();