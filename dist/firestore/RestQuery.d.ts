import { Timestamp } from "@firebase/firestore";
import { FirebaseContextClient } from "../FirebaseContext";
import { DocumentData } from "./DocumentData";
import { RestQueryConstraint } from "./QueryConstraint";
export declare class RestQuery<T extends DocumentData = any> {
    constructor(firebaseContext: FirebaseContextClient, collectionId: string);
    constructor(proto: RestQuery);
    private firebase;
    private readonly query;
    private converter?;
    withConverter(converter: ({
        from: (data: DocumentData) => T;
    }) | undefined): this;
    apply(...constraints: Array<RestQueryConstraint | undefined | false>): this;
    run(): Promise<RestQuerySnapshot<T>>;
}
export interface RestQuerySnapshot<T extends DocumentData = any> {
    docs: RestQueryDocumentSnapshot<T>[];
    readTime: Timestamp;
}
export interface RestQueryDocumentSnapshot<T extends DocumentData> {
    name: string;
    data: T;
    createTime: Timestamp;
    updateTime: Timestamp;
}
