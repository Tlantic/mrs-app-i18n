/**
The 'MRS.i18n' module provides access to terms that can vary from language to language, allowing multilanguage applications to be developed.

@module MRS.i18n
@beta
**/
angular.module('MRS.i18n', []).config(['$httpProvider', function ($httpProvider) {
    'use strict';
    
    // adding $http interceptors
    $httpProvider.interceptors.push('languageInterceptor');
}]);

angular.module('MRS.i18n').run(['$mrsi18nConfig', 'translate', function mrsi18nRun(config, translate) {
    'use strict';
    
    // configuring translate service
    translate.basePath = config.resources.path;
}]);