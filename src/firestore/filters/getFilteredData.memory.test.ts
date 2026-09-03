import assert from "node:assert/strict";
import {transliterate} from "transliteration";
import {getFilteredData} from "./getFilteredData.js";
import {Filter, FilterFieldSpec, FilterFieldType, FilterOperator} from "./specs.js";

/**
 * Isolated unit test for the in-memory branch of the classic (non-pipeline) filtering path — the one the
 * persons list uses for small projects, and the one that verifies the records a join sub-query returns.
 * `allData` short-circuits every server call, so this runs without a database.
 *
 * Run with: npx tsx src/firestore/filters/getFilteredData.memory.test.ts
 */

const results: string[] = [];
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  tests.push([name, fn]);
}

const tests: Array<[string, () => void | Promise<void>]> = [];

function filter(spec: FilterFieldSpec, operator: FilterOperator, value?: any): Filter.SpecRequired {
  return {field: spec.name, spec, operator, value};
}

async function run(allData: any[], filters: Filter.SpecRequired[]) {
  return (await getFilteredData({
    allData,
    // never touched on the `allData` path, but the signature requires a query
    query: {} as any,
    limit: -1,
    getStartAfter: () => [],
    transliterate,
    filters
  })).records;
}

//#region Specs

/** A yes/no person attribute: the stored value is a boolean, compared exactly. */
const yesNo: FilterFieldSpec = {
  name: "yesNo",
  dataName: "value",
  type: FilterFieldType.text,
  operators: [FilterOperator.equals],
  filterValue: ({value}) => value === true || value === "true"
};

const text: FilterFieldSpec = {
  name: "text",
  dataName: "value",
  type: FilterFieldType.text,
  operators: [FilterOperator.equals, FilterOperator.includeChars, FilterOperator.includeWord]
};

const numeric: FilterFieldSpec = {
  name: "numeric",
  dataName: "value",
  type: FilterFieldType.number,
  operators: [FilterOperator.equals, FilterOperator.greater],
  filterValue: ({value}) => {
    const num = Number(value);
    return value === undefined || value === null || value === "" || Number.isNaN(num) ? undefined : num;
  }
};

/** A list person attribute: the stored value is an array of value ids. */
const list: FilterFieldSpec = {
  name: "list",
  dataName: "value",
  type: FilterFieldType.textArray,
  operators: [FilterOperator.hasAnyOf, FilterOperator.hasAll],
  filterValue: ({value}) => value === undefined || value === null || value === ""
    ? undefined
    : (Array.isArray(value) ? value : [value])
};

//#endregion

test("text equals matches a false value", async () => {
  const data = [{personId: "a", value: true}, {personId: "b", value: false}];
  assert.deepEqual((await run(data, [filter(yesNo, FilterOperator.equals, "false")])).map(r => r.personId), ["b"]);
});

test("text equals matches a true value", async () => {
  const data = [{personId: "a", value: true}, {personId: "b", value: false}];
  assert.deepEqual((await run(data, [filter(yesNo, FilterOperator.equals, "true")])).map(r => r.personId), ["a"]);
});

test("text equals with an empty value matches nothing", async () => {
  const data = [{personId: "a", value: ""}, {personId: "b", value: "x"}];
  assert.deepEqual(await run(data, [filter(text, FilterOperator.equals, "")]), []);
});

test("text equals compares exactly", async () => {
  const data = [{personId: "a", value: "Warszawa"}, {personId: "b", value: "Warsaw"}];
  assert.deepEqual((await run(data, [filter(text, FilterOperator.equals, "Warszawa")])).map(r => r.personId), ["a"]);
});

test("text includeChars still matches a substring", async () => {
  const data = [{personId: "a", value: ["war", "ars", "rsz"]}, {personId: "b", value: ["kra", "rak"]}];
  assert.deepEqual((await run(data, [filter(text, FilterOperator.includeChars, "war")])).map(r => r.personId), ["a"]);
});

test("number equals matches, non-numeric matches nothing", async () => {
  const data = [{personId: "a", value: 3}, {personId: "b", value: 7}];
  assert.deepEqual((await run(data, [filter(numeric, FilterOperator.equals, "7")])).map(r => r.personId), ["b"]);
  assert.deepEqual(await run(data, [filter(numeric, FilterOperator.equals, "abc")]), []);
});

test("number greater compares numerically", async () => {
  const data = [{personId: "a", value: 3}, {personId: "b", value: 7}];
  assert.deepEqual((await run(data, [filter(numeric, FilterOperator.greater, "5")])).map(r => r.personId), ["b"]);
});

test("textArray hasAnyOf and hasAll", async () => {
  const data = [{personId: "a", value: ["x", "y"]}, {personId: "b", value: ["y"]}];
  assert.deepEqual((await run(data, [filter(list, FilterOperator.hasAnyOf, ["x", "z"])])).map(r => r.personId), ["a"]);
  assert.deepEqual((await run(data, [filter(list, FilterOperator.hasAll, ["x", "y"])])).map(r => r.personId), ["a"]);
  assert.deepEqual((await run(data, [filter(list, FilterOperator.hasAnyOf, ["y"])])).map(r => r.personId), ["a", "b"]);
});

test("textArray normalises a scalar value to an array", async () => {
  const data = [{personId: "a", value: ["x", "y"]}, {personId: "b", value: ["z"]}];
  // A filter restored from a URL written before the picker returned arrays still carries a scalar.
  assert.deepEqual((await run(data, [filter(list, FilterOperator.hasAnyOf, "x")])).map(r => r.personId),
    (await run(data, [filter(list, FilterOperator.hasAnyOf, ["x"])])).map(r => r.personId));
  assert.deepEqual((await run(data, [filter(list, FilterOperator.hasAnyOf, "x")])).map(r => r.personId), ["a"]);
});

test("textArray with an empty value matches nothing", async () => {
  const data = [{personId: "a", value: ["x"]}];
  assert.deepEqual(await run(data, [filter(list, FilterOperator.hasAnyOf, "")]), []);
  assert.deepEqual(await run(data, [filter(list, FilterOperator.hasAnyOf, [])]), []);
});

for (const [name, fn] of tests) {
  try {
    await fn();
    results.push(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    results.push(`  ✗ ${name}\n    ${(e as Error).message}`);
  }
}

console.log(results.join("\n"));
console.log(`\n${tests.length - failed}/${tests.length} passed`);

if (failed) {
  process.exitCode = 1;
}
