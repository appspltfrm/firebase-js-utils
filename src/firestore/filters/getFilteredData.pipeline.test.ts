import assert from "node:assert/strict";
import {transliterate} from "transliteration";
import {Firestore} from "../Firestore.js";
import {buildPipelineWhere} from "./_buildPipelineWhere.js";
import {buildAdminJoinCondition, buildClientJoinCondition, getFilteredDataFromPipeline} from "./_getFilteredDataFromPipeline.js";
import {generateTextSearchTrigrams} from "./generateTextSearchTrigrams.js";
import {PipelineExpr} from "./_pipelineExpr.js";
import {getFilteredData} from "./getFilteredData.js";
import {Filter, FilterFieldType, FilterOperator} from "./specs.js";
import {splitTextSearchWords} from "./splitTextSearchWords.js";

/**
 * Isolated unit test for the Firestore pipeline filtering path. Uses a fake expression builder that produces a
 * serializable AST and a fake pipeline that records stages, so it runs without an Enterprise database.
 *
 * Run with: npx tsx src/firestore/filters/getFilteredData.pipeline.test.ts
 */

//#region Fake expression builder (serializable AST)

type Node = {ast: any} & Record<string, any>;

/** Unwraps a fake node to its AST; leaves literals/arrays untouched. */
function astOf(v: any): any {
  return v && typeof v === "object" && "ast" in v ? v.ast : v;
}

function node(ast: any): Node {
  return {
    ast,
    equal: (v: any) => node(["equal", ast, astOf(v)]),
    notEqual: (v: any) => node(["notEqual", ast, astOf(v)]),
    greaterThan: (v: any) => node(["gt", ast, astOf(v)]),
    greaterThanOrEqual: (v: any) => node(["gte", ast, astOf(v)]),
    lessThan: (v: any) => node(["lt", ast, astOf(v)]),
    lessThanOrEqual: (v: any) => node(["lte", ast, astOf(v)]),
    arrayContainsAny: (v: any) => node(["arrayContainsAny", ast, astOf(v)]),
    arrayContainsAll: (v: any) => node(["arrayContainsAll", ast, astOf(v)]),
    equalAny: (v: any) => node(["equalAny", ast, astOf(v)]),
    arrayLength: () => node(["arrayLength", ast]),
    toLower: () => node(["toLower", ast]),
    stringContains: (v: any) => node(["stringContains", ast, astOf(v)]),
    as: (name: string) => node(["as", ast, name])
  };
}

const fakeExpr: PipelineExpr = {
  field: (name: string) => node(["field", name]),
  constant: (value: any) => node(["constant", value]),
  and: (a: Node, b: Node, ...more: Node[]) => node(["and", a.ast, b.ast, ...more.map(m => m.ast)]),
  or: (a: Node, b: Node, ...more: Node[]) => node(["or", a.ast, b.ast, ...more.map(m => m.ast)]),
  not: (a: Node) => node(["not", a.ast]),
  ascending: (e: Node) => ["asc", e.ast],
  descending: (e: Node) => ["desc", e.ast]
};

/** Admin Pipelines namespace adds variable/countAll on top of the shared builders. */
const fakeAdminPipelines = {
  ...fakeExpr,
  variable: (name: string) => node(["var", name]),
  countAll: () => node(["countAll"])
};

/** Fake correlated sub-pipeline produced by `createFrom(join.query)`. */
class FakeSubPipeline {
  stages: any[] = [];
  where(condition: any) {
    this.stages.push(["where", astOf(condition)]); return this;
  }
  aggregate(acc: any) {
    this.stages.push(["aggregate", astOf(acc)]); return this;
  }
  toScalarExpression() {
    return node(["subquery", this.stages]);
  }
}

/** Fake admin join query whose `.firestore.pipeline().createFrom()` yields a FakeSubPipeline. */
const fakeJoinQuery = {firestore: {pipeline: () => ({createFrom: () => new FakeSubPipeline()})}};

