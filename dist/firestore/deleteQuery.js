import { sleep } from "@appspltfrm/js-utils/core";
import { buildQuery } from "./buildQuery";
import { deleteDocument } from "./deleteDocument";
import { DocumentReference } from "./DocumentReference";
import { getSnapshot } from "./getSnapshot";
import { Query } from "./Query";
import { WriteBatch, writeBatch } from "./WriteBatch";
export async function deleteQuery(query, options) {
    if (!options) {
        options = {};
    }
    if (options.readLimit) {
        query = buildQuery(query, ["limit", options.readLimit]);
    }
    const snapshot = await getSnapshot(query);
    let deleteCount = 0;
    // when there are no documents left, we are done
    if (snapshot.size === 0) {
        return 0;
    }
    for (const d of snapshot.docs) {
        if (options.batch === false) {
            try {
                await deleteDocument(d.ref);
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
                    await batch.commit();
                    deleteCount = part.length;
                    break;
                }
                catch (error) {
                    console.warn(error);
                    if (i < (options.batchRetryCount > 1 ? options.batchRetryCount : 1)) {
                        await sleep(options.batchRetryDelay || (2000 * i));
                    }
                }
            }
        }
    }
    if (deleteCount > 0 && options.subcollections !== false && Query.isAdmin(query)) {
        for (const doc of snapshot.docs) {
            if (DocumentReference.isAdmin(doc.ref)) {
                for (const collection of await doc.ref.listCollections()) {
                    await deleteQuery(collection, options);
                }
            }
        }
    }
    return deleteCount + (!options.readLimit || (options.readLimit > 0 && deleteCount < options.readLimit) ? 0 : await deleteQuery(query, options));
}
//# sourceMappingURL=deleteQuery.js.map