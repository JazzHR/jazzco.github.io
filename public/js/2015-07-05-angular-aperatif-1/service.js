(function() {
    'use strict';

    angular
        .module('demoApp')
        .service('demoService', DemoService);

    DemoService.$inject = [];

    function DemoService() {
        var vm = this;
        var contacts = [];

        // Methods
        vm.addContact = addContact;
        vm.getContacts = getContacts;
        vm.removeContact = removeContact;

        function addContact(contact) {
            contacts.push(angular.copy(contact));
        }

        function getContacts() {
            return contacts;
        }

        function removeContact(index) {
            contacts.splice(index, 1);
        }
    }
})();
