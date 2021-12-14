import { SnapshotListenOptions as SnapshotListenOptionsClient } from "firebase/firestore";
export declare type SnapshotListenOptions = SnapshotListenOptionsClient;
export declare namespace SnapshotListenOptions {
    function extract(options: Partial<SnapshotListenOptions>): Partial<SnapshotListenOptionsClient>;
}
