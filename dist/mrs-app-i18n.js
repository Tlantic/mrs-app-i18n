/*! mrs-app-i18n - v0.5.1 - 2015-06-19 17:12:05 GMT */
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
/**
The translate service is responsible for loading resource files with translated terms and provide terms requested by the application, based on a specific or default language.

@class i18nTranslate
@namespace MRS.App.i18n
@since 0.5.0
**/
angular.module('MRS.App.i18n').service('i18nTranslate', ['$log', '$timeout', function mrsi18nTranslate($log, $timeout) {
    'use strict';
    
    var loadResources,
        self = this,
        
        /**
            List of loaded terms in differente languages.
                
            @private
            @property resources
            @type Array
        **/
        resources = [],
        
        /**
            Code of the default language. It will be used either no selected language is specified or no term is found using the selected language.
                
            @private
            @property defaultLanguage
            @type String
        **/
        defaultLanguage,
        
        /**
            Code of the selected language, independent of the default language selected.
                
            @private
            @property selectedLanguage
            @type String
        **/
        selectedLanguage;
    
    /**
            Base path to the resource files to be dinamically loaded by the service.
                
            @public
            @property basePath
            @type String
        **/
    self.basePath = '';
    
    /* 
            'en-us': {
                'name': 'Nome',
                'gender': 'sexo'
            },
            'es-es': {
                'name': 'Nombre',
                'gender': 'sexo'
            },                
            'fr-fr': {
                'name': 'nom'
            }                
        */
    
    /**
        Load resource files in json format of the specified language.
        The file must be located in the path defined in the basePath parameter and the file must follow the pattern 'resources.[language].json'
            
        @private
        @method loadResources
        @param language {String} Language to be loaded (ex: pt-br, en-us).
        @param callback {object} Callback function to be executed once the file is successfully loaded.
    **/
    loadResources = function translateLoadResources(language, callback) {
        
        var resourceFile = self.basePath + 'resources.' + language + '.json';
        
        window.tlantic.system.readJSONFile(resourceFile, function (result) {
            resources[language] = result;
            
            if (callback !== undefined) {
                $timeout(function () {
                    callback();
                });
            }
        }, function loadResourcesCallback() {
            $log.error('File [' + resourceFile + '] was not found.');
        });
    };
    
    /**
        Defines a default language in which the terms will be searched against.
        This method will automamatically try to search for a file named [base_path]resources.[language].json and load its terms into the resources table.

        @method setDefaultLanguage
        @param language {String} Default language (ex: pt-br, en-us).
        @param callback {object} Callback function to be executed once the file is successfully loaded.
    **/
    self.setDefaultLanguage = function translateSetDefaultLanguage(language, callback) {
        defaultLanguage = language;
        selectedLanguage = language;
        
        loadResources(language, callback);
    };
    
    /**
        Defines a specific language in which the terms will be searched against.
        This method will automamatically try to search for a file named [base_path]resources.[language].json and load its terms into the resources table.

        @method setLanguage
        @param language {String} Specific language (ex: pt-br, en-us).
        @param callback {object} Callback function to be executed once the file is successfully loaded.
    **/
    self.setLanguage = function translateSetLanguage(language, callback) {
        // unload additional languages
        if (defaultLanguage !== selectedLanguage && defaultLanguage !== language && selectedLanguage !== language) {
            delete resources[selectedLanguage];
        }
        
        if (defaultLanguage !== language && selectedLanguage !== language) {
            // set the new custom language
            selectedLanguage = language;
            
            // load resources
            loadResources(language, callback);
        } else {
            if (callback !== undefined) {
                $timeout(function () {
                    callback();
                });
            }
        }
    };
    
    /**
        Return the default language.
        
        @method getDefaultLanguage
        @public
    **/
    self.getDefaultLanguage = function translateGetDefaultLanguage() {
        return defaultLanguage;
    };
    
    /**
        Return the selected language.
        
        @method getSelectedLanguage
        @public
    **/
    self.getSelectedLanguage = function translateGetSelectedLanguage() {
        return selectedLanguage;
    };
    
    /**
        Searches for a specific term in the specified or default language.

        @method getTerm
        @param term {String} Unique key associated with the term to be searched.
        @param language {String} Language of the searched term (ex: pt-br, en-us).
        @param arguments {String} Values to replace tokens in the term. The term must contain tokens in the format {0}, {1} and so on.
    **/
    self.getTerm = function translateGetTerm(term, language) {
        var translation,
            translationFound = false,
            count = 0,
            i;
        
        if (term !== undefined) {
            if (language === undefined) {
                language = selectedLanguage;
            }
            
            if (language === undefined) {
                $log.error('There must be a default language defined for the application.');
            } else {
                if (resources[language] !== undefined && (translation = resources[language][term]) !== undefined) {
                    //translation = resources[language][term];
                    translationFound = true;
                }
                
                // fallback to the default language
                if (translationFound === false) {
                    if (selectedLanguage !== language && defaultLanguage !== language) {
                        $log.warn('Translation not found for language [' + language + '] and term [' + term + '].');
                    }
                    
                    language = defaultLanguage;
                    
                    if (resources[language] !== undefined && (translation = resources[language][term]) !== undefined) {
                        //translation = resources[language][term];
                        translationFound = true;
                    }
                    
                    if (translationFound === false) {
                        $log.warn('Translation not found for language [' + language + '] and term [' + term + '].');
                    }
                }
            }
            
            if (translation !== undefined && arguments.length > 2) {
                for (i = 2; i < arguments.length; i += 1) {
                    translation = translation.replace('{' + count + '}', arguments[i]);
                    count += 1;
                }
            }
            
        } else {
            $log.warn('Term is required.');
        }
        
        return translation;
    };
    
}]);

/**
    The i18n filter allows views to embed texts that must be localizable.
    
    @class i18n
    @namespace MRS.App.i18n
	@since 0.1.0
**/
angular.module('MRS.App.i18n').filter('i18n', ['i18nTranslate', function mrsi18ni18n(translate) {
    'use strict';
    
    /**
        @constructor
        @param term {String} Term to be translated
        @param language {String} Target language
    **/
    return function i18nFilter(term, language) {
        return translate.getTerm(term, language);
    };
}]);