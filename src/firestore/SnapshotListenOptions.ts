import {SnapshotListenOptions as SnapshotListenOptionsClient} from "firebase/firestore";

export type SnapshotListenOptions = SnapshotListenOptionsClient;

export namespace SnapshotListenOptions {

    export function extract(options: Partial<SnapshotListenOptions>) {

        if (!options) {
            return options;
        }

        return Object.assign({}, "includeMetadataChanges" in options ? {"includeMetadataChanges": options.includeMetadataChanges} : undefined);
    }

}
