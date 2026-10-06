import { Timestamp } from "@firebase/firestore";
import { type FirebaseContextClient } from "../FirebaseContext.js";
import { DocumentData } from "./DocumentData.js";
import { RestQueryConstraint } from "./QueryConstraint.js";
import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";
/**
 * Supplies the bearer token for the REST calls in place of the app's `Auth` — for contexts where no
 * signed-in `Auth` instance is available (e.g. a worker that received the token from the main thread).
 * Returning `undefined` sends the request unauthenticated.
 */
export type RestAuthTokenProvider = () => Promise<string | undefined> | string | undefined;
declare class RestProcessor<T extends DocumentData = any> {
    constructor(firebaseOrProto: FirebaseApp | FirebaseContextClient | RestProcessor, databaseId?: string);
    protected readonly firebase: FirebaseApp;
    protected readonly databaseId: string;
    protected auth: Auth;
    private authReady;
    protected authToken?: RestAuthTokenProvider;
    protected firestore: Firestore;
    protected converter?: {
        from: (data: any) => any;
    };
    /**
     * Authenticates the requests with an explicitly supplied token instead of the app's `Auth`.
     */
    withAuthToken(provider: RestAuthTokenProvider | undefined): this;
    withConverter<T extends DocumentData = any>(converter: ({
        from: (data: T) => T;
    }) | undefined): RestProcessor<T>;
    protected restValueToJSValue(value: Value): any;
    protected fetch(body: any, endPointSuffix: string): Promise<any>;
}
export declare class RestDocument<T extends DocumentData = any> extends RestProcessor<T> {
    constructor(firebase: FirebaseApp, documentPath: string, databaseId?: string);
    constructor(firebaseContext: FirebaseContextClient, documentPath: string, databaseId?: string);
    constructor(proto: RestDocument);
    readonly documentPath: string;
    withConverter<T extends DocumentData = any>(converter: {
        from: (data: T) => T;
    }): RestDocument<T>;
    get(): Promise<RestDocumentSnapshot<T> | null>;
}
export declare class RestQuery<T extends DocumentData = any> extends RestProcessor<T> {
    constructor(firebase: FirebaseApp, collectionId: string, databaseId?: string);
    constructor(firebaseContext: FirebaseContextClient, collectionId: string, databaseId?: string);
    constructor(proto: RestQuery);
    private readonly query;
    /** The `orderBy` clauses of this query, in the order they apply. */
    get orderBy(): ReadonlyArray<{
        field: string;
        direction: OrderDirection;
    }>;
    withConverter<T extends DocumentData = any>(converter: {
        from: (data: T) => T;
    }): RestQuery<T>;
    apply(...constraints: Array<RestQueryConstraint | undefined | false>): this;
    runCount(): Promise<number>;
    run(): Promise<RestQuerySnapshot<T>>;
}
export declare function restCollectionQuery<T extends DocumentData = any>(firestore: Firestore, collectionName: string, ...constraints: Array<RestQueryConstraint | undefined | false>): RestQuery<T>;
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
type OrderDirection = "ASCENDING" | "DESCENDING";
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
