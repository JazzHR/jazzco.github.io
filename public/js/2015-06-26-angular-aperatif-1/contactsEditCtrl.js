(function() {
    'use strict'

    angular
        .module('demoApp')
        .controller('ContactsEditCtrl', ContactsEditCtrl);

    ContactsEditCtrl.$inject = [];

    function ContactsEditCtrl() {
        console.log("Hello from editCtrl!");
    }
})();
