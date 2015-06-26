(function() {
    'use strict'

    angular
        .module('demoApp')
        .controller('ContactsListCtrl', ContactsListCtrl);

    ContactsListCtrl.$inject = [];

    function ContactsListCtrl() {
        console.log("Hello from list ctrl!");
    }

})();
