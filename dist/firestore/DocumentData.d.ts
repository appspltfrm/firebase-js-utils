import type { firestore as admin } from "firebase-admin";
import type * as client from "firebase/firestore";
export declare type DocumentDataClient = client.DocumentData;
export declare type DocumentDataAdmin = admin.DocumentData;
export declare type DocumentData = DocumentDataAdmin | DocumentDataClient;
