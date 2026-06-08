import type { PipelineSnapshot as PipelineSnapshotAdmin } from "@google-cloud/firestore/pipelines";
import { PipelineSnapshot as PipelineSnapshotClient } from "firebase/firestore/pipelines";
export { PipelineSnapshot as PipelineSnapshotClient } from "firebase/firestore/pipelines";
export type { PipelineSnapshot as PipelineSnapshotAdmin } from "@google-cloud/firestore/pipelines";
export type PipelineSnapshot = PipelineSnapshotClient | PipelineSnapshotAdmin;
export declare namespace PipelineSnapshot {
    function isInstance(obj: any): obj is PipelineSnapshot;
    function isClient(snapshot: PipelineSnapshot): snapshot is PipelineSnapshotClient;
    function isAdmin(snapshot: PipelineSnapshot): snapshot is PipelineSnapshotAdmin;
}
