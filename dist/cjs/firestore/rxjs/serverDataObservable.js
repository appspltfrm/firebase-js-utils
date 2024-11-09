"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverDataObservable = serverDataObservable;
const dataObservable_1 = require("./dataObservable");
function serverDataObservable(docOrQuery, options) {
    return (0, dataObservable_1.dataObservable)(docOrQuery, Object.assign({ skipCache: true }, options));
}
//# sourceMappingURL=serverDataObservable.js.map