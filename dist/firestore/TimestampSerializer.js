import { Serializer } from "@appspltfrm/js-utils/json";
import { Timestamp } from "./Timestamp.js";
export class TimestampSerializer extends Serializer {
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
            return { "@type": Timestamp.jsonTypeName, ...object.toJson() };
        }
        else {
            throw new Error(`Cannot serialize "${object}" as Firestore Timestamp`);
        }
    }
}
//# sourceMappingURL=TimestampSerializer.js.map