import {Bytes, DocumentReference, GeoPoint, Timestamp, WhereFilterOp} from "@firebase/firestore";
import {type FirebaseContextClient} from "../FirebaseContext.js";
import {DocumentData} from "./DocumentData.js";
import {
  QueryConstraintAndOr,
  QueryConstraintLimit,
  QueryConstraintOffset,
  QueryConstraintOrderBy,
  QueryConstraintType,
  QueryConstraintWhere,
  RestQueryConstraint
} from "./QueryConstraint.js";
import {FirebaseApp} from "firebase/app";
import {Firestore, doc as firestoreDocument, getFirestore} from "firebase/firestore";
import {Auth, getAuth} from "firebase/auth";

class RestProcessor<T extends DocumentData = any> {

  constructor(firebaseOrProto: FirebaseApp | FirebaseContextClient | RestProcessor) {

    if (firebaseOrProto instanceof RestProcessor) {
      this.firebase = firebaseOrProto.firebase;
      this.auth = firebaseOrProto.auth;
    } else if ((firebaseOrProto as FirebaseContextClient).firebase) {
      this.firebase = (firebaseOrProto as FirebaseContextClient).firebase;
      this.auth = (firebaseOrProto as FirebaseContextClient).auth;
    } else {
      this.firebase = firebaseOrProto as FirebaseApp;
    }
  }

  protected readonly firebase: FirebaseApp;
  protected auth!: Auth;
  private authReady = false;
  protected firestore!: Firestore;

  protected converter?: {from: (data: DocumentData) => T};

  withConverter(converter: ({from: (data: DocumentData) => T}) | undefined): this {
    this.converter = converter;
    return this;
  }

  protected restValueToJSValue(value: Value): any {

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
      return ((value as ArrayValue).arrayValue.values ?? []).map(v => this.restValueToJSValue(v));

    } else if ((value as ObjectValue).mapValue !== undefined) {
      return Object.entries((value as ObjectValue).mapValue.fields ?? {}).reduce((obj, [key, val]) => {
        obj[key] = this.restValueToJSValue(val);
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
      if (!this.firestore) {
        this.firestore = getFirestore(this.firebase);
      }
      return firestoreDocument(this.firestore, fullPath.replace(/^.*\/documents\//, ""));
    }

    throw new Error(`Unsupported REST value: ${JSON.stringify(value)}`);
  }

  protected async fetch(body: any, endPointSuffix: string) {

    const endpoint = `https://firestore.googleapis.com/v1/projects/${this.firebase.options.projectId}/databases/(default)/documents${endPointSuffix}`;

    if (!this.auth) {
      this.auth = getAuth(this.firebase);
    }

    if (!this.authReady) {
      await this.auth.authStateReady();
      this.authReady = true;
    }

    const headers: any = {"Content-Type": "application/json"};
    if (this.auth.currentUser) {
      headers.Authorization = `Bearer ${await this.auth.currentUser!.getIdToken()}`;
    }

    const response = await fetch(endpoint, {
      method: body ? "POST" : "GET",
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {

      try {
        const result = await response.json();
        const error = Array.isArray(result) ? result.find(r => r.error)?.error : result.error;
        if (error) {
          throw new RestFirestoreError(error.code, error.message, error.status);
        }
      } catch (e) {
        if (e instanceof RestFirestoreError) {
          throw e;
        }
      }

      throw new Error(response.statusText);
    }

    return await response.json();
  }
}

export class RestDocument<T extends DocumentData = any> extends RestProcessor<T> {
  constructor(firebase: FirebaseApp, documentPath: string);
  constructor(firebaseContext: FirebaseContextClient, documentPath: string);
  constructor(proto: RestDocument);
  constructor(firebaseOrProto: FirebaseApp | FirebaseContextClient | RestDocument, documentPath?: string) {
    super(firebaseOrProto);

    documentPath = firebaseOrProto instanceof RestDocument ? firebaseOrProto.documentPath : documentPath!;
    if (documentPath.startsWith("/")) {
      documentPath = documentPath.substring(1);
    }

    this.documentPath = documentPath;
  }

  readonly documentPath: string;

  async get(): Promise<RestDocumentSnapshot<T> | null> {

    const convert = (data: any) => {
      if (this.converter) {
        return this.converter.from(data);
      } else {
        return data;
      }
    };

    try {
      const result = (await this.fetch(undefined, `/${this.documentPath}`) as ResultDocument["document"]);

      return {
        name: result.name,
        data: convert(Object.entries(result.fields).reduce((acc, [key, val]) => {
          acc[key] = this.restValueToJSValue(val);
          return acc;
        }, {} as T)),
        createTime: Timestamp.fromDate(new Date(result.createTime)),
        updateTime: Timestamp.fromDate(new Date(result.updateTime))
      } as RestDocumentSnapshot<T>;

    } catch (error) {
      if (error instanceof RestFirestoreError && error.code === 404) {
        return null;
      } else {
        throw error;
      }
    }
  }
}

export class RestQuery<T extends DocumentData = any> extends RestProcessor<T> {

  constructor(firebase: FirebaseApp, collectionId: string);
  constructor(firebaseContext: FirebaseContextClient, collectionId: string);
  constructor(proto: RestQuery);
  constructor(firebaseOrProto: FirebaseApp | FirebaseContextClient | RestQuery, collectionId?: string) {
    super(firebaseOrProto);

    const proto = firebaseOrProto instanceof RestQuery ? firebaseOrProto : undefined;

    this.query = {
      from: typeof collectionId === "string" ? [{collectionId: collectionId}] : proto!.query.from.map(({collectionId}) => ({collectionId}))
    };

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
        };

        t.where = copy(p.where);
      }

      if (p.select) {
        t.select = {fields: p.select.fields.map(({fieldPath}) => ({fieldPath}))};
      }

      if (p.startAt) {
        t.startAt = {values: p.startAt.values.slice(), before: p.startAt.before};
      }

      if (p.endAt) {
        t.endAt = {values: p.endAt.values.slice(), before: p.endAt.before};
      }
    }
  }

  private readonly query: StructuredQuery;

  apply(...constraints: Array<RestQueryConstraint | undefined | false>): this {

    const buildWhereOrAnd = (constraint: QueryConstraintWhere | QueryConstraintAndOr): Filter | undefined => {
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
            value: jsValueToRestValue(value)
          }} satisfies FieldFilter;
        }
      } else if (type === "and" || type === "or") {
        return {compositeFilter: {
          op: type.toUpperCase() as CompositeFilterOp,
          filters: constraint.slice(1).filter(c => !!c).map(c => buildWhereOrAnd(c)) as Filter[]
        }} satisfies CompositeFilter;
      }
    };

    const {query} = this;

    for (const constraint of constraints.filter(c => !!c) as RestQueryConstraint[]) {
      const type = constraint[0] as Exclude<QueryConstraintType, "limitToLast"> | "and" | "or" | "select" | "offset";

      if (type === "or" || type === "and" || type === "where") {
        query.where ??= {compositeFilter: {op: "AND", filters: [] as Filter[]}} satisfies CompositeFilter;
        (query.where as CompositeFilter).compositeFilter.filters.push(buildWhereOrAnd(constraint as QueryConstraintAndOr | QueryConstraintWhere)!);
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
        query.orderBy.push({field: {fieldPath: (constraint as QueryConstraintOrderBy)[1]}, direction: ((constraint as QueryConstraintOrderBy)[2] ? jsOrderDirectionToRest[(constraint as QueryConstraintOrderBy)[2]!.toUpperCase() as "ASC" | "DESC"] : "ASCENDING") as OrderDirection});
      } else if (type === "select") {
        query.select = {fields: constraint.slice(1).map(fieldPath => ({fieldPath} satisfies FieldReference))};
      }
    }

    return this;
  }

  async runCount(): Promise<number> {
    const alias = "aggregate_0";
    const result = (await this.fetch({
      structuredAggregationQuery: {
        aggregations: [{alias, count: {}}],
        structuredQuery: this.query
      }
    }, ":runAggregationQuery")) as ResultAggregation[];

    return result.length ? this.restValueToJSValue(result[0].result.aggregateFields[alias]) as number : 0;
  }

  async run(): Promise<RestQuerySnapshot<T>> {

    const convert = (data: any) => {
      if (this.converter) {
        return this.converter.from(data);
      } else {
        return data;
      }
    };

    const result = (await this.fetch({structuredQuery: this.query}, ":runQuery") as Array<ResultDocument>);

    return {
      docs: result.filter(r => r.document).map(({document}) => ({
        name: document.name,
        data: convert(Object.entries(document.fields).reduce((acc, [key, val]) => {
          acc[key] = this.restValueToJSValue(val);
          return acc;
        }, {} as T)),
        createTime: Timestamp.fromDate(new Date(document.createTime)),
        updateTime: Timestamp.fromDate(new Date(document.updateTime))
      }))
    } as RestQuerySnapshot<T>;
  }

}

