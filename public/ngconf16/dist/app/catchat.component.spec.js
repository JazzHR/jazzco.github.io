"use strict";
var testing_1 = require('@angular/core/testing');
var catchat_component_1 = require('../app/catchat.component');
testing_1.beforeEachProviders(function () { return [catchat_component_1.CatchatAppComponent]; });
testing_1.describe('App: Catchat', function () {
    testing_1.it('should create the app', testing_1.inject([catchat_component_1.CatchatAppComponent], function (app) {
        testing_1.expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=catchat.component.spec.js.map