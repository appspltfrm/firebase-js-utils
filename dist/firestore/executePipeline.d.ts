import { DocumentData } from "./DocumentData.js";
import { Pipeline, PipelineAdmin, PipelineClient } from "./Pipeline.js";
import { PipelineSnapshot, PipelineSnapshotAdmin, PipelineSnapshotClient } from "./PipelineSnapshot.js";
export declare function executePipeline<T extends DocumentData = any>(pipeline: PipelineClient): Promise<PipelineSnapshotClient>;
export declare function executePipeline<T extends DocumentData = any>(pipeline: PipelineAdmin): Promise<PipelineSnapshotAdmin>;
export declare function executePipeline<T extends DocumentData = any>(pipeline: Pipeline): Promise<PipelineSnapshot>;
