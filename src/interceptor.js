/**
    The languageInterceptor intercepts all calls to the $http service and adds an accept-language header.
    
    @class languageInterceptor
    @namespace MRS.App.i18n
    @since 0.1.0
**/
angular.module('MRS.App.i18n').factory('languageInterceptor', ['i18nTranslate', function mrsi18nLanguageInterceptor(translate) {
    'use strict';
    
    return {
        /**
            Parses the $http request options and adds the sessionID header, if present.
    
            @method request
            @param config {Object} $http request options
            @returns {Object} $http request options
        **/
        request: function languageInterceptorRequest(config) {
            
            config.headers['Accept-Language'] = translate.getSelectedLanguage();
            
            return config;
        }
    };
}]);