import {OrderByDirection, WhereFilterOp} from "@firebase/firestore";
import {DocumentSnapshot} from "./DocumentSnapshot";

export type QueryConstraintWhere = [constraintType: "where", fieldPath: string, opStr: WhereFilterOp, value: unknown];
export type QueryConstraintLimit = [constraintType: "limit", limit: number];
export type QueryConstraintStartAt = [constraintType: "startAt", snapshot: DocumentSnapshot];
export type QueryConstraintStartAfter = [constraintType: "startAfter", snapshot: DocumentSnapshot];
export type QueryConstraintEndAt = [constraintType: "endAt", snapshot: DocumentSnapshot];
export type QueryConstraintEndBefore = [constraintType: "endBefore", snapshot: DocumentSnapshot];
export type QueryConstraintLimitToLast = [constraintType: "limitToLast", limit: number];
export type QueryConstraintOrderBy = [constraintType: "orderBy", fieldPath: string, directionStr?: OrderByDirection];

export type QueryConstraint = QueryConstraintWhere | QueryConstraintLimit | QueryConstraintLimitToLast | QueryConstraintOrderBy |
    QueryConstraintStartAt | QueryConstraintStartAfter | QueryConstraintEndAt | QueryConstraintEndBefore;

export {QueryConstraintType} from "@firebase/firestore";
