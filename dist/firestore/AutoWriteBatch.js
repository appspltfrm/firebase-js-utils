import { writeBatch } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export class AutoWriteBatch {
    firestore;
    constructor(firestore) {
        this.firestore = firestore;
    }
    onCommit;
    operations = [];
    limit$ = 249;
    successCount$ = 0;
    errorCount$ = 0;
    get count() {
        return this.operations.length;
    }
    get successCount() {
        return this.successCount$;
    }
    get errorCount() {
        return this.errorCount$;
    }
    get limit() {
        return this.limit$;
    }
    set limit(limit) {
        this.limit$ = limit > 0 && limit <= 249 ? limit : 249;
    }
    async autoCommit() {
        if (this.count >= this.limit$) {
            return this.commitImpl();
        }
        return { successCount: 0, successResults: [], errors: [], errorCount: 0 };
    }
    async commit() {
        return this.commitImpl();
    }
    delete(documentRef) {
        this.operations.push(["delete", [documentRef]]);
        return this;
    }
    set(documentRef, data, options) {
        this.operations.push(["set", Array.prototype.slice.call(arguments)]);
        return this;
    }
    update(documentRef, data) {
        this.operations.push(["update", Array.prototype.slice.call(arguments)]);
        return this;
    }
    async commitImpl() {
        let successCount = 0;
        let successResults = [];
        let errorCount = 0;
        let errors = [];
        if (this.count > 0) {
            let batch = this.createBatch();
            let batchCount = 0;
            const commit = async () => {
                if (batchCount > 0) {
                    try {
                        const r = await batch.commit();
                        if (Array.isArray(r)) {
                            successResults.push(...r);
                        }
                        successCount += batchCount;
                    }
                    catch (e) {
                        errorCount += batchCount;
                        errors.push(e);
                    }
                }
                batch = this.createBatch();
                batchCount = 0;
            };
            for (let i = 0; i < this.count; i++) {
                batchCount++;
                const operation = this.operations[i];
                batch[operation[0]].call(batch, ...operation[1]);
                if (batchCount === this.limit$) {
                    await commit();
                }
            }
            await commit();
            if (this.onCommit) {
                try {
                    this.onCommit({ successCount, successResults, errorCount, errors });
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        this.operations = [];
        this.successCount$ += successCount;
        this.errorCount$ += errorCount;
        return { successCount, successResults, errorCount, errors };
    }
    createBatch() {
        if (Firestore.isClient(this.firestore)) {
            return writeBatch(this.firestore);
        }
        else {
            return this.firestore.batch();
        }
    }
}
export class AutoWriteBatchClient extends AutoWriteBatch {
    firestore;
    constructor(firestore) {
        super(firestore);
        this.firestore = firestore;
    }
}
export class AutoWriteBatchAdmin extends AutoWriteBatch {
    firestore;
    constructor(firestore) {
        super(firestore);
        this.firestore = firestore;
    }
    create(documentRef, data) {
        this.operations.push(["create", Array.prototype.slice.call(arguments)]);
        return this;
    }
}
(function (AutoWriteBatch) {
    function isClient(batch) {
        return Firestore.isClient(batch.firestore);
    }
    AutoWriteBatch.isClient = isClient;
    function isAdmin(batch) {
        return !Firestore.isClient(batch.firestore);
    }
    AutoWriteBatch.isAdmin = isAdmin;
})(AutoWriteBatch || (AutoWriteBatch = {}));
export function autoWriteBatch(firestore) {
    if (Firestore.isClient(firestore)) {
        return new AutoWriteBatchClient(firestore);
    }
    else {
        return new AutoWriteBatchAdmin(firestore);
    }
}
//# sourceMappingURL=AutoWriteBatch.js.map