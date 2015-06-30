(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('demoCtrl', DemoCtrl);


    DemoCtrl.$inject = ['demoService'];

    function DemoCtrl(demoService) {
        var vm = this;

        // Variables
        vm.contacts = demoService.getContacts();
        vm.newContact = {
            firstName: "",
            lastName: ""
        };

        // Methods
        vm.addContact = addContact;
        vm.removeContact = removeContact;
        
        function addContact(contact) {
            demoService.addContact(contact);
            vm.newContact.firstName = "";
            vm.newContact.lastName = "";
        }

        function removeContact(index) {
            var isRemoving = confirm("Are you sure you want to remove " + vm.contacts[index].firstName + " from your contacts?");
            if (isRemoving) demoService.removeContact(index);
        }
    }
})();
