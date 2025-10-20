import {WhereFilterOp, Bytes, GeoPoint, Timestamp, DocumentReference, FirestoreDataConverter} from "@firebase/firestore";
import {FirebaseContextClient} from "../FirebaseContext";
import {DocumentData} from "./DocumentData";
import {
    QueryConstraintAndOr,
    QueryConstraintLimit,
    QueryConstraintOffset,
    QueryConstraintOrderBy,
    QueryConstraintType,
    QueryConstraintWhere,
    RestQueryConstraint
} from "./QueryConstraint";

export class RestQuery<T extends DocumentData = any> {

    constructor(firebaseContext: FirebaseContextClient, collectionId: string);
    constructor(proto: RestQuery);
    constructor(firebaseOrProto: FirebaseContextClient | RestQuery, collectionId?: string) {

        this.firebase = firebaseOrProto instanceof RestQuery ? firebaseOrProto.firebase : firebaseOrProto;

        const proto = firebaseOrProto instanceof RestQuery ? firebaseOrProto : undefined;

        this.query = {
            from: typeof collectionId === "string" ? [{collectionId: collectionId}] : proto.query.from.map(({collectionId}) => ({collectionId}))
        }

        if (proto) {
            this.converter = proto.converter;

            const {query: t} = this;
            const {query: p} = proto;
            t.orderBy = p.orderBy?.map(({field, direction}) => ({field, direction}));
            t.offset = p.offset;
            t.limit = p.limit;

            if (p.where) {
                const copy = (filter: Filter) => {
                    const copied: Filter = Object.assign({}, filter);

                    const composite = (copied as CompositeFilter).compositeFilter ? copied as CompositeFilter : undefined;
                    if (composite) {
                        composite.compositeFilter = Object.assign({}, composite.compositeFilter);
                        composite.compositeFilter.filters = composite.compositeFilter.filters.slice();
                        for (let i = 0; i < composite.compositeFilter.filters.length; i++) {
                            composite.compositeFilter.filters[i] = copy(composite.compositeFilter.filters[i]);
                        }
                    }

                    const field = (copied as FieldFilter).fieldFilter ? copied as FieldFilter : undefined;
                    if (field) {
                        field.fieldFilter = Object.assign({}, field.fieldFilter);
                    }

                    const unary = (copied as UnaryFilter).unaryFilter ? copied as UnaryFilter : undefined;
                    if (unary) {
                        unary.unaryFilter = Object.assign({}, unary.unaryFilter);
                    }

                    return copied;
                }
            }

            if (p.select) {
                t.select = {fields: p.select.fields.map(({fieldPath}) => ({fieldPath}))}
            }

            if (p.startAt) {
                t.startAt = {values: p.startAt.values.slice(), before: p.startAt.before}
            }

            if (p.endAt) {
                t.endAt = {values: p.endAt.values.slice(), before: p.endAt.before}
            }
        }
    }

    private firebase: FirebaseContextClient;
    private readonly query: StructuredQuery;
    private converter?: {from: (data: DocumentData) => T};

    withConverter(converter: ({from: (data: DocumentData) => T}) | undefined): this {
        this.converter = converter;
        return this;
    }

