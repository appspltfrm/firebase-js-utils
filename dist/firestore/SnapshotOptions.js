export var SnapshotOptions;
(function (SnapshotOptions) {
    function extract(options) {
        if (!options) {
            return options;
        }
        return Object.assign({}, "serverTimestamps" in options ? { "serverTimestamps": options.serverTimestamps } : undefined);
    }
    SnapshotOptions.extract = extract;
})(SnapshotOptions || (SnapshotOptions = {}));
//# sourceMappingURL=SnapshotOptions.js.map