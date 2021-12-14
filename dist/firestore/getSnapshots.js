"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshots = void 0;
const tslib_1 = require("tslib");
const getSnapshot_1 = require("./getSnapshot");
function getSnapshots(query) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        return (yield (0, getSnapshot_1.getSnapshot)(query)).docs;
    });
}
exports.getSnapshots = getSnapshots;
//# sourceMappingURL=getSnapshots.js.map