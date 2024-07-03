import { SnapshotListenOptions as SnapshotListenOptionsClient } from "firebase/firestore";
export declare type SnapshotListenOptions = SnapshotListenOptionsClient & {
    skipErrors?: boolean;
};
