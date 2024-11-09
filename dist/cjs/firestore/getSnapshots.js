"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshots = getSnapshots;
const getSnapshot_1 = require("./getSnapshot");
async function getSnapshots(query) {
    return (await (0, getSnapshot_1.getSnapshot)(query)).docs;
}
//# sourceMappingURL=getSnapshots.js.map