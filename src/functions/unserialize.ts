import {Type} from "@appspltfrm/js-utils/core";
import {SerializationOptions, unserialize as unserializeImpl} from "@appspltfrm/js-utils/json";

const typeField = "@type";
const fixedTypeField = `${typeField}@`;

/**
 * Deserializuje obiekt JSON z powrotem do typów JS/Firebase.
 * Odwraca operację `serialize`, przywracając pole `@type` z `fixedTypeField`.
 * Wykorzystuje `@appspltfrm/js-utils/json` do odtworzenia instancji klas na podstawie metadanych.
 *
 * @param json Dane JSON do deserializacji.
 * @param targetType Opcjonalny docelowy typ (klasa).
 * @param options Opcje serializacji.
 */
export function unserialize(json: any, targetType?: Type, options?: SerializationOptions) {

  if (json && (Array.isArray(json) || typeof json === "object")) {

    const fixType = (obj: any) => {

      if (!obj) {
        return obj;
      }

      if (Array.isArray(obj)) {
        const niu: any[] = [];

        for (const value of obj) {
          if (value && (Array.isArray(value) || typeof value === "object")) {
            niu.push(fixType(value));
          } else {
            niu.push(value);
          }
        }

        return niu;

      } else if (typeof obj === "object") {
        const niu: any = {};

        for (const [key, value] of Object.entries(obj)) {
          if (key === fixedTypeField) {
            niu[typeField] = value;
          } else if (value && (Array.isArray(value) || typeof value === "object")) {
            niu[key] = fixType(value);
          } else {
            niu[key] = value;
          }
        }

        return niu;

      } else {
        return obj;
      }
    };

    json = fixType(json);
  }

  return unserializeImpl(json, targetType, options);
}
