"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverDataObservable = void 0;
const dataObservable_1 = require("./dataObservable");
function serverDataObservable(docOrQuery, options) {
    return (0, dataObservable_1.dataObservable)(docOrQuery, Object.assign({ skipCache: true }, options));
}
exports.serverDataObservable = serverDataObservable;
//# sourceMappingURL=serverDataObservable.js.map