function joinSpec() {
  return {query: fakeJoinQuery as any, dataField: "namesSearchable", resultField: "id", type: "in" as const};
}

//#endregion

//#region Helpers

function spec(type: FilterFieldType, extra: Partial<Filter.SpecRequired["spec"]> = {}): Filter.SpecRequired["spec"] {
  return {name: "f", type, operators: [], ...extra};
}

function filter(type: FilterFieldType, operator: FilterOperator, value: any, extra: Partial<Filter.SpecRequired["spec"]> = {}): Filter.SpecRequired {
  return {field: "f", operator, value, spec: spec(type, extra)};
}

function whereAst(filters: Filter.SpecRequired[]): any {
  const result = buildPipelineWhere(filters, fakeExpr, transliterate);
  return result === undefined ? undefined : result.ast;
}

const tests: Array<[string, () => void | Promise<void>]> = [];
function test(name: string, fn: () => void | Promise<void>) {
  tests.push([name, fn]);
}

//#endregion

//#region buildPipelineWhere — operator/type mapping

test("text equals -> field.equal", () => {
  assert.deepEqual(whereAst([filter(FilterFieldType.text, FilterOperator.equals, "Toronto")]), ["equal", ["field", "f"], "Toronto"]);
});

test("text includeChars -> arrayContainsAll(query trigrams)", () => {
  const trigrams = generateTextSearchTrigrams("ToRoN", "query", transliterate);
  assert.deepEqual(whereAst([filter(FilterFieldType.text, FilterOperator.includeChars, "ToRoN")]), ["arrayContainsAll", ["field", "f"], trigrams]);
});

test("text includeWord -> arrayContainsAll(words)", () => {
  const words = splitTextSearchWords("New York", transliterate);
  assert.deepEqual(whereAst([filter(FilterFieldType.text, FilterOperator.includeWord, "New York")]), ["arrayContainsAll", ["field", "f"], words]);
});

test("text search transliterates the query (Polish diacritics removed)", () => {
  // "Łódź" -> "lodz"; query-mode trigrams of "lodz" = ["lod","odz"] — no Polish characters reach the field.
  assert.deepEqual(whereAst([filter(FilterFieldType.text, FilterOperator.includeChars, "Łódź")]), ["arrayContainsAll", ["field", "f"], ["lod", "odz"]]);
  assert.deepEqual(whereAst([filter(FilterFieldType.text, FilterOperator.includeWord, "Gdańsk")]), ["arrayContainsAll", ["field", "f"], ["gdansk"]]);
});

test("text empty value -> no condition", () => {
  assert.equal(whereAst([filter(FilterFieldType.text, FilterOperator.equals, "")]), undefined);
});

test("textArray hasAnyOf -> arrayContainsAny", () => {
  assert.deepEqual(whereAst([filter(FilterFieldType.textArray, FilterOperator.hasAnyOf, ["a", "b"])]), ["arrayContainsAny", ["field", "f"], ["a", "b"]]);
});

test("textArray hasAll -> arrayContainsAll", () => {
  assert.deepEqual(whereAst([filter(FilterFieldType.textArray, FilterOperator.hasAll, ["a", "b"])]), ["arrayContainsAll", ["field", "f"], ["a", "b"]]);
});

test("textArray emptyArray -> arrayLength().equal(0)", () => {
  assert.deepEqual(whereAst([filter(FilterFieldType.textArray, FilterOperator.emptyArray, undefined)]), ["equal", ["arrayLength", ["field", "f"]], 0]);
});

test("number comparisons", () => {
  assert.deepEqual(whereAst([filter(FilterFieldType.number, FilterOperator.equals, 5)]), ["equal", ["field", "f"], 5]);
  assert.deepEqual(whereAst([filter(FilterFieldType.number, FilterOperator.greater, 5)]), ["gt", ["field", "f"], 5]);
  assert.deepEqual(whereAst([filter(FilterFieldType.number, FilterOperator.greaterOrEqual, 5)]), ["gte", ["field", "f"], 5]);
  assert.deepEqual(whereAst([filter(FilterFieldType.number, FilterOperator.less, 5)]), ["lt", ["field", "f"], 5]);
  assert.deepEqual(whereAst([filter(FilterFieldType.number, FilterOperator.lessOrEqual, 5)]), ["lte", ["field", "f"], 5]);
});

