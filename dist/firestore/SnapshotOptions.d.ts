import { SnapshotOptions as SnapshotOptionsClient } from "firebase/firestore";
export declare type SnapshotOptions = SnapshotOptionsClient;
export declare namespace SnapshotOptions {
    function extract(options: Partial<SnapshotOptions>): Partial<SnapshotOptionsClient>;
}
