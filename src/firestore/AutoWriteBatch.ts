import {writeBatch} from "firebase/firestore";
import type {SetOptions as SetOptionsClient} from "firebase/firestore";
import type {SetOptions as SetOptionsAdmin, Precondition, WriteResult} from "@google-cloud/firestore";
import {DocumentData} from "./DocumentData";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore";
import {WriteBatch, WriteBatchAdmin} from "./WriteBatch";

export abstract class AutoWriteBatch {

    static isClient(batch: AutoWriteBatch): batch is AutoWriteBatchClient {
        return Firestore.isClient(batch.firestore);
    }

    static isAdmin(batch: AutoWriteBatch): batch is AutoWriteBatchAdmin {
        return !Firestore.isClient(batch.firestore);
    }

    protected constructor(readonly firestore: Firestore) {
    }

    onCommit: (count: number, results?: any) => void;

    protected batch$: WriteBatch;

    protected limit$: number = 249;

    protected count$: number = 0;

    protected committedCount$: number = 0;

    protected get batch(): WriteBatch {
        if (!this.batch$) {
            if (Firestore.isClient(this.firestore)) {
                this.batch$ = writeBatch(this.firestore);
            } else {
                this.batch$ = this.firestore.batch();
            }
        }

        return this.batch$;
    }

    get count(): number {
        return this.count$;
    }

    get committedCount() {
        return this.committedCount$;
    }

    get limit() {
        return this.limit$;
    }

    set limit(limit: number) {
        this.limit$ = limit > 0 && limit <= 249 ? limit : 249;
    }

    isFull() {
        return this.count$ >= this.limit$;
    }

    resetCommittedCount() {
        this.committedCount$ = 0;
    }

    async autoCommit(): Promise<{count: number, results?: any}> {

        if (this.count$ > this.limit$) {
            const count = this.count$;
            const results = await this.batch.commit();
            this.committedCount$ += count;
            this.batch$ = undefined;
            this.count$ = 0;

            if (this.onCommit) {
                try {
                    this.onCommit(count, results);
                } catch (e) {
                    console.error(e);
                }
            }

            return {count, results};
        }

        return {count: 0};
    }

    async commit(): Promise<{count: number, results?: any}> {

        if (this.count$ > 0) {
            const count = this.count$;
            const results = await this.batch.commit();
            this.committedCount$ += count;
            this.batch$ = undefined;
            this.count$ = 0;

            if (this.onCommit) {
                try {
                    this.onCommit(count, results);
                } catch (e) {
                    console.error(e);
                }
            }

            return {count, results};
        }

        return {count: 0};
    }

    delete(documentRef: DocumentReference<any>): this {
        this.count$++;
        this.batch.delete(documentRef as any);
        return this;
    }

    set<T = DocumentData>(documentRef: DocumentReference<T>, data: T, options?: any): this {
        this.count$++;
        this.batch.set.call(this.batch$, ...Array.prototype.slice.call(arguments));
        return this;
    }

    update(documentRef: DocumentReference<any>, data: any): this {
        this.count$++;
        this.batch.update.call(this.batch$, ...Array.prototype.slice.call(arguments));
        return this;
    }

}

interface AutoWriteBatchClientMethods {
    readonly firestore: FirestoreClient;
    commit(): Promise<{count: number}>;
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

    commit(): Promise<{count: number, results?: WriteResult[]}>;

}

export class AutoWriteBatchAdmin extends AutoWriteBatch implements AutoWriteBatchAdminMethods {

    constructor(readonly firestore: FirestoreAdmin) {
        super(firestore);
    }

    private get adminBatch() {
        return this.batch as WriteBatchAdmin;
    }

    create(documentRef: DocumentReferenceAdmin<any>, data: any) {
        this.count$++;
        this.adminBatch.create(documentRef, data);
        return this;
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
