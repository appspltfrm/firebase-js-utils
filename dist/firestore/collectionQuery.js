import { buildQuery } from "./buildQuery.js";
import { collectionReference } from "./CollectionReference.js";
export function collectionQuery(firestore, collectionName, ...queryConstraints) {
    return buildQuery(collectionReference(firestore, collectionName), ...queryConstraints);
}
//# sourceMappingURL=collectionQuery.js.map