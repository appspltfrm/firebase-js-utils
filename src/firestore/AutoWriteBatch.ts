import type {Precondition, SetOptions as SetOptionsAdmin, WriteResult} from "@google-cloud/firestore";
import type {SetOptions as SetOptionsClient} from "firebase/firestore";
import {writeBatch} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference.js";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore.js";
import {WriteBatch} from "./WriteBatch.js";

interface CommitResult<SuccessResult = any> {
    successCount: number;
    successResults: SuccessResult[];
    errorCount: number;
    errors: any[];
}

export abstract class AutoWriteBatch {

    protected constructor(readonly firestore: Firestore) {
    }

    onCommit: (result: CommitResult) => void;

    protected operations: [method: "set" | "delete" | "update" | "create", args: any[]][] = [];

    protected limit$: number = 249;

    protected successCount$: number = 0;

    protected errorCount$: number = 0;

    get count(): number {
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

    set limit(limit: number) {
        this.limit$ = limit > 0 && limit <= 249 ? limit : 249;
    }

    async autoCommit(): Promise<CommitResult> {

        if (this.count >= this.limit$) {
            return this.commitImpl();
        }

        return {successCount: 0, successResults: [], errors: [], errorCount: 0};
    }

    async commit(): Promise<CommitResult> {
        return this.commitImpl();
    }

    delete(documentRef: DocumentReference<any>): this {
        this.operations.push(["delete", [documentRef]])
        return this;
    }

    set<T = DocumentData>(documentRef: DocumentReference<T>, data: T, options?: any): this {
        this.operations.push(["set", Array.prototype.slice.call(arguments)]);
        return this;
    }

    update(documentRef: DocumentReference<any>, data: any): this {
        this.operations.push(["update", Array.prototype.slice.call(arguments)]);
        return this;
    }

    private async commitImpl(): Promise<CommitResult> {

        let successCount = 0;
        let successResults: any[] = [];
        let errorCount = 0;
        let errors: any[] = [];

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

                    } catch (e) {
                        errorCount += batchCount;
                        errors.push(e);
                    }
                }

                batch = this.createBatch();
                batchCount = 0;
            }

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
                    this.onCommit({successCount, successResults, errorCount, errors});
                } catch (e) {
                    console.error(e);
                }
            }
        }

        this.operations = [];
        this.successCount$ += successCount;
        this.errorCount$ += errorCount;

        return {successCount, successResults, errorCount, errors};
    }

    private createBatch(): WriteBatch {
        if (Firestore.isClient(this.firestore)) {
            return writeBatch(this.firestore);
        } else {
            return this.firestore.batch();
        }
    }

}

interface AutoWriteBatchClientMethods {
    readonly firestore: FirestoreClient;
    commit(): Promise<CommitResult>;
    set<T = DocumentData>(documentRef: DocumentReferenceClient<T>, data: T): this;
    set<T = DocumentData>(documentRef: DocumentReferenceClient<T>, data: T, options: SetOptionsClient): this;
    update(documentRef: DocumentReference<any>, data: any): this;
}

export class AutoWriteBatchClient extends AutoWriteBatch implements AutoWriteBatchClientMethods {

    constructor(readonly firestore: FirestoreClient) {
        super(firestore);
    }

}

interface AutoWriteBatchAdminMethods {

    readonly firestore: FirestoreAdmin;

    set<T = DocumentData>(documentRef: DocumentReferenceAdmin<T>, data: T);

    set<T = DocumentData>(documentRef: DocumentReferenceAdmin<T>, data: T, options: SetOptionsAdmin);

    create(documentRef: DocumentReferenceAdmin<any>, data: any): this;

    update(documentRef: DocumentReferenceAdmin<any>, data: any, precondition?: Precondition): this;

    delete(documentRef: DocumentReferenceAdmin<any>, precondition?: Precondition): this;

    autoCommit(): Promise<CommitResult<WriteResult>>;

    commit(): Promise<CommitResult<WriteResult>>;

}

export class AutoWriteBatchAdmin extends AutoWriteBatch implements AutoWriteBatchAdminMethods {

    constructor(readonly firestore: FirestoreAdmin) {
        super(firestore);
    }

    create(documentRef: DocumentReferenceAdmin<any>, data: any) {
        this.operations.push(["create", Array.prototype.slice.call(arguments)]);
        return this;
    }

}

export namespace AutoWriteBatch {

    export function isClient(batch: AutoWriteBatch): batch is AutoWriteBatchClient {
        return Firestore.isClient(batch.firestore);
    }

    export function isAdmin(batch: AutoWriteBatch): batch is AutoWriteBatchAdmin {
        return !Firestore.isClient(batch.firestore);
    }

}

export function autoWriteBatch(firestore: FirestoreAdmin): AutoWriteBatchAdmin;

export function autoWriteBatch(firestore: FirestoreClient): AutoWriteBatchClient;

export function autoWriteBatch(firestore: Firestore): AutoWriteBatch {
    if (Firestore.isClient(firestore)) {
        return new AutoWriteBatchClient(firestore);
    } else {
        return new AutoWriteBatchAdmin(firestore);
    }
}
