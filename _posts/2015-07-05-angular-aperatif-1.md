---
layout: post
title: AngularJS Apéritif 1
tags: javascript angular
---

Today let's look build a small application using AngularJS for managing contacts. This will serve as an introduction to controllers, templates, and services. In future postings we'll expand the functionality of this application.

<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js" type="text/javascript"></script>

<script src="/public/js/2015-07-05-angular-aperatif-1/app.js" type="text/javascript"></script>
<script src="/public/js/2015-07-05-angular-aperatif-1/service.js" type="text/javascript"></script>
<script src="/public/js/2015-07-05-angular-aperatif-1/controller.js" type="text/javascript"></script>

<div ng-app="demoApp">
    <div ng-controller="demoCtrl as demo">
        <div style="background-color:#f1f3f3;padding:16px;">
            <div style="display:inline-block;vertical-align:top;width:341px;">
                <ul style="list-style-type:none;height:200px;overflow:auto;">
                    <li ng-if="demo.contacts.length === 0">
                        You have no contacts.
                    </li>
                    <li ng-repeat="contact in demo.contacts" title="{{contact.phone}}">
                        <span ng-bind="contact.firstName + ' ' + contact.lastName + ': ' + contact.phone">
                        </span>
                        <span style="float:right;">
                            [<a ng-click="demo.removeContact($index)" style="color:#f00;cursor:pointer;">X</a>]
                        </span>
                    </li>
                </ul>
            </div>
            <div style="display:inline-block;vertical-align:top;width:341px;">
                <form
                    name="demo.form"
                    ng-submit="demo.addContact(demo.newContact)"
                    novalidate
                    style="display:block;width:202px;">
                    <h4 style="margin:0;">Add Contact</h4>
                    <input
                        ng-maxlength="255"
                        ng-model="demo.newContact.firstName"
                        ng-required="true"
                        placeholder="First Name"
                        style="font-size:14px;padding:4px;"
                        type="text">
                    <input
                        ng-maxlength="255"
                        ng-model="demo.newContact.lastName"
                        ng-required="true"
                        placeholder="Last Name"
                        style="font-size:14px;padding:4px;"
                        type="text">
                    <input
                        ng-maxlength="255"
                        ng-model="demo.newContact.phone"
                        ng-required="true"
                        placeholder="Phone"
                        style="font-size:14px;padding:4px;"
                        type="text">
                    <div>
                        <button
                            ng-disabled="demo.form.$invalid"
                            style="font-size:14px;padding:4px;"
                            type="submit">
                            Add Contact
                        </button>
                        <button
                            style="font-size:14px;padding:4px;"
                            type="reset">
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
