import { SnapshotOptions as SnapshotOptionsClient } from "firebase/firestore";
export type SnapshotOptions = SnapshotOptionsClient;
export declare namespace SnapshotOptions {
    function extract(options: Partial<SnapshotOptions>): {
        serverTimestamps: "estimate" | "previous" | "none" | undefined;
    };
}
