import type { FirestoreDataConverter as DataConverterAdmin } from "firebase-admin/firestore";
import type { FirestoreDataConverter as DataConverterClient, SnapshotOptions } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
import { QueryDocumentSnapshotAdmin, QueryDocumentSnapshotClient } from "./QueryDocumentSnapshot.js";
export type { DataConverterClient };
export type { DataConverterAdmin };
export declare abstract class DataConverter<T = any> implements DataConverterClient<T>, DataConverterAdmin<T> {
    /**
       * Called by the Firestore SDK to convert a custom model object of type T
       * into a plain Javascript object (suitable for writing directly to the
       * Firestore database).
       *
       * @final
       */
    toFirestore(modelObject: T): DocumentData;
    abstract to(modelObject: T): DocumentData;
    /**
       * @final
       */
    fromFirestore(data: DocumentData): T;
    /**
       * Called by the Firestore SDK to convert Firestore data into an object of
       * type T. You can access your data by calling: `snapshot.data(options)`.
       *
       * @param snapshot A QueryDocumentSnapshot containing your data and metadata.
       * @param options The SnapshotOptions from the initial call to `data()`.
       * @final
       */
    fromFirestore(snapshot: QueryDocumentSnapshotClient, options?: SnapshotOptions): T;
    fromFirestore(snapshot: QueryDocumentSnapshotAdmin): T;
    fromFirestore(data: DocumentData): T;
    abstract from(data: DocumentData): T;
}
