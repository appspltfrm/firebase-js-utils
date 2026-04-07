import { Timestamp } from "@firebase/firestore";
import { type FirebaseContextClient } from "../FirebaseContext.js";
import { DocumentData } from "./DocumentData.js";
import { RestQueryConstraint } from "./QueryConstraint.js";
import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";
declare class RestProcessor<T extends DocumentData = any> {
    constructor(firebaseOrProto: FirebaseApp | FirebaseContextClient | RestProcessor);
    protected readonly firebase: FirebaseApp;
    protected auth: Auth;
    private authReady;
    protected firestore: Firestore;
    protected converter?: {
        from: (data: DocumentData) => T;
    };
    withConverter(converter: ({
        from: (data: DocumentData) => T;
    }) | undefined): this;
    protected restValueToJSValue(value: Value): any;
    protected fetch(body: any, endPointSuffix: string): Promise<any>;
}
export declare class RestDocument<T extends DocumentData = any> extends RestProcessor<T> {
    constructor(firebase: FirebaseApp, documentPath: string);
    constructor(firebaseContext: FirebaseContextClient, documentPath: string);
    constructor(proto: RestDocument);
    readonly documentPath: string;
    get(): Promise<RestDocumentSnapshot<T> | null>;
}
export declare class RestQuery<T extends DocumentData = any> extends RestProcessor<T> {
    constructor(firebase: FirebaseApp, collectionId: string);
    constructor(firebaseContext: FirebaseContextClient, collectionId: string);
    constructor(proto: RestQuery);
    private readonly query;
    apply(...constraints: Array<RestQueryConstraint | undefined | false>): this;
    runCount(): Promise<number>;
    run(): Promise<RestQuerySnapshot<T>>;
}
export interface RestQuerySnapshot<T extends DocumentData = any> {
    docs: RestDocumentSnapshot<T>[];
    readTime: Timestamp;
}
export interface RestDocumentSnapshot<T extends DocumentData> {
    name: string;
    data: T;
    createTime: Timestamp;
    updateTime: Timestamp;
}
type Value = NullValue | BooleanValue | IntegerValue | DoubleValue | TimestampValue | StringValue | BytesValue | ReferenceValue | GeoPointValue | ArrayValue | ObjectValue;
interface NullValue {
    nullValue: "NULL_VALUE";
}
interface BooleanValue {
    booleanValue: boolean;
}
interface IntegerValue {
    integerValue: string;
}
interface DoubleValue {
    doubleValue: number;
}
interface TimestampValue {
    timestampValue: string;
}
interface StringValue {
    stringValue: string;
}
interface BytesValue {
    bytesValue: string;
}
interface ReferenceValue {
    referenceValue: string;
}
interface GeoPointValue {
    geoPointValue: {
        latitude: number;
        longitude: number;
    };
}
interface ArrayValue {
    arrayValue: {
        values: Value[];
    };
}
interface ObjectValue {
    mapValue: {
        fields: {
            [fieldPath: string]: Value;
        };
    };
}
export {};
