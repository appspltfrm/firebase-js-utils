export type MergeChunkedQueriesArgs<T> = {
    /** Number of chunk queries; every chunk yields a disjoint set of records in the same sort order. */
    chunks: number;
    /**
     * Runs one chunk query after the given cursor. `limit <= 0` asks for every remaining record; otherwise the
     * chunk is expected to return at most `limit` records.
     */
    fetch: (chunk: number, startAfter: any[] | undefined, limit: number) => Promise<T[]>;
    /** Cursor of a record — its `orderBy` field values. */
    getStartAfter: (data: T) => any[];
    /** Orders two cursors the way the query does (including `desc` fields). */
    compare: (a: any[], b: any[]) => number;
    /** Post-filter of a fetched record; only records passing it count towards the page. */
    test: (data: T) => Promise<boolean>;
    /** Cursor the page starts after — the last record of the previous page, valid for every chunk. */
    startAfter?: any[];
    /** Page size; `<= 0` returns everything. */
    limit: number;
};
/**
 * Reads one page from several chunk queries (e.g. the `in` chunks of a join) as if they were a single ordered
 * query: the sorted streams are merged by cursor, each chunk paginating independently. A single chunk
 * degenerates to plain "fetch, post-filter, fetch more until the page is full".
 *
 * The returned page holds the globally first records, so its last record is a valid `startAfter` for every
 * chunk on the next page — the caller needs no per-chunk state between pages.
 */
export declare function mergeChunkedQueries<T>(args: MergeChunkedQueriesArgs<T>): Promise<{
    records: T[];
    next: boolean;
}>;
