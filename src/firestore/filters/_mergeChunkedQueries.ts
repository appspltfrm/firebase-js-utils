export type MergeChunkedQueriesArgs<T> = {
  /** Number of chunk queries; every chunk yields a disjoint set of records in the same sort order. */
  chunks: number,
  /**
   * Runs one chunk query after the given cursor. `limit <= 0` asks for every remaining record; otherwise the
   * chunk is expected to return at most `limit` records.
   */
  fetch: (chunk: number, startAfter: any[] | undefined, limit: number) => Promise<T[]>,
  /** Cursor of a record — its `orderBy` field values. */
  getStartAfter: (data: T) => any[],
  /** Orders two cursors the way the query does (including `desc` fields). */
  compare: (a: any[], b: any[]) => number,
  /** Post-filter of a fetched record; only records passing it count towards the page. */
  test: (data: T) => Promise<boolean>,
  /** Cursor the page starts after — the last record of the previous page, valid for every chunk. */
  startAfter?: any[],
  /** Page size; `<= 0` returns everything. */
  limit: number
};

type ChunkBuffer<T> = {
  rows: T[],
  /** Cursor of the last consumed row — where the next fetch of this chunk continues. */
  cursor: any[] | undefined,
  /** The last fetch returned fewer rows than asked, so the chunk holds nothing more. */
  exhausted: boolean
};

/**
 * Reads one page from several chunk queries (e.g. the `in` chunks of a join) as if they were a single ordered
 * query: the sorted streams are merged by cursor, each chunk paginating independently. A single chunk
 * degenerates to plain "fetch, post-filter, fetch more until the page is full".
 *
 * The returned page holds the globally first records, so its last record is a valid `startAfter` for every
 * chunk on the next page — the caller needs no per-chunk state between pages.
 */
export async function mergeChunkedQueries<T>(args: MergeChunkedQueriesArgs<T>): Promise<{records: T[], next: boolean}> {

  const {chunks, fetch, getStartAfter, compare, test, startAfter, limit} = args;

  const hasLimit = limit > 0;
  const fetchLimit = hasLimit ? limit + 1 : -1;

  const load = async (chunk: number, buffer: ChunkBuffer<T>) => {
    buffer.rows = await fetch(chunk, buffer.cursor ?? startAfter, fetchLimit);
    buffer.exhausted = !hasLimit || buffer.rows.length < fetchLimit;
  };

  const buffers: ChunkBuffer<T>[] = Array.from({length: chunks}, () => ({rows: [], cursor: undefined, exhausted: false}));
  await Promise.all(buffers.map((buffer, chunk) => load(chunk, buffer)));

  const records: T[] = [];

  while (!hasLimit || records.length <= limit) {

    let best = -1;
    let bestCursor: any[] | undefined;

    for (let i = 0; i < buffers.length; i++) {
      const head = buffers[i].rows[0];
      if (head === undefined) {
        continue;
      }
      const cursor = getStartAfter(head);
      if (best < 0 || compare(cursor, bestCursor!) < 0) {
        best = i;
        bestCursor = cursor;
      }
    }

    if (best < 0) {
      break;
    }

    const buffer = buffers[best];
    const row = buffer.rows.shift()!;
    buffer.cursor = bestCursor;

    if (buffer.rows.length === 0 && !buffer.exhausted) {
      await load(best, buffer);
    }

    if (await test(row)) {
      records.push(row);
    }
  }

  return {
    records: hasLimit ? records.slice(0, limit) : records,
    next: hasLimit && records.length > limit
  };
}
