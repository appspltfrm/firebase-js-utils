export var FilterOperator;
(function (FilterOperator) {
    FilterOperator[FilterOperator["includeChars"] = 1] = "includeChars";
    FilterOperator[FilterOperator["includeWord"] = 2] = "includeWord";
    FilterOperator[FilterOperator["hasAll"] = 3] = "hasAll";
    FilterOperator[FilterOperator["hasAnyOf"] = 4] = "hasAnyOf";
    FilterOperator[FilterOperator["emptyArray"] = 5] = "emptyArray";
    FilterOperator[FilterOperator["equals"] = 6] = "equals";
    FilterOperator[FilterOperator["greater"] = 7] = "greater";
    FilterOperator[FilterOperator["greaterOrEqual"] = 8] = "greaterOrEqual";
    FilterOperator[FilterOperator["less"] = 9] = "less";
    FilterOperator[FilterOperator["lessOrEqual"] = 10] = "lessOrEqual";
})(FilterOperator || (FilterOperator = {}));
(function (FilterOperator) {
    FilterOperator.noValueOperators = [FilterOperator.emptyArray];
})(FilterOperator || (FilterOperator = {}));
export var FilterFieldType;
(function (FilterFieldType) {
    FilterFieldType[FilterFieldType["text"] = 1] = "text";
    FilterFieldType[FilterFieldType["textArray"] = 2] = "textArray";
    FilterFieldType[FilterFieldType["number"] = 3] = "number";
})(FilterFieldType || (FilterFieldType = {}));
(function (FilterFieldType) {
    FilterFieldType.operators = {
        [FilterFieldType.text]: [FilterOperator.includeChars, FilterOperator.includeWord, FilterOperator.equals],
        [FilterFieldType.textArray]: [FilterOperator.hasAnyOf, FilterOperator.hasAll, FilterOperator.emptyArray],
        [FilterFieldType.number]: [FilterOperator.equals, FilterOperator.greater, FilterOperator.greaterOrEqual, FilterOperator.less, FilterOperator.lessOrEqual],
    };
})(FilterFieldType || (FilterFieldType = {}));
export var Filter;
(function (Filter) {
    function serialize(filters) {
        if (!filters) {
            return;
        }
        const serialized = [];
        for (const filter of filters) {
            const s = [filter.field, filter.operator];
            if (filter.value !== undefined) {
                s.push(filter.value);
            }
            serialized.push(s);
        }
        return serialized;
    }
    Filter.serialize = serialize;
    function unserialize(filters, fields) {
        if (!filters) {
            return;
        }
        const unserialized = [];
        for (const filter of filters) {
            const spec = fields.find(f => f.name === filter[0]);
            if (spec) {
                unserialized.push({ field: spec.name, spec, operator: filter[1], value: filter[2] });
            }
        }
        return unserialized.length ? unserialized : undefined;
    }
    Filter.unserialize = unserialize;
})(Filter || (Filter = {}));
//# sourceMappingURL=specs.js.map