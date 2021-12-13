"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocDataFromServer = exports.getDocDataFromCache = exports.getDocData = void 0;
const tslib_1 = require("tslib");
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
function getDocData(doc, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (DocumentReference_1.DocumentReference.isClient(doc)) {
            return (yield (0, firestore_1.getDoc)(doc)).data(options);
        }
        else {
            return (yield doc.get()).data();
        }
    });
}
exports.getDocData = getDocData;
function getDocDataFromCache(doc, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (DocumentReference_1.DocumentReference.isClient(doc)) {
            return (yield (0, firestore_1.getDocFromCache)(doc)).data(options);
        }
        else {
            return (yield doc.get()).data();
        }
    });
}
exports.getDocDataFromCache = getDocDataFromCache;
function getDocDataFromServer(doc, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (DocumentReference_1.DocumentReference.isClient(doc)) {
            return (yield (0, firestore_1.getDocFromServer)(doc)).data(options);
        }
        else {
            return (yield doc.get()).data();
        }
    });
}
exports.getDocDataFromServer = getDocDataFromServer;
//# sourceMappingURL=getDocData.js.map