test("number with non-numeric value -> no condition", () => {
  assert.equal(whereAst([filter(FilterFieldType.number, FilterOperator.equals, "x" as any)]), undefined);
});

test("queryName overrides field name", () => {
  assert.deepEqual(whereAst([filter(FilterFieldType.number, FilterOperator.equals, 5, {queryName: "realField"})]), ["equal", ["field", "realField"], 5]);
});

test("multiple filters AND-combined", () => {
  assert.deepEqual(whereAst([
    filter(FilterFieldType.number, FilterOperator.greater, 1, {name: "a", queryName: "a"}),
    filter(FilterFieldType.text, FilterOperator.equals, "x", {name: "b", queryName: "b"})
  ]), ["and", ["gt", ["field", "a"], 1], ["equal", ["field", "b"], "x"]]);
});

//#endregion

//#region getFilteredDataFromPipeline — orchestration (single execute, next/slice, offset)

class FakePipeline {
  stages: any[] = [];
  executeCount = 0;
  constructor(private canned: any[]) {}
  where(condition: any) {
    this.stages.push(["where", condition]); return this;
  }
  define(binding: any) {
    this.stages.push(["define", binding]); return this;
  }
  sort(...orderings: any[]) {
    this.stages.push(["sort", orderings]); return this;
  }
  limit(n: number) {
    this.stages.push(["limit", n]); return this;
  }
  offset(n: number) {
    this.stages.push(["offset", n]); return this;
  }
  aggregate(acc: any) {
    this.stages.push(["aggregate", acc]); return this;
  }
  toScalarExpression() {
    return node(["subquery", this.stages.map((s: any) => s[0])]);
  }
  async execute() {
    this.executeCount++; return {results: this.canned.map(d => ({data: () => d}))};
  }
}

function withFakeAdmin<R>(fn: () => Promise<R>): Promise<R> {
  // Register the fake as the admin pipeline class so Pipeline.isInstance/isAdmin recognise it, and expose the
  // fake expression builders under the Pipelines namespace used by getPipelineExpr / admin native joins.
  Firestore.adminInit({Pipelines: {...fakeAdminPipelines, Pipeline: FakePipeline}} as any);
  return fn();
}

test("single execute, next + slice when more than limit", async () => {
  await withFakeAdmin(async () => {
    const pipeline = new FakePipeline([{id: 1}, {id: 2}, {id: 3}]); // limit 2 -> fetch 3 -> next
    const result = await getFilteredDataFromPipeline({
      pipeline: pipeline as any,
      transliterate,
      filters: [filter(FilterFieldType.number, FilterOperator.greater, 0, {queryName: "n"})],
      limit: 2
    });
    assert.equal(pipeline.executeCount, 1, "must execute exactly once");
    assert.equal(result.next, true);
    assert.deepEqual(result.records, [{id: 1}, {id: 2}]);
    assert.deepEqual(pipeline.stages.map(s => s[0]), ["where", "limit"]);
    assert.deepEqual(pipeline.stages[0][1].ast, ["gt", ["field", "n"], 0]);
    assert.deepEqual(pipeline.stages[1], ["limit", 3]);
  });
});

test("no next when fetched <= limit", async () => {
  await withFakeAdmin(async () => {
    const pipeline = new FakePipeline([{id: 1}]);
    const result = await getFilteredDataFromPipeline({
      pipeline: pipeline as any,
      transliterate,
      filters: [filter(FilterFieldType.number, FilterOperator.greater, 0, {queryName: "n"})],
      limit: 2
    });
    assert.equal(result.next, false);
    assert.deepEqual(result.records, [{id: 1}]);
  });
});

