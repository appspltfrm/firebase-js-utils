import {SnapshotListenOptions as SnapshotListenOptionsClient} from "firebase/firestore";

export type SnapshotListenOptions = SnapshotListenOptionsClient & {skipErrors?: boolean};
