import assert from "node:assert/strict";
import {compareCursorValues} from "./_compareCursorValues.js";
import {mergeChunkedQueries} from "./_mergeChunkedQueries.js";

/**
 * Isolated unit test of the chunk merge behind the classic (non-pipeline) server path — the part that reads a
 * page from the `in` chunk queries of a join with more than 30 matches. Fake fetchers serve sorted in-memory
 * arrays, so this runs without a database.
 *
 * Run with: npx tsx src/firestore/filters/getFilteredData.merge.test.ts
 */

const tests: Array<[string, () => void | Promise<void>]> = [];
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  tests.push([name, fn]);
}

type Row = {id: string, name: string, chunk: number};

/** 80 rows with interleaved names, split into chunks of 30/30/20 the way the join splits person ids. */
function makeChunks(direction: "asc" | "desc"): Row[][] {
  const rows: Row[] = Array.from({length: 80}, (_, i) => ({id: `p${i}`, name: `name-${String(i).padStart(3, "0")}`, chunk: i % 3}));
  const chunks = [rows.filter(r => r.chunk === 0), rows.filter(r => r.chunk === 1), rows.filter(r => r.chunk === 2)];
  const sign = direction === "asc" ? 1 : -1;
  return chunks.map(chunk => chunk.sort((a, b) => sign * a.name.localeCompare(b.name)));
}

/** Emulates one chunk query: value cursor `startAfter`, optional limit. */
function fakeFetch(chunks: Row[][], direction: "asc" | "desc", calls?: number[]) {
  return async (chunk: number, startAfter: any[] | undefined, limit: number) => {
    calls?.push(chunk);
    let rows = chunks[chunk];
    if (startAfter?.length) {
      rows = rows.filter(r => compareCursorValues([r.name], startAfter, [direction]) > 0);
    }
    return limit > 0 ? rows.slice(0, limit) : rows;
  };
}

async function page(chunks: Row[][], direction: "asc" | "desc", limit: number, startAfter?: any[], reject?: (row: Row) => boolean, calls?: number[]) {
  return mergeChunkedQueries<Row>({
    chunks: chunks.length,
    fetch: fakeFetch(chunks, direction, calls),
    getStartAfter: row => [row.name],
    compare: (a, b) => compareCursorValues(a, b, [direction]),
    test: async row => !reject?.(row),
    startAfter,
    limit
  });
}

function expectSorted(rows: Row[], direction: "asc" | "desc") {
  for (let i = 1; i < rows.length; i++) {
    const c = rows[i - 1].name.localeCompare(rows[i].name);
    assert.ok(direction === "asc" ? c < 0 : c > 0, `rows out of order at ${i}: ${rows[i - 1].name} / ${rows[i].name}`);
  }
}

//#region mergeChunkedQueries

for (const direction of ["asc", "desc"] as const) {

  test(`${direction}: one page larger than every chunk returns all 80 rows in order`, async () => {
    const result = await page(makeChunks(direction), direction, 120);
    assert.equal(result.records.length, 80);
    assert.equal(result.next, false);
    expectSorted(result.records, direction);
  });

  test(`${direction}: pagination by the last record covers every row once`, async () => {
    const chunks = makeChunks(direction);
    const seen: Row[] = [];
    let startAfter: any[] | undefined;
    let pages = 0;
    for (;;) {
      const result = await page(chunks, direction, 25, startAfter);
      pages++;
      seen.push(...result.records);
      if (!result.next) {
        break;
      }
      assert.equal(result.records.length, 25);
      startAfter = [result.records[result.records.length - 1].name];
    }
    assert.equal(pages, 4);
    assert.equal(seen.length, 80);
    assert.equal(new Set(seen.map(r => r.id)).size, 80);
    expectSorted(seen, direction);
  });

  test(`${direction}: a rejecting post-filter refills exhausted buffers until the page is full`, async () => {
    const chunks = makeChunks(direction);
    // Reject every row of chunk 0: the page must still fill from the other two chunks.
    const result = await page(chunks, direction, 20, undefined, row => row.chunk === 0);
    assert.equal(result.records.length, 20);
    assert.equal(result.next, true);
    assert.ok(result.records.every(r => r.chunk !== 0));
    expectSorted(result.records, direction);
  });
}

