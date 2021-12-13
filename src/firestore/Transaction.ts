import type {firestore as admin} from "firebase-admin";
import {Transaction as TransactionClient} from "firebase/firestore";

export type {TransactionClient};
export type TransactionAdmin = admin.Transaction;
export type Transaction = TransactionAdmin | TransactionClient;

export type TransactionFunctionClient<T> = (transaction: TransactionClient) => Promise<T>;
export type TransactionFunctionAdmin<T> = (transaction: TransactionAdmin) => Promise<T>;
export type TransactionFunction<T> = (transaction: Transaction) => Promise<T>;

export namespace Transaction {

    export function isClient(transaction: Transaction): transaction is TransactionClient {
        return transaction instanceof TransactionClient;
    }

    export function isAdmin(transaction: Transaction): transaction is TransactionAdmin {
        return !isClient(transaction);
    }
}
