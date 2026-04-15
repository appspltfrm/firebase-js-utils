import type { DocumentData as DocumentDataAdmin } from "firebase-admin/firestore";
import type { DocumentData as DocumentDataClient } from "firebase/firestore";
export type { DocumentDataClient };
export type { DocumentDataAdmin };
export type DocumentData = DocumentDataAdmin | DocumentDataClient;
