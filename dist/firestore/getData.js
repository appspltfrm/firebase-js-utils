"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
const tslib_1 = require("tslib");
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
const Query_1 = require("./Query");
function getData(docOrQuery, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (Query_1.Query.isInstance(docOrQuery)) {
            if (Query_1.Query.isClient(docOrQuery)) {
                return (yield (0, firestore_1.getDocs)(docOrQuery)).docs.map(snapshot => snapshot.data(options));
            }
            else {
                return (yield docOrQuery.get()).docs.map(snapshot => snapshot.data());
            }
        }
        else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference_1.DocumentReference.isClient(docOrQuery)) {
                return (yield (0, firestore_1.getDoc)(docOrQuery)).data(options);
            }
            else {
                return (yield docOrQuery.get()).data();
            }
        }
        else {
            throw new Error("Invalid DocumentReference or Query object");
        }
    });
}
exports.getData = getData;
//# sourceMappingURL=getData.js.map