import { unserialize as unserializeImpl } from "@appspltfrm/js-utils/json";
const typeField = "@type";
const fixedTypeField = `${typeField}@`;
export function unserialize(json, targetType, options) {
    if (json && (Array.isArray(json) || typeof json === "object")) {
        const fixType = (obj) => {
            if (!obj) {
                return obj;
            }
            if (Array.isArray(obj)) {
                const niu = [];
                for (const value of obj) {
                    if (value && (Array.isArray(value) || typeof value === "object")) {
                        niu.push(fixType(value));
                    }
                    else {
                        niu.push(value);
                    }
                }
                return niu;
            }
            else if (typeof obj === "object") {
                const niu = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (key === fixedTypeField) {
                        niu[typeField] = value;
                    }
                    else if (value && (Array.isArray(value) || typeof value === "object")) {
                        niu[key] = fixType(value);
                    }
                    else {
                        niu[key] = value;
                    }
                }
                return niu;
            }
            else {
                return obj;
            }
        };
        json = fixType(json);
    }
    return unserializeImpl(json, targetType, options);
}
//# sourceMappingURL=unserialize.js.map