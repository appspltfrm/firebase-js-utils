import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore.js";
import { TransactionFunction, TransactionFunctionAdmin, TransactionFunctionClient } from "./Transaction.js";
export declare function runTransaction<T>(firestore: FirestoreClient, updateFunction: TransactionFunctionClient<T>): Promise<T>;
export declare function runTransaction<T>(firestore: FirestoreAdmin, updateFunction: TransactionFunctionAdmin<T>): Promise<T>;
export declare function runTransaction<T>(firestore: Firestore, updateFunction: TransactionFunction<T>): Promise<T>;
