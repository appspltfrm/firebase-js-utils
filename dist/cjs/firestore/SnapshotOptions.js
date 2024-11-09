"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotOptions = void 0;
var SnapshotOptions;
(function (SnapshotOptions) {
    function extract(options) {
        if (!options) {
            return options;
        }
        return Object.assign({}, "serverTimestamps" in options ? { "serverTimestamps": options.serverTimestamps } : undefined);
    }
    SnapshotOptions.extract = extract;
})(SnapshotOptions || (exports.SnapshotOptions = SnapshotOptions = {}));
//# sourceMappingURL=SnapshotOptions.js.map