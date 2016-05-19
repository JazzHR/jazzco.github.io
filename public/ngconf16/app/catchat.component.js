"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Core
var core_1 = require('@angular/core');
// AngularFire2
var angularfire2_1 = require('angularfire2');
var avatar_1 = require('./shared/avatar');
var shared_1 = require('./shared');
var CatchatAppComponent = (function () {
    function CatchatAppComponent(af, cs) {
        this.af = af;
        this.cs = cs;
        this.messages = af.database.list('/messages', { query: { limitToLast: 4 } });
        this.model = "";
        var id = Math.ceil(Math.random() * 8);
        this.author = {
            id: id,
            name: this.cs.getName(id)
        };
    }
    CatchatAppComponent.prototype.sendMessage = function (message) {
        var m = this.model;
        this.model = "";
        return this.af.database.list('/messages').push({ author: this.author, text: m });
    };
    CatchatAppComponent = __decorate([
        core_1.Component({
            directives: [avatar_1.AvatarComponent],
            moduleId: module.id,
            pipes: [shared_1.Format],
            providers: [shared_1.CatService],
            selector: 'catchat-app',
            styleUrls: ['catchat.component.css'],
            templateUrl: 'catchat.component.html'
        }), 
        __metadata('design:paramtypes', [angularfire2_1.AngularFire, shared_1.CatService])
    ], CatchatAppComponent);
    return CatchatAppComponent;
}());
exports.CatchatAppComponent = CatchatAppComponent;
//# sourceMappingURL=catchat.component.js.map