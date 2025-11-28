import { Bytes, DocumentReference, GeoPoint, Timestamp } from "@firebase/firestore";
export class RestQuery {
    constructor(firebaseOrProto, collectionId) {
        this.firebase = firebaseOrProto instanceof RestQuery ? firebaseOrProto.firebase : firebaseOrProto;
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
    firebase;
    query;
    converter;
    withConverter(converter) {
        this.converter = converter;
        return this;
    }
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
                            value: jsValueToRestValue(value),
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
                query.orderBy.push({ field: { fieldPath: constraint[1] }, direction: jsOrderDirectionToRest[constraint[2]?.toUpperCase()] ?? "ASCENDING" });
            }
            else if (type === "select") {
                query.select = { fields: constraint.slice(1).map(fieldPath => ({ fieldPath })) };
            }
        }
        return this;
    }
    async fetch(body, aggregation = false) {
        const endpoint = `https://firestore.googleapis.com/v1/projects/${this.firebase.projectId}/databases/(default)/documents:${aggregation ? "runAggregationQuery" : "runQuery"}`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await this.firebase.authUser.userIdToken}`
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            class FirestoreError extends Error {
            }
            try {
                const result = await response.json();
                const error = Array.isArray(result) && result.find(r => r.error)?.error;
                if (error) {
                    console.error(result);
                    throw new FirestoreError(error.message);
                }
            }
            catch (e) {
                if (e instanceof FirestoreError) {
                    throw e;
                }
            }
            throw new Error(response.statusText);
        }
        return await response.json();
    }
    async runCount() {
        const alias = "aggregate_0";
        const result = (await this.fetch({
            structuredAggregationQuery: {
                aggregations: [{ alias, count: {} }],
                structuredQuery: this.query
            }
        }, true));
        return result.length ? restValueToJSValue(result[0].result.aggregateFields[alias], this.firebase) : 0;
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
        const result = await this.fetch({ structuredQuery: this.query });
        return {
            docs: result.filter(r => r.document).map(({ document }) => ({
                name: document.name,
                data: convert(Object.entries(document.fields).reduce((acc, [key, val]) => {
                    acc[key] = restValueToJSValue(val, this.firebase);
                    return acc;
                }, {})),
                createTime: Timestamp.fromDate(new Date(document.createTime)),
                updateTime: Timestamp.fromDate(new Date(document.updateTime))
            }))
        };
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
function restValueToJSValue(value, firebase) {
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
        return value.arrayValue.values.map(v => restValueToJSValue(v, firebase));
    }
    else if (value.mapValue !== undefined) {
        return Object.entries(value.mapValue.fields).reduce((obj, [key, val]) => {
            obj[key] = restValueToJSValue(val, firebase);
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
        return firebase.firestoreDocument(fullPath.replace(/^.*\/documents\//, ""));
    }
    throw new Error(`Unsupported REST value: ${JSON.stringify(value)}`);
}
//# sourceMappingURL=RestQuery.js.map