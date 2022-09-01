"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoWriteBatch = exports.AutoWriteBatchAdmin = exports.AutoWriteBatchClient = exports.AutoWriteBatch = void 0;
const tslib_1 = require("tslib");
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
class AutoWriteBatch {
    constructor(firestore) {
        this.firestore = firestore;
        this.operations = [];
        this.limit$ = 249;
        this.successCount$ = 0;
        this.errorCount$ = 0;
    }
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
    autoCommit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.count >= this.limit$) {
                return this.commitImpl();
            }
            return { successCount: 0, successResults: [], errors: [], errorCount: 0 };
        });
    }
    commit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.commitImpl();
        });
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
    commitImpl() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let successCount = 0;
            let successResults = [];
            let errorCount = 0;
            let errors = [];
            if (this.count > 0) {
                let batch = this.createBatch();
                let batchCount = 0;
                const commit = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (batchCount > 0) {
                        try {
                            const r = yield batch.commit();
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
                });
                for (let i = 0; i < this.count; i++) {
                    batchCount++;
                    const operation = this.operations[i];
                    batch[operation[0]].call(batch, ...operation[1]);
                    if (batchCount === this.limit$) {
                        yield commit();
                    }
                }
                yield commit();
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
        });
    }
    createBatch() {
        if (Firestore_1.Firestore.isClient(this.firestore)) {
            return (0, firestore_1.writeBatch)(this.firestore);
        }
        else {
            return this.firestore.batch();
        }
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
    create(documentRef, data) {
        this.operations.push(["create", Array.prototype.slice.call(arguments)]);
        return this;
    }
}
exports.AutoWriteBatchAdmin = AutoWriteBatchAdmin;
(function (AutoWriteBatch) {
    function isClient(batch) {
        return Firestore_1.Firestore.isClient(batch.firestore);
    }
    AutoWriteBatch.isClient = isClient;
    function isAdmin(batch) {
        return !Firestore_1.Firestore.isClient(batch.firestore);
    }
    AutoWriteBatch.isAdmin = isAdmin;
})(AutoWriteBatch = exports.AutoWriteBatch || (exports.AutoWriteBatch = {}));
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