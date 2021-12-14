export var SnapshotListenOptions;
(function (SnapshotListenOptions) {
    function extract(options) {
        if (!options) {
            return options;
        }
        return Object.assign({}, "includeMetadataChanges" in options ? { "includeMetadataChanges": options.includeMetadataChanges } : undefined);
    }
    SnapshotListenOptions.extract = extract;
})(SnapshotListenOptions || (SnapshotListenOptions = {}));
//# sourceMappingURL=SnapshotListenOptions.js.map