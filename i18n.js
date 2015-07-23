"use strict";

define(['angular', 'angular-dynamic-locale'], function () {
    angular.module("ciandt.components.i18n", ['ciandt.components.utilities', 'tmh.dynamicLocale']).constant('ciandt.components.i18n.LocalizeConfig', {
        defaultLanguage: 'pt',
        supportedLanguage: ['pt', 'en'],
        localePath: 'assets/libs/angular-i18n/angular-locale_{{locale}}.js'
    }).factory("ciandt.components.i18n.Localize", ['ciandt.components.utilities.Utilities', '$rootScope', 'ciandt.components.i18n.LocalizeConfig', '$log', 'tmhDynamicLocale', function (utilities, $rootScope, LocalizeConfig, $log, tmhDynamicLocale) {
        var userLang;
        try {
            userLang = JSON.parse(localStorage.getItem('i18n_lang'));
        } catch (e) { }

        if (!userLang) {
            userLang = navigator.language || navigator.userLanguage;
        }

        var language = LocalizeConfig.defaultLanguage;
        if (userLang) {
            language = userLang.toLowerCase().split("-")[0];
            // se linguagem não for suportada, considera default
            if (!_.find(LocalizeConfig.supportedLanguage, function (item) { return item == language; })) {
                language = LocalizeConfig.defaultLanguage;
            }
        }

        $log.info('Lang setted to: ' + language);

        var resources = [];
        var dictionary = {};
        var regexDictionary = {};

        var onfinishLoadResources = function (lang) {
            $rootScope.$broadcast("localizeResourcesUpdated");
        };

        var onfinishChangeLanguage = function (lang, onfinish) {
            var event;
            event = $rootScope.$on('$localeChangeSuccess', function (evt, lang) {
                $log.debug('ngLocale_' + lang + ' loaded');

                // atribui lang escolhida
                if (language != lang) {
                    language = lang;
                    $log.debug('Language changed to: ' + lang);
                }

                // atualiza cache com lang escolhida
                utilities.setLocalStorage('i18n_lang', lang);

                if (moment) {
                    // atribui ao moment a linguagem corrente
                    moment.locale(lang);
                }

                if (onfinish) {
                    onfinish(lang);
                }
                // remove listener
                if (event) {
                    event();
                }
            });

            tmhDynamicLocale.set(lang);
        };

        var changeLanguage = function (lang) {
            if (language != lang) {
                loadResources(lang, resources, function (lang) {
                    onfinishChangeLanguage(lang, function () {
                        onfinishLoadResources(lang);
                    });
                });
            } else {
                onfinishChangeLanguage(lang);
            }
        };

        changeLanguage(language);

        var loadResources = function (lang, res, onfinish) {
            if (lang != LocalizeConfig.defaultLanguage) {
                var _resources = [];
                angular.forEach(res, function (resource) {
                    _resources.push('json!' + resource.replace(/{lang}/g, lang));
                });

                require(_resources, function () {
                    $log.debug('Resources loaded:');
                    $log.debug(_resources);
                    // se linguagem foi alterada, reseta dictionaries
                    if (lang != language) {
                        dictionary = {};
                        regexDictionary = {};
                    }
                    // pra cada resources retornado adiciona ao dictionary
                    angular.forEach(arguments, function (data) {
                        if (data) {
                            if (data.resources || data.regexResources) {
                                if (data.resources) {
                                    dictionary = angular.extend(dictionary, data.resources);
                                }
                                if (data.regexResources) {
                                    regexDictionary = angular.extend(regexDictionary, data.regexResources);
                                }
                            } else {
                                dictionary = angular.extend(dictionary, data);
                            }
                        }
                    });
                    onfinish(lang);
                });
            } else {
                dictionary = {};
                regexDictionary = {};
                onfinish(lang);
            }
        };

        return {
            addResource: function (resource) {
                resources.push(resource);
                // se linguagem atual for diferente da default, carrega resource
                if (language != LocalizeConfig.defaultLanguage) {
                    loadResources(language, [resource], onfinishLoadResources);
                }
            },

            setLanguage: function (value) {
                value = value.toLowerCase().split("-")[0];
                // se linguagem atual for diferente da linguagem informada, carrega resources
                if (language != value) {
                    changeLanguage(value);
                }
            },

            getLanguage: function () {
                return language;
            },

            get: function (value) {
                // se tem value e linguagem for diferente da default, então traduz
                // se for linguagem default nao precisa traduzir
                if (value && language != LocalizeConfig.defaultLanguage) {
                    if (dictionary && dictionary[value.toLowerCase()]) {
                        return dictionary[value.toLowerCase()];
                    } else
                        if (regexDictionary) {
                            // busca usando regex
                            // value: Deseja excluir o modulo Controle de Acesso?
                            // regex: Deseja excluir o modulo ([^(?)]+)\?
                            // tradução: Would you like to remove the module $1?
                            // estratégia: loop em todas as chaves fazendo match com o value, o que der match retorna fazendo replace dos matches encontrados
                            for (var key in regexDictionary) {
                                var reg = new RegExp(key, 'gi');
                                var m = value.match(reg);
                                if (m && m.length > 0) {
                                    var translate = regexDictionary[key];
                                    return value.replace(reg, translate);
                                }
                            }
                        }
                }
                return value;
            }
        }
    }]).directive("i18n", ["ciandt.components.i18n.Localize", function (localize) {
        var i18nDirective;
        return i18nDirective = {
            restrict: "EA",
            update: function (ele, attrs) {
                var i18n;

                // altera body do elemento caso não sejam tags html, se for apenas texto
                if (ele.html().trim() == ele.text().trim()) {
                    var text = ele.text().trim();
                    if (attrs.i18n) {
                        ele.text(localize.get(attrs.i18n));
                    } else if (text) {
                        i18n = text;
                        ele.text(localize.get(i18n));
                    }
                }

                // altera placeholder
                if (attrs.placeholder) {
                    if (attrs.i18n) {
                        ele.attr("placeholder", localize.get(attrs.i18n));
                    } else {
                        i18n = attrs.placeholder;
                        ele.attr("placeholder", localize.get(attrs.placeholder));
                    }
                }

                // altera title
                if (attrs.title) {
                    if (attrs.i18n) {
                        ele.attr("title", localize.get(attrs.i18n));
                    } else {
                        i18n = attrs.title;
                        ele.attr("title", localize.get(attrs.title));
                    }
                }

                // altera alt
                if (attrs.alt) {
                    if (attrs.i18n) {
                        ele.attr("alt", localize.get(attrs.i18n));
                    } else {
                        i18n = attrs.alt;
                        ele.attr("alt", localize.get(attrs.alt));
                    }
                }

                if (i18n) {
                    ele.attr("i18n", i18n);
                }
            },
            link: function (scope, ele, attrs) {
                var observe = function (value) {
                    i18nDirective.update(ele, attrs);
                };

                if (ele.html().trim() == ele.text().trim()) {
                    i18nDirective.update(ele, attrs);
                }

                if (attrs.title) {
                    attrs.$observe('title', observe);
                }

                if (attrs.alt) {
                    attrs.$observe('alt', observe);
                }

                if (attrs.placeholder) {
                    attrs.$observe('placeholder', observe);
                }

                if (attrs.i18n) {
                    attrs.$observe('i18n', observe);
                }

                scope.$on("localizeResourcesUpdated", function () {
                    i18nDirective.update(ele, attrs);
                });
            }
        };
    }]).filter('i18n', ['ciandt.components.i18n.Localize', function (localize) {
        return function (value) {
            return localize.get(value);
        }
    }]).config(['tmhDynamicLocaleProvider', 'ciandt.components.i18n.LocalizeConfig', function (tmhDynamicLocaleProvider, LocalizeConfig) {
        tmhDynamicLocaleProvider.localeLocationPattern(LocalizeConfig.localePath);
    }]);
});