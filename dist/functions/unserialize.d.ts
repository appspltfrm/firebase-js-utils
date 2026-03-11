import { Type } from "@appspltfrm/js-utils/core";
import { SerializationOptions } from "@appspltfrm/js-utils/json";
/**
 * Deserializuje obiekt JSON z powrotem do typów JS/Firebase.
 * Odwraca operację `serialize`, przywracając pole `@type` z `fixedTypeField`.
 * Wykorzystuje `@appspltfrm/js-utils/json` do odtworzenia instancji klas na podstawie metadanych.
 *
 * @param json Dane JSON do deserializacji.
 * @param targetType Opcjonalny docelowy typ (klasa).
 * @param options Opcje serializacji.
 */
export declare function unserialize(json: any, targetType?: Type, options?: SerializationOptions): any;