test("queryOffset applies offset stage in order where -> sort -> offset -> limit", async () => {
  await withFakeAdmin(async () => {
    const pipeline = new FakePipeline([]);
    await getFilteredDataFromPipeline({
      pipeline: pipeline as any,
      transliterate,
      filters: [filter(FilterFieldType.number, FilterOperator.greater, 0, {queryName: "n"})],
      querySort: [["sortingIndex"], ["createdAt", "desc"]],
      queryOffset: 40,
      limit: 10
    });
    assert.deepEqual(pipeline.stages.map(s => s[0]), ["where", "sort", "offset", "limit"]);
    assert.deepEqual(pipeline.stages[0][1].ast, ["gt", ["field", "n"], 0]);
    assert.deepEqual(pipeline.stages[1][1], [["asc", ["field", "sortingIndex"]], ["desc", ["field", "createdAt"]]]);
    assert.deepEqual(pipeline.stages[2], ["offset", 40]);
    assert.deepEqual(pipeline.stages[3], ["limit", 11]);
  });
});

test("no offset stage when queryOffset is 0 or omitted", async () => {
  await withFakeAdmin(async () => {
    const pipeline = new FakePipeline([]);
    await getFilteredDataFromPipeline({
      pipeline: pipeline as any,
      transliterate,
      filters: [],
      querySort: [["sortingIndex"]],
      limit: 10
    });
    assert.equal(pipeline.stages.some(s => s[0] === "offset"), false);
  });
});

test("client join: equalAny over resolved values (single chunk)", () => {
  const f = filter(FilterFieldType.text, FilterOperator.includeChars, "x", {name: "person", queryName: "personId", join: joinSpec()});
  const cond = buildClientJoinCondition(f, ["a", "b", "c"], fakeExpr);
  assert.deepEqual(cond.ast, ["equalAny", ["field", "personId"], ["a", "b", "c"]]);
});

test("client join: >30 values -> OR of equalAny chunks", () => {
  const values = Array.from({length: 65}, (_, i) => `id${i}`);
  const f = filter(FilterFieldType.text, FilterOperator.includeChars, "x", {name: "person", queryName: "personId", join: joinSpec()});
  const cond = buildClientJoinCondition(f, values, fakeExpr);
  assert.equal(cond.ast[0], "or");
  assert.equal(cond.ast.length, 1 + 3); // or + chunks of 30/30/5
  assert.deepEqual(cond.ast[1], ["equalAny", ["field", "personId"], values.slice(0, 30)]);
  assert.deepEqual(cond.ast[2], ["equalAny", ["field", "personId"], values.slice(30, 60)]);
  assert.deepEqual(cond.ast[3], ["equalAny", ["field", "personId"], values.slice(60, 65)]);
});

test("client join: empty values -> equalAny([]) (matches nothing)", () => {
  const f = filter(FilterFieldType.text, FilterOperator.includeChars, "x", {name: "person", queryName: "personId", join: joinSpec()});
  const cond = buildClientJoinCondition(f, [], fakeExpr);
  assert.deepEqual(cond.ast, ["equalAny", ["field", "personId"], []]);
});

test("admin join: native correlated-existence subquery + define", async () => {
  await withFakeAdmin(async () => {
    const f = filter(FilterFieldType.text, FilterOperator.includeChars, "John", {name: "person", queryName: "personId", join: joinSpec()});
    const {define, condition} = buildAdminJoinCondition(f, fakeExpr, transliterate);
    const trigrams = generateTextSearchTrigrams("John", "query", transliterate);
    assert.deepEqual(define.ast, ["as", ["field", "personId"], "__join_person"]);
    assert.deepEqual(condition.ast, [
      "gt",
      ["subquery", [
        ["where", ["arrayContainsAll", ["field", "namesSearchable"], trigrams]],
        ["where", ["equal", ["field", "id"], ["var", "__join_person"]]],
        ["aggregate", ["as", ["countAll"], "c"]]
      ]],
      0
    ]);
  });
});

