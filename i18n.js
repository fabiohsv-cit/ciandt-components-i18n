"use strict";

define(['angular'], function (app) {
    angular.module("ciandt.components.i18n", []).factory("ciandt.components.i18n.Localize", ["$http", "$rootScope", "$window",
        function ($http, $rootScope, $window) {
            var localize;
            return localize = {
                language: "pt",
                url: void 0,
                resourceFileLoaded: !1,
                successCallback: function (data) {
                    return localize.dictionary = data, localize.resourceFileLoaded = !0, $rootScope.$broadcast("localizeResourcesUpdated");
                },
                setLanguage: function (value) {
                    return localize.language = value.toLowerCase().split("-")[0], localize.initLocalizedResources();
                },
                setUrl: function (value) {
                    return localize.url = value, localize.initLocalizedResources();
                },
                buildUrl: function () {
                    return localize.language || (localize.language = ($window.navigator.userLanguage || $window.navigator.language).toLowerCase(), localize.language = localize.language.split("-")[0]), "app/common/i18n/resources_" + localize.language + ".js";
                },
                initLocalizedResources: function () {
                    var url;
                    return url = localize.url || localize.buildUrl(), $http({
                        method: "GET",
                        url: url,
                        cache: !1
                    }).success(localize.successCallback).error(function () {
                        return $rootScope.$broadcast("localizeResourcesUpdated");
                    });
                },
                get: function (value) {
                    var result, valueLowerCase;
                    result = (result = void 0, localize.dictionary && value ? (valueLowerCase = value.toLowerCase(), result = "" === localize.dictionary[valueLowerCase] ? value : localize.dictionary[valueLowerCase]) : result = value, result);
                    if (result) {
                        return result;
                    } else {
                        return value;
                    }
                }
            };
        }]).directive("i18n", ["ciandt.components.i18n.Localize", function (localize) {
            var i18nDirective;
            return i18nDirective = {
                restrict: "EA",
                updateText: function (ele, input, placeholder, title) {
                    var result;
                    if (title) {
                        result = localize.get(placeholder);
                        ele.attr("title", result);
                    }
                    return result = void 0, "i18n-placeholder" === input ? (result = localize.get(placeholder), ele.attr("placeholder", result)) : input.length >= 1 ? (result = localize.get(input), ele.text(result)) : void 0;
                },
                link: function (scope, ele, attrs) {
                    if (typeof attrs.i18n == 'string' && attrs.title) {
                        // TODO Viana: acertar trecho quando i18n é usado para transformar um title
                        return;
                    }

                    if (ele.is('i18n')) {
                        i18nDirective.updateText(ele, ele.text());
                    }
                    var observe = 'i18n';
                    if (attrs.i18n == '' && attrs.title) {
                        observe = 'title';
                    }
                    return scope.$on("localizeResourcesUpdated", function () {
                        var key = attrs.i18n ? attrs.i18n : ele.text();
                        return i18nDirective.updateText(ele, key, attrs.placeholder, attrs.title);
                    }), attrs.$observe(observe, function (value) {
                        if (!value) {
                            value = ele.text();
                        }
                        return i18nDirective.updateText(ele, value, attrs.placeholder, attrs.title);
                    });
                }
            };
        }]);
});