"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotListenOptions = void 0;
var SnapshotListenOptions;
(function (SnapshotListenOptions) {
    function extract(options) {
        if (!options) {
            return options;
        }
        return Object.assign({}, "includeMetadataChanges" in options ? { "includeMetadataChanges": options.includeMetadataChanges } : undefined);
    }
    SnapshotListenOptions.extract = extract;
})(SnapshotListenOptions = exports.SnapshotListenOptions || (exports.SnapshotListenOptions = {}));
//# sourceMappingURL=SnapshotListenOptions.js.map