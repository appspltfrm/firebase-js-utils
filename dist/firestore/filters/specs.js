export var FilterOperator;
(function (FilterOperator) {
    FilterOperator[FilterOperator["textTrigram"] = 1] = "textTrigram";
    FilterOperator[FilterOperator["textWord"] = 2] = "textWord";
    FilterOperator[FilterOperator["hasAll"] = 3] = "hasAll";
    FilterOperator[FilterOperator["hasAnyOf"] = 4] = "hasAnyOf";
    FilterOperator[FilterOperator["emptyArray"] = 5] = "emptyArray";
    FilterOperator[FilterOperator["equals"] = 6] = "equals";
})(FilterOperator || (FilterOperator = {}));
(function (FilterOperator) {
    FilterOperator.noValueOperators = [FilterOperator.emptyArray];
})(FilterOperator || (FilterOperator = {}));
export var FilterFieldType;
(function (FilterFieldType) {
    FilterFieldType[FilterFieldType["text"] = 1] = "text";
    FilterFieldType[FilterFieldType["textArray"] = 2] = "textArray";
})(FilterFieldType || (FilterFieldType = {}));
(function (FilterFieldType) {
    FilterFieldType.operators = {
        [FilterFieldType.text]: [FilterOperator.textTrigram, FilterOperator.textWord, FilterOperator.equals],
        [FilterFieldType.textArray]: [FilterOperator.hasAnyOf, FilterOperator.hasAll, FilterOperator.emptyArray]
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
            const s = [filter.field.name, filter.operator];
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
            const field = fields.find(f => f.name === filter[0]);
            if (field) {
                unserialized.push({ field, operator: filter[1], value: filter[2] });
            }
        }
        return unserialized;
    }
    Filter.unserialize = unserialize;
})(Filter || (Filter = {}));
//# sourceMappingURL=specs.js.map