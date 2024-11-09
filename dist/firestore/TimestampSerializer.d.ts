import { AssignableType } from "@appspltfrm/js-utils/core";
import { SerializationOptions, Serializer } from "@appspltfrm/js-utils/json";
export declare class TimestampSerializer extends Serializer {
    private readonly timestampClass;
    constructor(timestampClass: AssignableType);
    unserialize(json: any, options?: SerializationOptions): any;
    serialize(object: any, options?: SerializationOptions): any;
}
