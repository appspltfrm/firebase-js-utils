import type { SetOptions as SetOptionsClient } from "firebase/firestore";
import type { SetOptions as SetOptionsAdmin, Precondition, WriteResult } from "@google-cloud/firestore";
import { DocumentData } from "./DocumentData";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore";
import { WriteBatch } from "./WriteBatch";
export declare abstract class AutoWriteBatch {
    readonly firestore: Firestore;
    static isClient(batch: AutoWriteBatch): batch is AutoWriteBatchClient;
    static isAdmin(batch: AutoWriteBatch): batch is AutoWriteBatchAdmin;
    protected constructor(firestore: Firestore);
    onCommit: (count: number, results?: any) => void;
    protected batch$: WriteBatch;
    protected limit$: number;
    protected count$: number;
    protected committedCount$: number;
    protected get batch(): WriteBatch;
    get count(): number;
    get committedCount(): number;
    get limit(): number;
    set limit(limit: number);
    isFull(): boolean;
    resetCommittedCount(): void;
    autoCommit(): Promise<{
        count: number;
        results?: any;
    }>;
    commit(): Promise<{
        count: number;
        results?: any;
    }>;
    delete(documentRef: DocumentReference<any>): this;
    set<T = DocumentData>(documentRef: DocumentReference<T>, data: T, options?: any): this;
    update(documentRef: DocumentReference<any>, data: any): this;
}
interface AutoWriteBatchClientMethods {
    readonly firestore: FirestoreClient;
    commit(): Promise<{
        count: number;
    }>;
    set<T = DocumentData>(documentRef: DocumentReferenceClient<T>, data: T): this;
    set<T = DocumentData>(documentRef: DocumentReferenceClient<T>, data: T, options: SetOptionsClient): this;
    update(documentRef: DocumentReference<any>, data: any): this;
}
export declare class AutoWriteBatchClient extends AutoWriteBatch implements AutoWriteBatchClientMethods {
    readonly firestore: FirestoreClient;
    constructor(firestore: FirestoreClient);
}
interface AutoWriteBatchAdminMethods {
    readonly firestore: FirestoreAdmin;
    set<T = DocumentData>(documentRef: DocumentReferenceAdmin<T>, data: T): any;
    set<T = DocumentData>(documentRef: DocumentReferenceAdmin<T>, data: T, options: SetOptionsAdmin): any;
    create(documentRef: DocumentReferenceAdmin<any>, data: any): this;
    update(documentRef: DocumentReferenceAdmin<any>, data: any, precondition?: Precondition): this;
    delete(documentRef: DocumentReferenceAdmin<any>, precondition?: Precondition): this;
    commit(): Promise<{
        count: number;
        results?: WriteResult[];
    }>;
}
export declare class AutoWriteBatchAdmin extends AutoWriteBatch implements AutoWriteBatchAdminMethods {
    readonly firestore: FirestoreAdmin;
    constructor(firestore: FirestoreAdmin);
    private get adminBatch();
    create(documentRef: DocumentReferenceAdmin<any>, data: any): this;
}
export declare function autoWriteBatch(firestore: FirestoreAdmin): AutoWriteBatchAdmin;
export declare function autoWriteBatch(firestore: FirestoreClient): AutoWriteBatchClient;
export {};
