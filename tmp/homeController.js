angular.module('tester')
    .controller('homeController', ['$scope', '$log', '$timeout', 'translate', function ($scope, $log, $timeout, translate) {

        var count = 1;

        $scope.items = [];
        $scope.updated = '';
        $scope.terms = {};

        $scope.addLogToConsole = function () {
            $scope.updated = '';
            $log.error('Erro' + count);
            count += 1;

            getLogs();
        };

        $scope.refreshList = function () {
            $scope.updated = '';
            getLogs();
        };

        $scope.translate = function (value) {
            $scope.terms.translation = translate.getTerm(value);
        };

        $scope.changeLanguage = function (language) {
            translate.setLanguage(language, function () {
                $scope.translate($scope.terms.term);
            });

        };

        /* var getLogs = function () {

            var promise = websqlProxy.send({
                dbname: 'mrs',
                version: '1.0',
                description: 'mrs db',
                maxSize: 5 * 1024 * 1024,
                query: 'select * from LOG'
            });

            promise.then(function (result) {
                $scope.items = [];

                for (var i = 0; i < result.length; i++) {
                    var row = result.item(i);

                    $scope.items[i] = {
                        creationDate: row['creationDate'],
                        message: row['message']
                    }
                }

                $scope.updated = 'Atualizado...';

            }, function (result) {
                console.log('error');
            });
        };

        getLogs();*/

    }]);