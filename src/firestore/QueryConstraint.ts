import {OrderByDirection, WhereFilterOp} from "@firebase/firestore";
import {FieldPath} from "firebase-admin/firestore";
import {DocumentSnapshot} from "./DocumentSnapshot.js";

export type QueryConstraintAndOr = [constraintType: "or" | "and", ...constraints: Array<QueryConstraintWhere | false | undefined | [constraintType: "or" | "and", ...constraints: Array<QueryConstraintWhere | false | undefined>]>];
export type QueryConstraintWhere = [constraintType: "where", fieldPath: string, opStr: WhereFilterOp, value: any];
export type QueryConstraintLimit = [constraintType: "limit", limit: number];
export type QueryConstraintStartAtSnapshot = [constraintType: "startAt", snapshot: DocumentSnapshot];
export type QueryConstraintStartAtValues = [constraintType: "startAt", ...values: any[]];
export type QueryConstraintStartAfterSnapshot = [constraintType: "startAfter", snapshot: DocumentSnapshot];
export type QueryConstraintStartAfterValues = [constraintType: "startAfter", ...values: any[]];
export type QueryConstraintEndAtSnapshot = [constraintType: "endAt", snapshot: DocumentSnapshot];
export type QueryConstraintEndAtValues = [constraintType: "endAt", ...values: any[]];
export type QueryConstraintEndBeforeSnapshot = [constraintType: "endBefore", snapshot: DocumentSnapshot];
export type QueryConstraintEndBeforeValues = [constraintType: "endBefore", ...values: any[]];
export type QueryConstraintLimitToLast = [constraintType: "limitToLast", limit: number];
export type QueryConstraintOrderBy = [constraintType: "orderBy", fieldPath: string, directionStr?: OrderByDirection];
export type QueryConstraintSelect = [constraintType: "select", ...fields: Array<string | FieldPath>];
export type QueryConstraintOffset = [constraintType: "offset", offset: number];

export type QueryConstraint = QueryConstraintAndOr | QueryConstraintWhere | QueryConstraintOrderBy |
    QueryConstraintLimit | QueryConstraintLimitToLast |
    QueryConstraintStartAtSnapshot | QueryConstraintStartAtValues |
    QueryConstraintStartAfterSnapshot | QueryConstraintStartAfterValues |
    QueryConstraintEndAtSnapshot | QueryConstraintEndAtValues |
    QueryConstraintEndBeforeSnapshot | QueryConstraintEndBeforeValues | QueryConstraintSelect;

export type RestQueryConstraint =
    | QueryConstraintAndOr
    | QueryConstraintEndAtValues
    | QueryConstraintEndBeforeValues
    | QueryConstraintLimit
    | QueryConstraintOffset
    | QueryConstraintOrderBy
    | QueryConstraintSelect
    | QueryConstraintStartAfterValues
    | QueryConstraintStartAtValues
    | QueryConstraintWhere;

export type {QueryCompositeFilterConstraint, QueryConstraintType} from "@firebase/firestore";

