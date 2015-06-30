---
layout: post
title: AngularJS Apéritif 1
tags: javascript angular
---

Today let's look at AngularJS. We're going to write a small application for managing contacts. This will serve as an introduction to controllers, templates, and services.

<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js" type="text/javascript"></script>

<script src="/public/js/2015-07-05-angular-aperatif-1/app.js" type="text/javascript"></script>
<script src="/public/js/2015-07-05-angular-aperatif-1/service.js" type="text/javascript"></script>
<script src="/public/js/2015-07-05-angular-aperatif-1/controller.js" type="text/javascript"></script>

<div ng-app="demoApp">
    <div ng-controller="demoCtrl as demo">
        <div>
            <div style="display:inline-block;vertical-align:top;width:300px;">
                <ul style="list-style-type:none;height:200px;overflow:auto;">
                    <li ng-if="demo.contacts.length === 0">You have no contacts.</li>
                    <li ng-repeat="contact in demo.contacts">
                        <span ng-bind="contact.firstName + ' ' + contact.lastName"></span>
                        <span style="float:right;">
                            [<a ng-click="demo.removeContact($index)">X</a>]
                        </span>
                    </li>
                </ul>
            </div>
            <div style="display:inline-block;padding-left:12px;vertical-align:top;width:300px;">
                <form name="demo.form" ng-submit="demo.addContact(demo.newContact)" novalidate>
                    <input
                        ng-maxlength="255"
                        ng-model="demo.newContact.firstName"
                        ng-required="true"
                        placeholder="First Name"
                        type="text">
                    <input
                        ng-maxlength="255"
                        ng-model="demo.newContact.lastName"
                        ng-required="true"
                        placeholder="Last Name"
                        type="text">
                    <div>
                        <button ng-disabled="demo.form.$invalid" type="submit">Add Contact</button>
                        <button type="reset">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
