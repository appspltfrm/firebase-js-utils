"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoWriteBatch = exports.AutoWriteBatchAdmin = exports.AutoWriteBatchClient = exports.AutoWriteBatch = void 0;
const tslib_1 = require("tslib");
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
class AutoWriteBatch {
    constructor(firestore) {
        this.firestore = firestore;
        this.limit$ = 249;
        this.count$ = 0;
        this.committedCount$ = 0;
    }
    static isClient(batch) {
        return Firestore_1.Firestore.isClient(batch.firestore);
    }
    static isAdmin(batch) {
        return !Firestore_1.Firestore.isClient(batch.firestore);
    }
    get batch() {
        if (!this.batch$) {
            if (Firestore_1.Firestore.isClient(this.firestore)) {
                this.batch$ = (0, firestore_1.writeBatch)(this.firestore);
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
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
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
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
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
exports.AutoWriteBatch = AutoWriteBatch;
class AutoWriteBatchClient extends AutoWriteBatch {
    constructor(firestore) {
        super(firestore);
        this.firestore = firestore;
    }
}
exports.AutoWriteBatchClient = AutoWriteBatchClient;
class AutoWriteBatchAdmin extends AutoWriteBatch {
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
exports.AutoWriteBatchAdmin = AutoWriteBatchAdmin;
function autoWriteBatch(firestore) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return new AutoWriteBatchClient(firestore);
    }
    else {
        return new AutoWriteBatchAdmin(firestore);
    }
}
exports.autoWriteBatch = autoWriteBatch;
//# sourceMappingURL=AutoWriteBatch.js.map