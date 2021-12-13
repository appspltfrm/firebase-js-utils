import {SnapshotOptions as SnapshotOptionsClient} from "firebase/firestore";

export type SnapshotOptions = SnapshotOptionsClient;

export namespace SnapshotOptions {

    export function extract(options: Partial<SnapshotOptions>) {

        if (!options) {
            return options;
        }

        return Object.assign({}, "serverTimestamps" in options ? {"serverTimestamps": options.serverTimestamps} : undefined);
    }

}
