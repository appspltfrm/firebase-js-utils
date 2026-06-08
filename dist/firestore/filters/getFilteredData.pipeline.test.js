import assert from "node:assert/strict";
import { transliterate } from "transliteration";
import { Firestore } from "../Firestore.js";
import { buildPipelineWhere } from "./_buildPipelineWhere.js";
import { buildAdminJoinCondition, buildClientJoinCondition, getFilteredDataFromPipeline } from "./_getFilteredDataFromPipeline.js";
import { generateTextSearchTrigrams } from "./generateTextSearchTrigrams.js";
import { getFilteredData } from "./getFilteredData.js";
import { FilterFieldType, FilterOperator } from "./specs.js";
import { splitTextSearchWords } from "./splitTextSearchWords.js";
/** Unwraps a fake node to its AST; leaves literals/arrays untouched. */
function astOf(v) {
    return v && typeof v === "object" && "ast" in v ? v.ast : v;
}
function node(ast) {
    return {
        ast,
        equal: (v) => node(["equal", ast, astOf(v)]),
        notEqual: (v) => node(["notEqual", ast, astOf(v)]),
        greaterThan: (v) => node(["gt", ast, astOf(v)]),
        greaterThanOrEqual: (v) => node(["gte", ast, astOf(v)]),
        lessThan: (v) => node(["lt", ast, astOf(v)]),
        lessThanOrEqual: (v) => node(["lte", ast, astOf(v)]),
        arrayContainsAny: (v) => node(["arrayContainsAny", ast, astOf(v)]),
        arrayContainsAll: (v) => node(["arrayContainsAll", ast, astOf(v)]),
        equalAny: (v) => node(["equalAny", ast, astOf(v)]),
        arrayLength: () => node(["arrayLength", ast]),
        toLower: () => node(["toLower", ast]),
        stringContains: (v) => node(["stringContains", ast, astOf(v)]),
        as: (name) => node(["as", ast, name])
    };
}
const fakeExpr = {
    field: (name) => node(["field", name]),
    constant: (value) => node(["constant", value]),
    and: (a, b, ...more) => node(["and", a.ast, b.ast, ...more.map(m => m.ast)]),
    or: (a, b, ...more) => node(["or", a.ast, b.ast, ...more.map(m => m.ast)]),
    not: (a) => node(["not", a.ast]),
    ascending: (e) => ["asc", e.ast],
    descending: (e) => ["desc", e.ast]
};
/** Admin Pipelines namespace adds variable/countAll on top of the shared builders. */
const fakeAdminPipelines = {
    ...fakeExpr,
    variable: (name) => node(["var", name]),
    countAll: () => node(["countAll"])
};
/** Fake correlated sub-pipeline produced by `createFrom(join.query)`. */
class FakeSubPipeline {
    stages = [];
    where(condition) {
        this.stages.push(["where", astOf(condition)]);
        return this;
    }
    aggregate(acc) {
        this.stages.push(["aggregate", astOf(acc)]);
        return this;
    }
    toScalarExpression() {
        return node(["subquery", this.stages]);
    }
}
/** Fake admin join query whose `.firestore.pipeline().createFrom()` yields a FakeSubPipeline. */
const fakeJoinQuery = { firestore: { pipeline: () => ({ createFrom: () => new FakeSubPipeline() }) } };
function joinSpec() {
    return { query: fakeJoinQuery, dataField: "namesSearchable", resultField: "id", type: "in" };
}
//#endregion
//#region Helpers
function spec(type, extra = {}) {
    return { name: "f", type, operators: [], ...extra };
}
function filter(type, operator, value, extra = {}) {
    return { field: "f", operator, value, spec: spec(type, extra) };
}
function whereAst(filters) {
    const result = buildPipelineWhere(filters, fakeExpr, transliterate);
    return result === undefined ? undefined : result.ast;
}
const tests = [];
function test(name, fn) {
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
    assert.equal(whereAst([filter(FilterFieldType.number, FilterOperator.equals, "x")]), undefined);
});
test("queryName overrides field name", () => {
    assert.deepEqual(whereAst([filter(FilterFieldType.number, FilterOperator.equals, 5, { queryName: "realField" })]), ["equal", ["field", "realField"], 5]);
});
test("multiple filters AND-combined", () => {
    assert.deepEqual(whereAst([
        filter(FilterFieldType.number, FilterOperator.greater, 1, { name: "a", queryName: "a" }),
        filter(FilterFieldType.text, FilterOperator.equals, "x", { name: "b", queryName: "b" })
    ]), ["and", ["gt", ["field", "a"], 1], ["equal", ["field", "b"], "x"]]);
});
//#endregion
//#region getFilteredDataFromPipeline — orchestration (single execute, next/slice, offset)
class FakePipeline {
    canned;
    stages = [];
    executeCount = 0;
    constructor(canned) {
        this.canned = canned;
    }
    where(condition) {
        this.stages.push(["where", condition]);
        return this;
    }
    define(binding) {
        this.stages.push(["define", binding]);
        return this;
    }
    sort(...orderings) {
        this.stages.push(["sort", orderings]);
        return this;
    }
    limit(n) {
        this.stages.push(["limit", n]);
        return this;
    }
    offset(n) {
        this.stages.push(["offset", n]);
        return this;
    }
    aggregate(acc) {
        this.stages.push(["aggregate", acc]);
        return this;
    }
    toScalarExpression() {
        return node(["subquery", this.stages.map((s) => s[0])]);
    }
    async execute() {
        this.executeCount++;
        return { results: this.canned.map(d => ({ data: () => d })) };
    }
}
function withFakeAdmin(fn) {
    // Register the fake as the admin pipeline class so Pipeline.isInstance/isAdmin recognise it, and expose the
    // fake expression builders under the Pipelines namespace used by getPipelineExpr / admin native joins.
    Firestore.adminInit({ Pipelines: { ...fakeAdminPipelines, Pipeline: FakePipeline } });
    return fn();
}
test("single execute, next + slice when more than limit", async () => {
    await withFakeAdmin(async () => {
        const pipeline = new FakePipeline([{ id: 1 }, { id: 2 }, { id: 3 }]); // limit 2 -> fetch 3 -> next
        const result = await getFilteredDataFromPipeline({
            pipeline: pipeline,
            transliterate,
            filters: [filter(FilterFieldType.number, FilterOperator.greater, 0, { queryName: "n" })],
            limit: 2
        });
        assert.equal(pipeline.executeCount, 1, "must execute exactly once");
        assert.equal(result.next, true);
        assert.deepEqual(result.records, [{ id: 1 }, { id: 2 }]);
        assert.deepEqual(pipeline.stages.map(s => s[0]), ["where", "limit"]);
        assert.deepEqual(pipeline.stages[0][1].ast, ["gt", ["field", "n"], 0]);
        assert.deepEqual(pipeline.stages[1], ["limit", 3]);
    });
});
test("no next when fetched <= limit", async () => {
    await withFakeAdmin(async () => {
        const pipeline = new FakePipeline([{ id: 1 }]);
        const result = await getFilteredDataFromPipeline({
            pipeline: pipeline,
            transliterate,
            filters: [filter(FilterFieldType.number, FilterOperator.greater, 0, { queryName: "n" })],
            limit: 2
        });
        assert.equal(result.next, false);
        assert.deepEqual(result.records, [{ id: 1 }]);
    });
});
test("queryOffset applies offset stage in order where -> sort -> offset -> limit", async () => {
    await withFakeAdmin(async () => {
        const pipeline = new FakePipeline([]);
        await getFilteredDataFromPipeline({
            pipeline: pipeline,
            transliterate,
            filters: [filter(FilterFieldType.number, FilterOperator.greater, 0, { queryName: "n" })],
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
            pipeline: pipeline,
            transliterate,
            filters: [],
            querySort: [["sortingIndex"]],
            limit: 10
        });
        assert.equal(pipeline.stages.some(s => s[0] === "offset"), false);
    });
});
test("client join: equalAny over resolved values (single chunk)", () => {
    const f = filter(FilterFieldType.text, FilterOperator.includeChars, "x", { name: "person", queryName: "personId", join: joinSpec() });
    const cond = buildClientJoinCondition(f, ["a", "b", "c"], fakeExpr);
    assert.deepEqual(cond.ast, ["equalAny", ["field", "personId"], ["a", "b", "c"]]);
});
test("client join: >30 values -> OR of equalAny chunks", () => {
    const values = Array.from({ length: 65 }, (_, i) => `id${i}`);
    const f = filter(FilterFieldType.text, FilterOperator.includeChars, "x", { name: "person", queryName: "personId", join: joinSpec() });
    const cond = buildClientJoinCondition(f, values, fakeExpr);
    assert.equal(cond.ast[0], "or");
    assert.equal(cond.ast.length, 1 + 3); // or + chunks of 30/30/5
    assert.deepEqual(cond.ast[1], ["equalAny", ["field", "personId"], values.slice(0, 30)]);
    assert.deepEqual(cond.ast[2], ["equalAny", ["field", "personId"], values.slice(30, 60)]);
    assert.deepEqual(cond.ast[3], ["equalAny", ["field", "personId"], values.slice(60, 65)]);
});
test("client join: empty values -> equalAny([]) (matches nothing)", () => {
    const f = filter(FilterFieldType.text, FilterOperator.includeChars, "x", { name: "person", queryName: "personId", join: joinSpec() });
    const cond = buildClientJoinCondition(f, [], fakeExpr);
    assert.deepEqual(cond.ast, ["equalAny", ["field", "personId"], []]);
});
test("admin join: native correlated-existence subquery + define", async () => {
    await withFakeAdmin(async () => {
        const f = filter(FilterFieldType.text, FilterOperator.includeChars, "John", { name: "person", queryName: "personId", join: joinSpec() });
        const { define, condition } = buildAdminJoinCondition(f, fakeExpr, transliterate);
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
        const join = { query: joinPipeline, dataField: "namesSearchable", resultField: "id", type: "in" };
        const f = filter(FilterFieldType.text, FilterOperator.includeChars, "John", { name: "person", queryName: "personId", join });
        const { condition } = buildAdminJoinCondition(f, fakeExpr, transliterate);
        assert.deepEqual(joinPipeline.stages.map(s => s[0]), ["where", "where", "aggregate"]);
        assert.deepEqual(condition.ast, ["gt", ["subquery", ["where", "where", "aggregate"]], 0]);
    });
});
test("admin join via helper: define stage prepended before where", async () => {
    await withFakeAdmin(async () => {
        const pipeline = new FakePipeline([]);
        await getFilteredDataFromPipeline({
            pipeline: pipeline,
            transliterate,
            filters: [filter(FilterFieldType.text, FilterOperator.includeChars, "John", { name: "person", queryName: "personId", join: joinSpec() })],
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
            pipeline: pipeline,
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
            query: pipeline,
            allData: [{ f: 1 }, { f: 2 }, { f: 0 }, { f: 3 }],
            filters: [filter(FilterFieldType.number, FilterOperator.greater, 0)],
            limit: 10
        });
        assert.equal(pipeline.executeCount, 0, "must not execute the server pipeline");
        assert.deepEqual(result.records, [{ f: 1 }, { f: 2 }, { f: 3 }]);
        assert.equal(result.next, false);
    });
});
test("getFilteredData: allData + pipeline applies queryOffset with next/slice", async () => {
    await withFakeAdmin(async () => {
        const pipeline = new FakePipeline([]);
        const result = await getFilteredData({
            query: pipeline,
            allData: [{ f: 1 }, { f: 2 }, { f: 3 }, { f: 4 }], // all match > 0
            filters: [filter(FilterFieldType.number, FilterOperator.greater, 0)],
            queryOffset: 1, // skip first match (f:1)
            limit: 2
        });
        assert.equal(pipeline.executeCount, 0);
        assert.deepEqual(result.records, [{ f: 2 }, { f: 3 }]);
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
        }
        catch (error) {
            failed++;
            console.error(`  ✗ ${name}\n    ${error.message}`);
        }
    }
    console.log(`\n${tests.length - failed}/${tests.length} passed`);
    if (failed > 0) {
        process.exit(1);
    }
})();
//#endregion
//# sourceMappingURL=getFilteredData.pipeline.test.js.map