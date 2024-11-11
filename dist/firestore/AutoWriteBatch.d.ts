import type { Precondition, SetOptions as SetOptionsAdmin, WriteResult } from "@google-cloud/firestore";
import type { SetOptions as SetOptionsClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference.js";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore.js";
interface CommitResult<SuccessResult = any> {
    successCount: number;
    successResults: SuccessResult[];
    errorCount: number;
    errors: any[];
}
export declare abstract class AutoWriteBatch {
    readonly firestore: Firestore;
    protected constructor(firestore: Firestore);
    onCommit: (result: CommitResult) => void;
    protected operations: [method: "set" | "delete" | "update" | "create", args: any[]][];
    protected limit$: number;
    protected successCount$: number;
    protected errorCount$: number;
    get count(): number;
    get successCount(): number;
    get errorCount(): number;
    get limit(): number;
    set limit(limit: number);
    autoCommit(): Promise<CommitResult>;
    commit(): Promise<CommitResult>;
    delete(documentRef: DocumentReference<any>): this;
    set<T = DocumentData>(documentRef: DocumentReference<T>, data: T, options?: any): this;
    update(documentRef: DocumentReference<any>, data: any): this;
    private commitImpl;
    private createBatch;
}
interface AutoWriteBatchClientMethods {
    readonly firestore: FirestoreClient;
    commit(): Promise<CommitResult>;
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
    autoCommit(): Promise<CommitResult<WriteResult>>;
    commit(): Promise<CommitResult<WriteResult>>;
}
export declare class AutoWriteBatchAdmin extends AutoWriteBatch implements AutoWriteBatchAdminMethods {
    readonly firestore: FirestoreAdmin;
    constructor(firestore: FirestoreAdmin);
    create(documentRef: DocumentReferenceAdmin<any>, data: any): this;
}
export declare namespace AutoWriteBatch {
    function isClient(batch: AutoWriteBatch): batch is AutoWriteBatchClient;
    function isAdmin(batch: AutoWriteBatch): batch is AutoWriteBatchAdmin;
}
export declare function autoWriteBatch(firestore: FirestoreAdmin): AutoWriteBatchAdmin;
export declare function autoWriteBatch(firestore: FirestoreClient): AutoWriteBatchClient;
export {};
