angular.module('tester', ['ngRoute', 'MRS.i18n'])

.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/home', {
            templateUrl: 'home.html',
            controller: 'homeController'
        })
            .otherwise({
            redirectTo: '/home'
        });

    }])

.run(['translate', function (translate) {
    translate.basePath = '../src/resources/';
        translate.setDefaultLanguage('pt-br');
    }]);