    apply(...constraints: RestQueryConstraint[]): this {

        const buildWhereOrAnd = (constraint: QueryConstraintWhere | QueryConstraintAndOr): Filter => {
            const type = constraint[0] as "where" | "and" | "or";
            if (type === "where") {
                const [, fieldPath, opStr, value] = constraint as QueryConstraintWhere;
                if (value === null || (typeof value === "number" && isNaN(value))) {
                    return {unaryFilter: {
                        field: {fieldPath},
                        op: ["==", "!="].includes(opStr) ? `IS_${opStr === "!=" ? "NOT_" : ""}${value === null ? "NULL" : "NAN"}` : "OPERATOR_UNSPECIFIED"
                    }} satisfies UnaryFilter;
                } else {
                    return {fieldFilter: {
                        field: {fieldPath},
                        op: jsOperatorsToRest[opStr],
                        value: jsValueToRestValue(value),
                    }} satisfies FieldFilter
                }
            } else if (type === "and" || type === "or") {
                return {compositeFilter: {
                    op: type.toUpperCase() as CompositeFilterOp,
                    filters: constraint.slice(1).filter(c => !!c).map(c => buildWhereOrAnd(c))
                }} satisfies CompositeFilter
            }
        }

        const {query} = this;

        for (const constraint of constraints.filter(c => !!c)) {
            const type = constraint[0] as Exclude<QueryConstraintType, "limitToLast"> | "and" | "or" | "select" | "offset";

            if (type === "or" || type === "and" || type === "where") {
                query.where ??= {compositeFilter: {op: "AND", filters: [] as Filter[]}} satisfies CompositeFilter;
                (query.where as CompositeFilter).compositeFilter.filters.push(buildWhereOrAnd(constraint as QueryConstraintAndOr | QueryConstraintWhere));
            } else if (type === "limit") {
                query.limit = (constraint as QueryConstraintLimit)[1];
            } else if (type === "offset") {
                query.offset = (constraint as QueryConstraintOffset)[1];
            } else if (type === "endBefore" || type === "endAt") {
                query.endAt = {values: constraint.slice(1).map(v => jsValueToRestValue(v)), before: type === "endBefore"} as Cursor;
            } else if (type === "startAfter" || type === "startAt") {
                query.endAt = {values: constraint.slice(1).map(v => jsValueToRestValue(v)), before: type === "startAt"} as Cursor;
            } else if (type === "orderBy") {
                query.orderBy ??= [];
                query.orderBy.push({field: {fieldPath: (constraint as QueryConstraintOrderBy)[1]}, direction: (constraint as QueryConstraintOrderBy)[2]?.toUpperCase() as OrderDirection ?? "ASCENDING"});
            } else if (type === "select") {
                query.select = {fields: constraint.slice(1).map(fieldPath => ({fieldPath} satisfies FieldReference))}
            }
        }

        return this;
    }
    
