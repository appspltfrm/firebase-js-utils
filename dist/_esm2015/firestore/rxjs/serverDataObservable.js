import { dataObservable } from "./dataObservable";
export function serverDataObservable(docOrQuery, options) {
    return dataObservable(docOrQuery, Object.assign({ skipCache: true }, options));
}
//# sourceMappingURL=serverDataObservable.js.map