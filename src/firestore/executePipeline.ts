import {execute} from "firebase/firestore/pipelines";
import {DocumentData} from "./DocumentData.js";
import {Pipeline, PipelineAdmin, PipelineClient} from "./Pipeline.js";
import {PipelineSnapshot, PipelineSnapshotAdmin, PipelineSnapshotClient} from "./PipelineSnapshot.js";

export async function executePipeline<T extends DocumentData = any>(pipeline: PipelineClient): Promise<PipelineSnapshotClient>;

export async function executePipeline<T extends DocumentData = any>(pipeline: PipelineAdmin): Promise<PipelineSnapshotAdmin>;

export async function executePipeline<T extends DocumentData = any>(pipeline: Pipeline): Promise<PipelineSnapshot>;

export async function executePipeline<T extends DocumentData = any>(pipeline: Pipeline): Promise<PipelineSnapshot> {

  if (Pipeline.isClient(pipeline)) {
    return execute(pipeline);
  } else if (Pipeline.isAdmin(pipeline)) {
    return pipeline.execute();
  } else {
    throw new Error("Invalid Pipeline object");
  }
}
