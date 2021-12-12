import {firestore as admin} from "firebase-admin";
import * as client from "firebase/firestore";

export type DocumentDataClient = client.DocumentData;
export type DocumentDataAdmin = admin.DocumentData;
export type DocumentData = DocumentDataAdmin | DocumentDataClient;
