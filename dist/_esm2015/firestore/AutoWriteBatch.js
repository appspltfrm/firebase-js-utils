import { __awaiter } from "tslib";
import { writeBatch } from "firebase/firestore";
import { Firestore } from "./Firestore";
export class AutoWriteBatch {
    constructor(firestore) {
        this.firestore = firestore;
        this.limit$ = 249;
        this.count$ = 0;
        this.committedCount$ = 0;
    }
    get batch() {
        if (!this.batch$) {
            if (Firestore.isClient(this.firestore)) {
                this.batch$ = writeBatch(this.firestore);
            }
            else {
                this.batch$ = this.firestore.batch();
            }
        }
        return this.batch$;
    }
    get count() {
        return this.count$;
    }
    get committedCount() {
        return this.committedCount$;
    }
    get limit() {
        return this.limit$;
    }
    set limit(limit) {
        this.limit$ = limit > 0 && limit <= 249 ? limit : 249;
    }
    isFull() {
        return this.count$ >= this.limit$;
    }
    resetCommittedCount() {
        this.committedCount$ = 0;
    }
    autoCommit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.count$ > this.limit$) {
                const count = this.count$;
                const results = yield this.batch.commit();
                this.committedCount$ += count;
                this.batch$ = undefined;
                this.count$ = 0;
                if (this.onCommit) {
                    try {
                        this.onCommit(count, results);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                return { count, results };
            }
            return { count: 0 };
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.count$ > 0) {
                const count = this.count$;
                const results = yield this.batch.commit();
                this.committedCount$ += count;
                this.batch$ = undefined;
                this.count$ = 0;
                if (this.onCommit) {
                    try {
                        this.onCommit(count, results);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                return { count, results };
            }
            return { count: 0 };
        });
    }
    delete(documentRef) {
        this.count$++;
        this.batch.delete(documentRef);
        return this;
    }
    set(documentRef, data, options) {
        this.count$++;
        this.batch.set.call(this.batch$, ...Array.prototype.slice.call(arguments));
        return this;
    }
    update(documentRef, data) {
        this.count$++;
        this.batch.update.call(this.batch$, ...Array.prototype.slice.call(arguments));
        return this;
    }
}
export class AutoWriteBatchClient extends AutoWriteBatch {
    constructor(firestore) {
        super(firestore);
        this.firestore = firestore;
    }
}
export class AutoWriteBatchAdmin extends AutoWriteBatch {
    constructor(firestore) {
        super(firestore);
        this.firestore = firestore;
    }
    get adminBatch() {
        return this.batch;
    }
    create(documentRef, data) {
        this.count$++;
        this.adminBatch.create(documentRef, data);
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