test("small page size refetches a chunk from its own cursor", async () => {
  const chunks = makeChunks("asc");
  const calls: number[] = [];
  const result = await page(chunks, "asc", 5, undefined, undefined, calls);
  assert.equal(result.records.length, 5);
  assert.equal(result.next, true);
  assert.deepEqual(result.records.map(r => r.name), ["name-000", "name-001", "name-002", "name-003", "name-004"]);
  // Every chunk is loaded once up front; none of them ran dry within 5 rows.
  assert.deepEqual(calls.sort(), [0, 1, 2]);
});

test("a chunk running dry mid-page is fetched again after its last consumed row", async () => {
  const chunks = makeChunks("asc");
  const calls: number[] = [];
  // A page of 10 fetches 11 rows per chunk; rejecting the first 60 names forces every buffer to drain and
  // refill several times before the page is full.
  const result = await page(chunks, "asc", 10, undefined, row => row.name < "name-060", calls);
  assert.equal(result.records.length, 10);
  assert.equal(result.next, true);
  assert.deepEqual(result.records.map(r => r.name), Array.from({length: 10}, (_, i) => `name-0${60 + i}`));
  assert.ok(calls.length > 3, "expected at least one refetch");
});

test("limit <= 0 returns every row merged", async () => {
  const result = await page(makeChunks("desc"), "desc", -1);
  assert.equal(result.records.length, 80);
  assert.equal(result.next, false);
  expectSorted(result.records, "desc");
});

test("a single chunk behaves like a plain paginated query", async () => {
  const [only] = [makeChunks("asc").flat().sort((a, b) => a.name.localeCompare(b.name))];
  const first = await page([only], "asc", 30);
  assert.equal(first.records.length, 30);
  assert.equal(first.next, true);
  const second = await page([only], "asc", 30, [first.records[29].name]);
  assert.equal(second.records.length, 30);
  const third = await page([only], "asc", 30, [second.records[29].name]);
  assert.equal(third.records.length, 20);
  assert.equal(third.next, false);
});

test("empty chunks yield an empty page", async () => {
  const result = await page([[], [], []], "asc", 10);
  assert.deepEqual(result, {records: [], next: false});
});

//#endregion

//#region compareCursorValues

test("compares strings, numbers and booleans naturally", () => {
  assert.ok(compareCursorValues(["a"], ["b"]) < 0);
  assert.ok(compareCursorValues(["b"], ["a"]) > 0);
  assert.equal(compareCursorValues(["a"], ["a"]), 0);
  assert.ok(compareCursorValues([2], [10]) < 0);
  assert.ok(compareCursorValues([false], [true]) < 0);
});

test("desc reverses the order per position", () => {
  assert.ok(compareCursorValues(["a"], ["b"], ["desc"]) > 0);
  assert.ok(compareCursorValues(["x", 1], ["x", 2], ["asc", "desc"]) > 0);
  assert.ok(compareCursorValues(["x", 1], ["y", 2], ["asc", "desc"]) < 0);
});

test("orders timestamp-like values by millis then nanos", () => {
  const ts = (millis: number, nanos = 0) => ({toMillis: () => millis, nanoseconds: nanos});
  assert.ok(compareCursorValues([ts(1000)], [ts(2000)]) < 0);
  assert.ok(compareCursorValues([ts(1000, 500)], [ts(1000, 200)]) > 0);
  assert.equal(compareCursorValues([ts(1000)], [ts(1000)]), 0);
});

test("follows the Firestore type order: null < boolean < number < timestamp < string", () => {
  const ts = {toMillis: () => 0, nanoseconds: 0};
  assert.ok(compareCursorValues([null], [false]) < 0);
  assert.ok(compareCursorValues([true], [0]) < 0);
  assert.ok(compareCursorValues([5], [ts]) < 0);
  assert.ok(compareCursorValues([ts], [""]) < 0);
  assert.ok(compareCursorValues([undefined], ["a"]) < 0);
});

//#endregion

for (const [name, fn] of tests) {
  try {
    await fn();
    console.log(`  ok   ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL ${name}`);
    console.log(`       ${(e as Error).message}`);
  }
}

console.log(failed ? `\n${failed} test(s) failed` : `\nAll ${tests.length} tests passed`);
process.exit(failed ? 1 : 0);
