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
            lastName: "",
            phone: ""
        };

        // Methods
        vm.addContact = addContact;
        vm.removeContact = removeContact;
        
        function addContact(contact) {
            demoService.addContact(contact);
            vm.newContact.firstName = "";
            vm.newContact.lastName = "";
            vm.newContact.phone = "";
        }

        function removeContact(index) {
            var isRemoving = confirm("Are you sure you want to remove " + vm.contacts[index].firstName + " " + vm.contacts[index].lastName +  " from your contacts?");
            if (isRemoving) demoService.removeContact(index);
        }
    }
})();
