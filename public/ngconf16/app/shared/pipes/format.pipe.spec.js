"use strict";
var testing_1 = require('@angular/core/testing');
var format_pipe_1 = require('./format.pipe');
testing_1.describe('Format Pipe', function () {
    testing_1.beforeEachProviders(function () { return [format_pipe_1.Format]; });
    testing_1.it('should transform the input', testing_1.inject([format_pipe_1.Format], function (pipe) {
        testing_1.expect(pipe.transform({ name: "Hello" }, "name")).toBe("Hello");
    }));
});
//# sourceMappingURL=format.pipe.spec.js.map