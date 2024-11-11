import {runTransaction as runTransactionClient} from "firebase/firestore";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore.js";
import {TransactionFunction, TransactionFunctionAdmin, TransactionFunctionClient} from "./Transaction.js";

export function runTransaction<T>(firestore: FirestoreClient, updateFunction: TransactionFunctionClient<T>): Promise<T>;

export function runTransaction<T>(firestore: FirestoreAdmin, updateFunction: TransactionFunctionAdmin<T>): Promise<T>;

export function runTransaction<T>(firestore: Firestore, updateFunction: TransactionFunction<T>): Promise<T>;

export function runTransaction<T>(firestore: Firestore, updateFunction: TransactionFunction<T> | TransactionFunctionClient<T> | TransactionFunctionAdmin<T>): Promise<T> {

    if (Firestore.isClient(firestore)) {
        return runTransactionClient(firestore, updateFunction as TransactionFunctionClient<T>);
    } else {
        return firestore.runTransaction(updateFunction as TransactionFunctionAdmin<T>);
    }

}
