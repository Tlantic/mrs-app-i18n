describe('MRS.i18n:', function () {
    'use strict';
    
    describe('translate service:', function () {
        
        var translateService, logService, timeoutService, fakeServer;
        
        beforeEach(module('MRS.i18n'));
        
        beforeEach(inject(function (translate, $log, $timeout) {
            translateService = translate;
            logService = $log;
            timeoutService = $timeout;
            
            fakeServer = sinon.fakeServer.create();
            spyOn(logService, 'warn');
            spyOn(logService, 'error');
        }));
        
        afterEach(function () {
            fakeServer.restore();
        });
        
        it('should get a term in the default language', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                "message": "MSG pt-br"
            }));
            
            expect(translateService.getTerm('message')).toBe('MSG pt-br');
        });
        
        it('should get a term in the selected language if found', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG pt-br"
            }));
            
            translateService.setLanguage('es-es');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG es-es"
            }));
            
            expect(translateService.getTerm('message')).toBe('MSG es-es');
        });
        
        it('should not reload resources if it´s already loaded', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG pt-br"
            }));
            
            var flag = false;
            
            spyOn(console, 'log');
            
            runs(function () {
                translateService.setLanguage('pt-br', function () {
                    console.log('must not be called.');
                    flag = true;
                });
                
                // defining response
                fakeServer.requests[0].respond(200, {
                    "Content-Type": "application/json"
                }, JSON.stringify({
                    message: "MSG pt-br"
                }));
            });
            
            waits(function () {
                return flag;
            }, "Operation not yet finished.", 10);
            
            runs(function () {
                expect(console.log).not.wasCalled();
            });
        });
        
        it('should get a term in the default language if specified language is not found', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG pt-br"
            }));
            
            translateService.setLanguage('fr-fr');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, undefined);
            
            expect(translateService.getTerm('message')).toBe('MSG pt-br');
        });
        
        it('should fall back to the default language if language is not found', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG pt-br"
            }));
            
            var res = translateService.getTerm('message', 'zh-cn');
            
            expect(res).toEqual('MSG pt-br');
            expect(logService.warn).wasCalled();
        });
        
        it('should not work when key is not provided', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG pt-br"
            }));
            
            var res = translateService.getTerm(null);
            
            expect(res).toEqual(null);
            expect(logService.warn).toHaveBeenCalled();
        });
        
        it('should not work when default language is not set', function () {
            var res = translateService.getTerm('message');
            
            expect(res).toEqual(null);
            expect(logService.error).toHaveBeenCalled();
        });
        
        
        it('should not work when term is not found', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG pt-br"
            }));
            
            var res = translateService.getTerm('blahhh');
            
            expect(res).toEqual(null);
            expect(logService.warn).toHaveBeenCalled();
        });
        
        it('should delete custom language terms', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG pt-br"
            }));
            
            translateService.setLanguage('es-es');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG es-es"
            }));
            
            translateService.setLanguage('fr-fr');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG fr-fr"
            }));
            
            var res = translateService.getTerm('message');
            
            expect(res).toEqual('MSG fr-fr');
        });
        
        it('should execute callback after setting language', function () {
            
            var flag = false;
            
            spyOn(console, 'log');
            
            translateService.setDefaultLanguage('pt-br', function () {
                console.log('after callback');
                flag = true;
            });
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: "MSG pt-br"
            }));
            
            timeoutService.flush();
            
            expect(console.log).toHaveBeenCalledWith('after callback');
        });
        
        it('should replace the tokens with parameters', function () {
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                "message": "Parametro {0} e parametro {1}."
            }));
            
            expect(translateService.getTerm('message', null, 1, 2)).toBe('Parametro 1 e parametro 2.');
        });
        
        it('should resolve cascade translation files', function() {
             translateService.setDefaultLanguage('pt-pt');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: {
                    mA: "MSG 1",
                    mB: "MSG 2"
                }
            }));
            
            expect(translateService.getTerm('message.mA')).toEqual('MSG 1');
            expect(translateService.getTerm('message.mB')).toEqual('MSG 2');
        });
        
        it('should not work when term is not found in cascade translation files', function() {
             translateService.setDefaultLanguage('pt-pt');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                message: {
                    mA: "MSG 1",
                    mB: "MSG 2"
                }
            }));
            
            expect(translateService.getTerm('wrongMessage')).toEqual(null);
            expect(translateService.getTerm('message.mC')).toEqual(null);
            expect(logService.warn).toHaveBeenCalled();
        });
    });
    
    describe('translate filter:', function () {
        
        var translateService, filter, logService, fakeServer;
        
        beforeEach(module('MRS.i18n'));
        
        beforeEach(inject(function ($filter, translate, $log) {
            translateService = translate;
            
            filter = $filter('i18n');
            translateService = translate;
            logService = $log;
            
            fakeServer = sinon.fakeServer.create();
            
            spyOn(logService, 'warn');
        }));
        
        it('should get a term in the selected language', function () {
            
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                "message": "MSG pt-br"
            }));
            
            expect(filter('message')).toBe('MSG pt-br');
        });
        
        it('should get a term in the default language if language is not found', function () {
            
            translateService.setDefaultLanguage('pt-br');
            
            // defining response
            fakeServer.requests[0].respond(200, {
                "Content-Type": "application/json"
            }, JSON.stringify({
                "message": "MSG pt-br"
            }));
            
            expect(filter('message', 'fr-fr')).toBe('MSG pt-br');
        });
        
        it('should store the languages', function () {
            
            translateService.setDefaultLanguage('pt-br');
            
            expect(translateService.getDefaultLanguage()).toBe('pt-br');
            
            translateService.setLanguage('es-es');
            
            expect(translateService.getSelectedLanguage()).toBe('es-es');
            
        });
        
    });
});