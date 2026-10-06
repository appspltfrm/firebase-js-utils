export type CursorDirection = "asc" | "desc";
/** Orders one cursor value the way Firestore would in an ascending `orderBy`. */
export declare function compareCursorValue(a: any, b: any): number;
/**
 * Orders two `startAfter` cursors (one value per `orderBy` field) the way the query does. `directions` is
 * positional; a position without a direction is ascending.
 */
export declare function compareCursorValues(a: any[], b: any[], directions?: ReadonlyArray<CursorDirection | undefined>): number;
