/*global angular*/

/**
The 'MRS.App.i18n' module provides access to terms that can vary from language to language, allowing multilanguage applications to be developed.

@module MRS.App.i18n
@beta
**/
angular.module('MRS.App.i18n', []).config(['$mrsappi18nConfig', '$httpProvider', function (config, $httpProvider) {
    'use strict';
    
    var defaultConfig = {
        resource: {
            path: "i18n/"
        }
    };

    // merge config with default
    angular.extend(config, defaultConfig, config);

    // adding $http interceptors
    $httpProvider.interceptors.push('languageInterceptor');
}]);

angular.module('MRS.App.i18n').run(['$mrsappi18nConfig', 'i18nTranslate', function mrsi18nRun(config, translate) {
    'use strict';
    
    // configuring translate service
    translate.basePath = config.resources.path;
}]);