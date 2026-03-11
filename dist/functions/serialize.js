import { serialize as serializeImpl } from "@appspltfrm/js-utils/json";
const typeField = "@type";
const fixedTypeField = `${typeField}@`;
/**
 * Serializuje obiekt do formatu JSON, obsługując typy specyficzne dla Firebase (np. Timestamp).
 * Rozszerza standardową serializację z `@appspltfrm/js-utils/json`, dodając obsługę ucieczki pola `@type`.
 * Jest to niezbędne przy przesyłaniu danych między klientem a serwerem (np. w Cloud Functions),
 * aby uniknąć konfliktów z systemami, które używają `@type` do innych celów.
 *
 * @param inputObject Obiekt do serializacji.
 * @param options Opcje serializacji.
 */
export function serialize(inputObject, options) {
    const result = serializeImpl(inputObject, options);
    const fixType = (obj) => {
        if (!obj) {
            return obj;
        }
        if (Array.isArray(obj)) {
            for (const value of obj) {
                if (value && (Array.isArray(value) || typeof value === "object")) {
                    fixType(value);
                }
            }
        }
        else if (typeof obj === "object") {
            for (const [key, value] of Object.entries(obj)) {
                if (key === typeField) {
                    obj[fixedTypeField] = value;
                    delete obj[typeField];
                }
                else if (obj && (Array.isArray(value) || typeof value === "object")) {
                    fixType(value);
                }
            }
        }
        return obj;
    };
    return fixType(result);
}
//# sourceMappingURL=serialize.js.map