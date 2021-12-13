import { __awaiter } from "tslib";
import { sleep } from "@co.mmons/js-utils/core";
import { deleteDoc } from "./deleteDoc";
import { DocumentReference } from "./DocumentReference";
import { getQuery } from "./getQuery";
import { getQuerySnapshot } from "./getQuerySnapshot";
import { Query } from "./Query";
import { WriteBatch, writeBatch } from "./WriteBatch";
export function deleteQuery(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options) {
            options = {};
        }
        if (options.readLimit) {
            query = getQuery(query, ["limit", options.readLimit]);
        }
        const snapshot = yield getQuerySnapshot(query);
        let deleteCount = 0;
        // when there are no documents left, we are done
        if (snapshot.size === 0) {
            return 0;
        }
        for (const d of snapshot.docs) {
            if (options.batch === false) {
                try {
                    yield deleteDoc(d.ref);
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
                const batch = writeBatch(query.firestore);
                for (const doc of part) {
                    if (WriteBatch.isClient(batch) && DocumentReference.isClient(doc.ref)) {
                        batch.delete(doc.ref);
                    }
                    else if (WriteBatch.isAdmin(batch) && DocumentReference.isAdmin(doc.ref)) {
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
                            yield sleep(options.batchRetryDelay || (2000 * i));
                        }
                    }
                }
            }
        }
        if (deleteCount > 0 && options.subcollections !== false && Query.isAdmin(query)) {
            for (const doc of snapshot.docs) {
                if (DocumentReference.isAdmin(doc.ref)) {
                    for (const collection of yield doc.ref.listCollections()) {
                        yield deleteQuery(collection, options);
                    }
                }
            }
        }
        return deleteCount + (!options.readLimit || (options.readLimit > 0 && deleteCount < options.readLimit) ? 0 : yield deleteQuery(query, options));
    });
}
//# sourceMappingURL=deleteQuery.js.map