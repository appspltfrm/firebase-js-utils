"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryDataFromServer = exports.getQueryDataFromCache = exports.getQueryData = void 0;
const tslib_1 = require("tslib");
const firestore_1 = require("firebase/firestore");
const Query_1 = require("./Query");
function getQueryData(query, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (Query_1.Query.isClient(query)) {
            return (yield (0, firestore_1.getDocs)(query)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (yield query.get()).docs.map(snapshot => snapshot.data());
        }
    });
}
exports.getQueryData = getQueryData;
function getQueryDataFromCache(query, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (Query_1.Query.isClient(query)) {
            return (yield (0, firestore_1.getDocsFromCache)(query)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (yield query.get()).docs.map(snapshot => snapshot.data());
        }
    });
}
exports.getQueryDataFromCache = getQueryDataFromCache;
function getQueryDataFromServer(query, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (Query_1.Query.isClient(query)) {
            return (yield (0, firestore_1.getDocsFromServer)(query)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (yield query.get()).docs.map(snapshot => snapshot.data());
        }
    });
}
exports.getQueryDataFromServer = getQueryDataFromServer;
//# sourceMappingURL=getQueryData.js.map