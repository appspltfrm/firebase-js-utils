/**
 * Reads one page from several chunk queries (e.g. the `in` chunks of a join) as if they were a single ordered
 * query: the sorted streams are merged by cursor, each chunk paginating independently. A single chunk
 * degenerates to plain "fetch, post-filter, fetch more until the page is full".
 *
 * The returned page holds the globally first records, so its last record is a valid `startAfter` for every
 * chunk on the next page — the caller needs no per-chunk state between pages.
 */
export async function mergeChunkedQueries(args) {
    const { chunks, fetch, getStartAfter, compare, test, startAfter, limit } = args;
    const hasLimit = limit > 0;
    const fetchLimit = hasLimit ? limit + 1 : -1;
    const load = async (chunk, buffer) => {
        buffer.rows = await fetch(chunk, buffer.cursor ?? startAfter, fetchLimit);
        buffer.exhausted = !hasLimit || buffer.rows.length < fetchLimit;
    };
    const buffers = Array.from({ length: chunks }, () => ({ rows: [], cursor: undefined, exhausted: false }));
    await Promise.all(buffers.map((buffer, chunk) => load(chunk, buffer)));
    const records = [];
    while (!hasLimit || records.length <= limit) {
        let best = -1;
        let bestCursor;
        for (let i = 0; i < buffers.length; i++) {
            const head = buffers[i].rows[0];
            if (head === undefined) {
                continue;
            }
            const cursor = getStartAfter(head);
            if (best < 0 || compare(cursor, bestCursor) < 0) {
                best = i;
                bestCursor = cursor;
            }
        }
        if (best < 0) {
            break;
        }
        const buffer = buffers[best];
        const row = buffer.rows.shift();
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
//# sourceMappingURL=_mergeChunkedQueries.js.map