    async run(): Promise<RestQueryDocument<T>[]> {
        
        const endpoint = `https://firestore.googleapis.com/v1/projects/${this.firebase.projectId}/databases/(default)/documents:runQuery`;
        
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await this.firebase.authUser.userIdToken}`
            },
            body: JSON.stringify({structuredQuery: this.query})
        })

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const convert = (data: any) => {
            if (this.converter) {
                return this.converter.from(data);
            } else {
                return data;
            }
        }

        return (await response.json() as {document: {
            name: string;
            fields: Record<string, Value>;
            createTime: string;
            updateTime: string;
        }}[]).map(({document}) => ({
            name: document.name,
            data: convert(Object.entries(document.fields).reduce((acc, [key, val]) => {
                acc[key] = restValueToJSValue(val, this.firebase);
                return acc;
            }, {} as T)),
            createTime: Timestamp.fromDate(new Date(document.createTime)),
            updateTime: Timestamp.fromDate(new Date(document.updateTime))
        }))
    }


}

export interface RestQueryDocument<T extends DocumentData> {
    name: string;
    data: T;
    createTime: Timestamp;
    updateTime: Timestamp;
}

interface StructuredQuery {
    select?: Projection;
    from: CollectionSelector[];
    where?: Filter;
    orderBy?: Order[];
    limit?: number;
    offset?: number;
    startAt?: Cursor;
    endAt?: Cursor;
}

interface Projection {
    fields: FieldReference[];
}

interface FieldReference {
    fieldPath: string;
}

interface CollectionSelector {
    collectionId: string;
}

type Filter = CompositeFilter | FieldFilter | UnaryFilter;

interface CompositeFilter {
    compositeFilter: {
        op: CompositeFilterOp;
        filters: Filter[];
    }
}

interface UnaryFilter {
    unaryFilter: {
        field: FieldReference;
        op: UnaryFilterOp;
    }
}

type UnaryFilterOp = "IS_NAN" | "IS_NOT_NAN" | "IS_NULL" | "IS_NOT_NULL" | "OPERATOR_UNSPECIFIED";

type CompositeFilterOp = "AND" | "OR";

interface FieldFilter {
    fieldFilter: {
        field: FieldReference;
        op: FieldFilterOp;
        value: Value;
    }
}

type FieldFilterOp =
    | "EQUAL"
    | "GREATER_THAN"
    | "GREATER_THAN_OR_EQUAL"
    | "LESS_THAN"
    | "LESS_THAN_OR_EQUAL"
    | "ARRAY_CONTAINS"
    | "IN"
    | "ARRAY_CONTAINS_ANY"
    | "NOT_EQUAL"
    | "NOT_IN";

interface Order {
    field: FieldReference;
    direction: OrderDirection;
}

type OrderDirection = "ASCENDING" | "DESCENDING";

interface Cursor {
    before: boolean;
    values: Value[];
}

type Value =
    | NullValue
    | BooleanValue
    | IntegerValue
    | DoubleValue
    | TimestampValue
    | StringValue
    | BytesValue
    | ReferenceValue
    | GeoPointValue
    | ArrayValue
    | ObjectValue;

interface NullValue {
    nullValue: "NULL_VALUE";
}

interface BooleanValue {
    booleanValue: boolean;
}

interface IntegerValue {
    integerValue: string; // string to avoid precision issues
}

interface DoubleValue {
    doubleValue: number;
}

interface TimestampValue {
    timestampValue: string; // ISO 8601
}

interface StringValue {
    stringValue: string;
}

interface BytesValue {
    bytesValue: string; // Bytes value (base64 encoded)
}

interface ReferenceValue {
    referenceValue: string; // Full resource name
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
    }
}

interface ObjectValue {
    mapValue: {
        fields: { [fieldPath: string]: Value };
    }
}

const jsOperatorsToRest: Record<WhereFilterOp, FieldFilterOp> = {
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    "array-contains-any": "ARRAY_CONTAINS_ANY",
    "in": "IN",
    "not-in": "NOT_IN"
} as const;

function jsValueToRestValue(value: any): Value {
    if (value === null) {
        return {nullValue: "NULL_VALUE"}

    } else if (value instanceof Timestamp) {
        return {timestampValue: value.toDate().toISOString()}

    } else if (value instanceof GeoPoint) {
        return {
            geoPointValue: {
                latitude: value.latitude,
                longitude: value.longitude
            }
        }

    } else if (value instanceof Bytes) {
        return {bytesValue: value.toBase64()}

    } else if (value instanceof DocumentReference) {
        return {referenceValue: value.path}

    } else if (typeof value === "boolean") {
        return {booleanValue: value}

    } else if (typeof value === "string") {
        return {stringValue: value}

    } else if (typeof value === "number") {
        if (Number.isSafeInteger(value)) {
            return {integerValue: value.toString()};
        }
        return {doubleValue: value}

    } else if (value instanceof Date) {
        return {timestampValue: value.toISOString()}

    } else if (Array.isArray(value)) {
        return {arrayValue: {values: value.map(jsValueToRestValue)}}

    } else if (value && typeof value === "object") {
        return {
            mapValue: {
                fields: Object.entries(value).reduce((acc, [key, val]) => {
                    acc[key] = jsValueToRestValue(val);
                    return acc;
                }, {} as Record<string, Value>)
            }
        }
    }

    throw new Error(`Nieobsługiwana wartość JS: ${value}`);
}

function restValueToJSValue(value: Value, firebase: FirebaseContextClient) {

    if ((value as StringValue).stringValue !== undefined) {
        return (value as StringValue).stringValue;

    } else if ((value as IntegerValue).integerValue !== undefined) {
        return parseInt((value as IntegerValue).integerValue, 10);

    } else if ((value as DoubleValue).doubleValue !== undefined) {
        return (value as DoubleValue).doubleValue;

    } if ((value as BooleanValue).booleanValue !== undefined) {
        return (value as BooleanValue).booleanValue;

    } else if ((value as NullValue).nullValue !== undefined) {
        return null;

    } if ((value as ArrayValue).arrayValue !== undefined) {
        return (value as ArrayValue).arrayValue.values.map(v => restValueToJSValue(v, firebase));

    } else if ((value as ObjectValue).mapValue !== undefined) {
        return Object.entries((value as ObjectValue).mapValue.fields).reduce((obj, [key, val]) => {
            obj[key] = restValueToJSValue(val, firebase);
            return obj;
        }, {} as Record<string, any>);

    } else if ((value as TimestampValue).timestampValue !== undefined) {
        return Timestamp.fromDate(new Date((value as TimestampValue).timestampValue));

    } if ((value as GeoPointValue).geoPointValue !== undefined) {
        const {latitude, longitude} = (value as GeoPointValue).geoPointValue;
        return new GeoPoint(latitude, longitude);

    } else if ((value as BytesValue).bytesValue !== undefined) {
        return Bytes.fromBase64String((value as BytesValue).bytesValue);

    } else if ((value as ReferenceValue).referenceValue !== undefined) {
        const fullPath = (value as ReferenceValue).referenceValue;
        return firebase.firestoreDocument(fullPath.replace(/^.*\/documents\//, ""));
    }

    throw new Error(`Unsupported REST value: ${JSON.stringify(value)}`);
}
