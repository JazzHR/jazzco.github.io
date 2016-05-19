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
var core_1 = require('@angular/core');
var Format = (function () {
    function Format() {
    }
    Format.prototype.transform = function (value, format) {
        if (format === "name") {
            return value.name;
        }
        if (format === "cat") {
            return this.getSentence(value);
        }
        return "N/A";
    };
    Format.prototype.getSentence = function (sentence) {
        var words = sentence.split(" ");
        var output = [];
        for (var i = 0; i < words.length; i++) {
            output[i] = this.getWord(words[i]);
        }
        return output.join(" ") + "!";
    };
    Format.prototype.getWord = function (word) {
        var letter = word.slice(0, 1);
        switch (letter.toLowerCase()) {
            case "a":
            case "b":
            case "c":
                return "meow";
            case "d":
            case "e":
            case "f":
                return "purr";
            case "g":
            case "h":
            case "i":
                return "reeow";
            case "j":
            case "k":
            case "l":
                return "mew";
            case "m":
            case "n":
            case "o":
                return "mreep";
            case "p":
            case "q":
            case "r":
                return "mer ROW";
            case "s":
            case "t":
            case "u":
                return "merrow";
            case "v":
            case "w":
            case "x":
                return "myup";
            case "y":
            case "z":
                return "woof";
            default:
                return "MRREEEOW";
        }
    };
    Format = __decorate([
        core_1.Pipe({
            name: 'format',
        }), 
        __metadata('design:paramtypes', [])
    ], Format);
    return Format;
}());
exports.Format = Format;
//# sourceMappingURL=format.pipe.js.map