import { Timestamp } from "@firebase/firestore";
import { type FirebaseContextClient } from "../FirebaseContext.js";
import { DocumentData } from "./DocumentData.js";
import { RestQueryConstraint } from "./QueryConstraint.js";
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
    private fetch;
    runCount(): Promise<number>;
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
