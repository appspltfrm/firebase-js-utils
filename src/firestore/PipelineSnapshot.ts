import type {PipelineSnapshot as PipelineSnapshotAdmin} from "@google-cloud/firestore/pipelines"
import {PipelineSnapshot as PipelineSnapshotClient} from "firebase/firestore/pipelines";
import {Firestore} from "./Firestore.js";

export {PipelineSnapshot as PipelineSnapshotClient} from "firebase/firestore/pipelines";
export type {PipelineSnapshot as PipelineSnapshotAdmin} from "@google-cloud/firestore/pipelines"

export type PipelineSnapshot = PipelineSnapshotClient | PipelineSnapshotAdmin;

export namespace PipelineSnapshot {

  export function isInstance(obj: any): obj is PipelineSnapshot {
    return obj instanceof PipelineSnapshotClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Pipelines.PipelineSnapshot);
  }

  export function isClient(snapshot: PipelineSnapshot): snapshot is PipelineSnapshotClient {
    return snapshot instanceof PipelineSnapshotClient;
  }

  export function isAdmin(snapshot: PipelineSnapshot): snapshot is PipelineSnapshotAdmin {
    return (Firestore.adminInitialized() && snapshot instanceof Firestore.admin().Pipelines.PipelineSnapshot)
  }

}
