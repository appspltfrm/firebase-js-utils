import type { Pipeline as PipelineAdmin } from "@google-cloud/firestore/pipelines";
import { Pipeline as PipelineClient } from "firebase/firestore/pipelines";
export { Pipeline as PipelineClient } from "firebase/firestore/pipelines";
export type { Pipeline as PipelineAdmin } from "@google-cloud/firestore/pipelines";
export type Pipeline = PipelineClient | PipelineAdmin;
export declare namespace Pipeline {
    function isInstance(obj: any): obj is Pipeline;
    function isClient(pipeline: Pipeline): pipeline is PipelineClient;
    function isAdmin(pipeline: Pipeline): pipeline is PipelineAdmin;
}
