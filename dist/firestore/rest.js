import { Bytes, DocumentReference, GeoPoint, Timestamp } from "@firebase/firestore";
import { doc as firestoreDocument, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
class RestProcessor {
    constructor(firebaseOrProto) {
        if (firebaseOrProto instanceof RestProcessor) {
            this.firebase = firebaseOrProto.firebase;
            this.auth = firebaseOrProto.auth;
        }
        else if (firebaseOrProto.firebase) {
            this.firebase = firebaseOrProto.firebase;
            this.auth = firebaseOrProto.auth;
        }
        else {
            this.firebase = firebaseOrProto;
        }
    }
    firebase;
    auth;
    authReady = false;
    firestore;
    converter;
    withConverter(converter) {
        this.converter = converter;
        return this;
    }
    restValueToJSValue(value) {
        if (value.stringValue !== undefined) {
            return value.stringValue;
        }
        else if (value.integerValue !== undefined) {
            return parseInt(value.integerValue, 10);
        }
        else if (value.doubleValue !== undefined) {
            return value.doubleValue;
        }
        if (value.booleanValue !== undefined) {
            return value.booleanValue;
        }
        else if (value.nullValue !== undefined) {
            return null;
        }
        if (value.arrayValue !== undefined) {
            return (value.arrayValue.values ?? []).map(v => this.restValueToJSValue(v));
        }
        else if (value.mapValue !== undefined) {
            return Object.entries(value.mapValue.fields ?? {}).reduce((obj, [key, val]) => {
                obj[key] = this.restValueToJSValue(val);
                return obj;
            }, {});
        }
        else if (value.timestampValue !== undefined) {
            return Timestamp.fromDate(new Date(value.timestampValue));
        }
        if (value.geoPointValue !== undefined) {
            const { latitude, longitude } = value.geoPointValue;
            return new GeoPoint(latitude, longitude);
        }
        else if (value.bytesValue !== undefined) {
            return Bytes.fromBase64String(value.bytesValue);
        }
        else if (value.referenceValue !== undefined) {
            const fullPath = value.referenceValue;
            if (!this.firestore) {
                this.firestore = getFirestore(this.firebase);
            }
            return firestoreDocument(this.firestore, fullPath.replace(/^.*\/documents\//, ""));
        }
        throw new Error(`Unsupported REST value: ${JSON.stringify(value)}`);
    }
    async fetch(body, endPointSuffix) {
        const endpoint = `https://firestore.googleapis.com/v1/projects/${this.firebase.options.projectId}/databases/(default)/documents${endPointSuffix}`;
        if (!this.auth) {
            this.auth = getAuth(this.firebase);
        }
        if (!this.authReady) {
            await this.auth.authStateReady();
            this.authReady = true;
        }
        const headers = { "Content-Type": "application/json" };
        if (this.auth.currentUser) {
            headers.Authorization = `Bearer ${await this.auth.currentUser.getIdToken()}`;
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
            }
            catch (e) {
                if (e instanceof RestFirestoreError) {
                    throw e;
                }
            }
            throw new Error(response.statusText);
        }
        return await response.json();
    }
}
export class RestDocument extends RestProcessor {
    constructor(firebaseOrProto, documentPath) {
        super(firebaseOrProto);
        documentPath = firebaseOrProto instanceof RestDocument ? firebaseOrProto.documentPath : documentPath;
        if (documentPath.startsWith("/")) {
            documentPath = documentPath.substring(1);
        }
        this.documentPath = documentPath;
    }
    documentPath;
    async get() {
        const convert = (data) => {
            if (this.converter) {
                return this.converter.from(data);
            }
            else {
                return data;
            }
        };
        try {
            const result = await this.fetch(undefined, `/${this.documentPath}`);
            return {
                name: result.name,
                data: convert(Object.entries(result.fields).reduce((acc, [key, val]) => {
                    acc[key] = this.restValueToJSValue(val);
                    return acc;
                }, {})),
                createTime: Timestamp.fromDate(new Date(result.createTime)),
                updateTime: Timestamp.fromDate(new Date(result.updateTime))
            };
        }
        catch (error) {
            if (error instanceof RestFirestoreError && error.code === 404) {
                return null;
            }
            else {
                throw error;
            }
        }
    }
}
export class RestQuery extends RestProcessor {
    constructor(firebaseOrProto, collectionId) {
        super(firebaseOrProto);
        const proto = firebaseOrProto instanceof RestQuery ? firebaseOrProto : undefined;
        this.query = {
            from: typeof collectionId === "string" ? [{ collectionId: collectionId }] : proto.query.from.map(({ collectionId }) => ({ collectionId }))
        };
        if (proto) {
            this.converter = proto.converter;
            const { query: t } = this;
            const { query: p } = proto;
            t.orderBy = p.orderBy?.map(({ field, direction }) => ({ field, direction }));
            t.offset = p.offset;
            t.limit = p.limit;
            if (p.where) {
                const copy = (filter) => {
                    const copied = Object.assign({}, filter);
                    const composite = copied.compositeFilter ? copied : undefined;
                    if (composite) {
                        composite.compositeFilter = Object.assign({}, composite.compositeFilter);
                        composite.compositeFilter.filters = composite.compositeFilter.filters.slice();
                        for (let i = 0; i < composite.compositeFilter.filters.length; i++) {
                            composite.compositeFilter.filters[i] = copy(composite.compositeFilter.filters[i]);
                        }
                    }
                    const field = copied.fieldFilter ? copied : undefined;
                    if (field) {
                        field.fieldFilter = Object.assign({}, field.fieldFilter);
                    }
                    const unary = copied.unaryFilter ? copied : undefined;
                    if (unary) {
                        unary.unaryFilter = Object.assign({}, unary.unaryFilter);
                    }
                    return copied;
                };
                t.where = copy(p.where);
            }
            if (p.select) {
                t.select = { fields: p.select.fields.map(({ fieldPath }) => ({ fieldPath })) };
            }
            if (p.startAt) {
                t.startAt = { values: p.startAt.values.slice(), before: p.startAt.before };
            }
            if (p.endAt) {
                t.endAt = { values: p.endAt.values.slice(), before: p.endAt.before };
            }
        }
    }
    query;
    apply(...constraints) {
        const buildWhereOrAnd = (constraint) => {
            const type = constraint[0];
            if (type === "where") {
                const [, fieldPath, opStr, value] = constraint;
                if (value === null || (typeof value === "number" && isNaN(value))) {
                    return { unaryFilter: {
                            field: { fieldPath },
                            op: ["==", "!="].includes(opStr) ? `IS_${opStr === "!=" ? "NOT_" : ""}${value === null ? "NULL" : "NAN"}` : "OPERATOR_UNSPECIFIED"
                        } };
                }
                else {
                    return { fieldFilter: {
                            field: { fieldPath },
                            op: jsOperatorsToRest[opStr],
                            value: jsValueToRestValue(value)
                        } };
                }
            }
            else if (type === "and" || type === "or") {
                return { compositeFilter: {
                        op: type.toUpperCase(),
                        filters: constraint.slice(1).filter(c => !!c).map(c => buildWhereOrAnd(c))
                    } };
            }
        };
        const { query } = this;
        for (const constraint of constraints.filter(c => !!c)) {
            const type = constraint[0];
            if (type === "or" || type === "and" || type === "where") {
                query.where ??= { compositeFilter: { op: "AND", filters: [] } };
                query.where.compositeFilter.filters.push(buildWhereOrAnd(constraint));
            }
            else if (type === "limit") {
                query.limit = constraint[1];
            }
            else if (type === "offset") {
                query.offset = constraint[1];
            }
            else if (type === "endBefore" || type === "endAt") {
                query.endAt = { values: constraint.slice(1).map(v => jsValueToRestValue(v)), before: type === "endBefore" };
            }
            else if (type === "startAfter" || type === "startAt") {
                query.endAt = { values: constraint.slice(1).map(v => jsValueToRestValue(v)), before: type === "startAt" };
            }
            else if (type === "orderBy") {
                query.orderBy ??= [];
                query.orderBy.push({ field: { fieldPath: constraint[1] }, direction: (constraint[2] ? jsOrderDirectionToRest[constraint[2].toUpperCase()] : "ASCENDING") });
            }
            else if (type === "select") {
                query.select = { fields: constraint.slice(1).map(fieldPath => ({ fieldPath })) };
            }
        }
        return this;
    }
    async runCount() {
        const alias = "aggregate_0";
        const result = (await this.fetch({
            structuredAggregationQuery: {
                aggregations: [{ alias, count: {} }],
                structuredQuery: this.query
            }
        }, ":runAggregationQuery"));
        return result.length ? this.restValueToJSValue(result[0].result.aggregateFields[alias]) : 0;
    }
    async run() {
        const convert = (data) => {
            if (this.converter) {
                return this.converter.from(data);
            }
            else {
                return data;
            }
        };
        const result = await this.fetch({ structuredQuery: this.query }, ":runQuery");
        return {
            docs: result.filter(r => r.document).map(({ document }) => ({
                name: document.name,
                data: convert(Object.entries(document.fields).reduce((acc, [key, val]) => {
                    acc[key] = this.restValueToJSValue(val);
                    return acc;
                }, {})),
                createTime: Timestamp.fromDate(new Date(document.createTime)),
                updateTime: Timestamp.fromDate(new Date(document.updateTime))
            }))
        };
    }
}
class RestFirestoreError extends Error {
    code;
    status;
    constructor(code, message, status) {
        super(message);
        this.code = code;
        this.status = status;
    }
}
const jsOrderDirectionToRest = { "ASC": "ASCENDING", "DESC": "DESCENDING" };
const jsOperatorsToRest = {
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
};
function jsValueToRestValue(value) {
    if (value === null) {
        return { nullValue: "NULL_VALUE" };
    }
    else if (value instanceof Timestamp) {
        return { timestampValue: value.toDate().toISOString() };
    }
    else if (value instanceof GeoPoint) {
        return {
            geoPointValue: {
                latitude: value.latitude,
                longitude: value.longitude
            }
        };
    }
    else if (value instanceof Bytes) {
        return { bytesValue: value.toBase64() };
    }
    else if (value instanceof DocumentReference) {
        return { referenceValue: value.path };
    }
    else if (typeof value === "boolean") {
        return { booleanValue: value };
    }
    else if (typeof value === "string") {
        return { stringValue: value };
    }
    else if (typeof value === "number") {
        if (Number.isSafeInteger(value)) {
            return { integerValue: value.toString() };
        }
        return { doubleValue: value };
    }
    else if (value instanceof Date) {
        return { timestampValue: value.toISOString() };
    }
    else if (Array.isArray(value)) {
        return { arrayValue: { values: value.map(jsValueToRestValue) } };
    }
    else if (value && typeof value === "object") {
        return {
            mapValue: {
                fields: Object.entries(value).reduce((acc, [key, val]) => {
                    acc[key] = jsValueToRestValue(val);
                    return acc;
                }, {})
            }
        };
    }
    throw new Error(`Nieobsługiwana wartość JS: ${value}`);
}
//# sourceMappingURL=rest.js.map