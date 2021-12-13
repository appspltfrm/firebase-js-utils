"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuery = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@co.mmons/js-utils/core");
const deleteDoc_1 = require("./deleteDoc");
const DocumentReference_1 = require("./DocumentReference");
const getQuery_1 = require("./getQuery");
const getQuerySnapshot_1 = require("./getQuerySnapshot");
const Query_1 = require("./Query");
const WriteBatch_1 = require("./WriteBatch");
function deleteQuery(query, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (!options) {
            options = {};
        }
        if (options.readLimit) {
            query = (0, getQuery_1.getQuery)(query, ["limit", options.readLimit]);
        }
        const snapshot = yield (0, getQuerySnapshot_1.getQuerySnapshot)(query);
        let deleteCount = 0;
        // when there are no documents left, we are done
        if (snapshot.size === 0) {
            return 0;
        }
        for (const d of snapshot.docs) {
            if (options.batch === false) {
                try {
                    yield (0, deleteDoc_1.deleteDoc)(d.ref);
                    deleteCount++;
                }
                catch (error) {
                    console.warn(error);
                }
            }
        }
        if (options.batch !== false) {
            const docs = snapshot.docs.slice();
            while (docs.length > 0) {
                const part = docs.splice(0, 499);
                const batch = (0, WriteBatch_1.writeBatch)(query.firestore);
                for (const doc of part) {
                    if (WriteBatch_1.WriteBatch.isClient(batch) && DocumentReference_1.DocumentReference.isClient(doc.ref)) {
                        batch.delete(doc.ref);
                    }
                    else if (WriteBatch_1.WriteBatch.isAdmin(batch) && DocumentReference_1.DocumentReference.isAdmin(doc.ref)) {
                        batch.delete(doc.ref);
                    }
                }
                for (let i = 1; i <= (options.batchRetryCount > 1 ? options.batchRetryCount : 1); i++) {
                    try {
                        yield batch.commit();
                        deleteCount = part.length;
                        break;
                    }
                    catch (error) {
                        console.warn(error);
                        if (i < (options.batchRetryCount > 1 ? options.batchRetryCount : 1)) {
                            yield (0, core_1.sleep)(options.batchRetryDelay || (2000 * i));
                        }
                    }
                }
            }
        }
        if (deleteCount > 0 && options.subcollections !== false && Query_1.Query.isAdmin(query)) {
            for (const doc of snapshot.docs) {
                if (DocumentReference_1.DocumentReference.isAdmin(doc.ref)) {
                    for (const collection of yield doc.ref.listCollections()) {
                        yield deleteQuery(collection, options);
                    }
                }
            }
        }
        return deleteCount + (!options.readLimit || (options.readLimit > 0 && deleteCount < options.readLimit) ? 0 : yield deleteQuery(query, options));
    });
}
exports.deleteQuery = deleteQuery;
//# sourceMappingURL=deleteQuery.js.map