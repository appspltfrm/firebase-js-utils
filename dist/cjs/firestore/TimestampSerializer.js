"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampSerializer = void 0;
const json_1 = require("@appspltfrm/js-utils/json");
class TimestampSerializer extends json_1.Serializer {
    timestampClass;
    constructor(timestampClass) {
        super();
        this.timestampClass = timestampClass;
    }
    unserialize(json, options) {
        if (this.isUndefinedOrNull(json)) {
            return this.unserializeUndefinedOrNull(json);
        }
        else if (json instanceof this.timestampClass) {
            return json;
        }
        else if (typeof json === "object" && typeof json["seconds"] === "number" && json["nanoseconds"] === "number") {
            new this.timestampClass(json["seconds"], json["nanoseconds"]);
        }
        else {
            throw new Error(`Cannot unserialize "${json}" to Firestore Timestamp`);
        }
    }
    serialize(object, options) {
        if (this.isUndefinedOrNull(object)) {
            return this.serializeUndefinedOrNull(object);
        }
        else if (object instanceof this.timestampClass) {
            return object;
        }
        else {
            throw new Error(`Cannot serialize "${object}" as Firestore Timestamp`);
        }
    }
}
exports.TimestampSerializer = TimestampSerializer;
//# sourceMappingURL=TimestampSerializer.js.map