class RestFirestoreError extends Error {
  constructor(public readonly code: number, message: string, public readonly status: string) {
    super(message);
  }
}


interface ResultAggregation {
  result: {
    aggregateFields: {[field: string]: Value};
  },
  readTime: string;
}

interface ResultDocument {
  document: {
    name: string;
    fields: Record<string, Value>;
    createTime: string;
    updateTime: string;
  }
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
const jsOrderDirectionToRest = {"ASC": "ASCENDING", "DESC": "DESCENDING"};

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
    fields: {[fieldPath: string]: Value};
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
    return {nullValue: "NULL_VALUE"};

  } else if (value instanceof Timestamp) {
    return {timestampValue: value.toDate().toISOString()};

  } else if (value instanceof GeoPoint) {
    return {
      geoPointValue: {
        latitude: value.latitude,
        longitude: value.longitude
      }
    };

  } else if (value instanceof Bytes) {
    return {bytesValue: value.toBase64()};

  } else if (value instanceof DocumentReference) {
    return {referenceValue: value.path};

  } else if (typeof value === "boolean") {
    return {booleanValue: value};

  } else if (typeof value === "string") {
    return {stringValue: value};

  } else if (typeof value === "number") {
    if (Number.isSafeInteger(value)) {
      return {integerValue: value.toString()};
    }
    return {doubleValue: value};

  } else if (value instanceof Date) {
    return {timestampValue: value.toISOString()};

  } else if (Array.isArray(value)) {
    return {arrayValue: {values: value.map(jsValueToRestValue)}};

  } else if (value && typeof value === "object") {
    return {
      mapValue: {
        fields: Object.entries(value).reduce((acc, [key, val]) => {
          acc[key] = jsValueToRestValue(val);
          return acc;
        }, {} as Record<string, Value>)
      }
    };
  }

  throw new Error(`Nieobsługiwana wartość JS: ${value}`);
}
