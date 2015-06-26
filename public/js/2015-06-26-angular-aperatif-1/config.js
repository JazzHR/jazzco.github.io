(function() {
    'use strict';

    angular
        .module('demoApp')
        .config(DemoConfig);

    DemoConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function DemoConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/contacts");

        $stateProvider
            .state('contacts', {
                abstract: true,
                resolve: {},
                url: "/contacts"
            })
            .state('contacts.list', {
                controller: "ContactsListCtrl",
                controllerAs: "list",
                resolve: {},
                templateUrl: "/public/partials/2015-06-26-angular-aperatif-1/contactsList.html",
                url: "/"
            })
            .state('contacts.edit', {
                controller: "ContactsEditCtrl",
                controllerAs: "edit",
                resolve: {},
                templateUrl: "/public/partials/2015-06-26-angular-aperatif-1/contactsEdit.html",
                url: "/{contactId:[0-9+]}/edit"
            });
    }
})();