test("admin join: pipeline join.query is used directly (not createFrom)", async () => {
  await withFakeAdmin(async () => {
    // A FakePipeline instance is recognised by Pipeline.isInstance and has no `.firestore`, so any attempt to
    // call `.createFrom()` would throw — passing means the join pipeline was embedded directly as the subquery.
    const joinPipeline = new FakePipeline([]);
    const join = {query: joinPipeline as any, dataField: "namesSearchable", resultField: "id", type: "in" as const};
    const f = filter(FilterFieldType.text, FilterOperator.includeChars, "John", {name: "person", queryName: "personId", join});
    const {condition} = buildAdminJoinCondition(f, fakeExpr, transliterate);
    assert.deepEqual(joinPipeline.stages.map(s => s[0]), ["where", "where", "aggregate"]);
    assert.deepEqual(condition.ast, ["gt", ["subquery", ["where", "where", "aggregate"]], 0]);
  });
});

test("admin join via helper: define stage prepended before where", async () => {
  await withFakeAdmin(async () => {
    const pipeline = new FakePipeline([]);
    await getFilteredDataFromPipeline({
      pipeline: pipeline as any,
      transliterate,
      filters: [filter(FilterFieldType.text, FilterOperator.includeChars, "John", {name: "person", queryName: "personId", join: joinSpec()})],
      limit: 10
    });
    assert.deepEqual(pipeline.stages.map(s => s[0]), ["define", "where", "limit"]);
    assert.deepEqual(pipeline.stages[0][1].ast, ["as", ["field", "personId"], "__join_person"]);
    assert.equal(pipeline.stages[1][1].ast[0], "gt"); // subquery existence condition
  });
});

test("queryOffset without querySort throws", async () => {
  await withFakeAdmin(async () => {
    const pipeline = new FakePipeline([]);
    await assert.rejects(() => getFilteredDataFromPipeline({
      pipeline: pipeline as any,
      transliterate,
      filters: [],
      queryOffset: 20,
      limit: 10
    }), /requires querySort/);
  });
});

test("getFilteredData: allData + pipeline filters in memory without executing the pipeline", async () => {
  await withFakeAdmin(async () => {
    const pipeline = new FakePipeline([]);
    const result = await getFilteredData({
      query: pipeline as any,
      allData: [{f: 1}, {f: 2}, {f: 0}, {f: 3}],
      filters: [filter(FilterFieldType.number, FilterOperator.greater, 0)],
      limit: 10
    });
    assert.equal(pipeline.executeCount, 0, "must not execute the server pipeline");
    assert.deepEqual(result.records, [{f: 1}, {f: 2}, {f: 3}]);
    assert.equal(result.next, false);
  });
});

test("getFilteredData: allData + pipeline applies queryOffset with next/slice", async () => {
  await withFakeAdmin(async () => {
    const pipeline = new FakePipeline([]);
    const result = await getFilteredData({
      query: pipeline as any,
      allData: [{f: 1}, {f: 2}, {f: 3}, {f: 4}], // all match > 0
      filters: [filter(FilterFieldType.number, FilterOperator.greater, 0)],
      queryOffset: 1, // skip first match (f:1)
      limit: 2
    });
    assert.equal(pipeline.executeCount, 0);
    assert.deepEqual(result.records, [{f: 2}, {f: 3}]);
    assert.equal(result.next, true);
  });
});

//#endregion

//#region Runner

(async () => {
  let failed = 0;
  for (const [name, fn] of tests) {
    try {
      await fn();
       
      console.log(`  ✓ ${name}`);
    } catch (error) {
      failed++;
       
      console.error(`  ✗ ${name}\n    ${(error as Error).message}`);
    }
  }
   
  console.log(`\n${tests.length - failed}/${tests.length} passed`);
  if (failed > 0) {
    process.exit(1);
  }
})();

//#endregion
