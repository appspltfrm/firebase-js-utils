import { AssignableType } from "@appspltfrm/js-utils/core/Type.js";
import type { SerializationOptions } from "@appspltfrm/js-utils/json/SerializationOptions.js";
import { Serializer } from "@appspltfrm/js-utils/json/Serializer.js";
export declare class TimestampSerializer extends Serializer {
    private readonly timestampClass;
    constructor(timestampClass: AssignableType);
    unserialize(json: any, options?: SerializationOptions): any;
    serialize(object: any, options?: SerializationOptions): any;
}
