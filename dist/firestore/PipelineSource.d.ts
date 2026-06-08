import type { PipelineSource as PipelineSourceAdmin } from "@google-cloud/firestore/pipelines";
import { PipelineSource as PipelineSourceClient } from "firebase/firestore/pipelines";
import { Pipeline, PipelineClient, PipelineAdmin } from "./Pipeline.js";
export type { PipelineSourceClient, PipelineSourceAdmin };
export type PipelineSource<T extends P, P extends Pipeline = T extends PipelineClient ? PipelineClient : PipelineAdmin> = PipelineSourceClient<PipelineClient> | PipelineSourceAdmin;
export declare namespace PipelineSource {
    function isClient(source: PipelineSourceClient<PipelineClient> | PipelineSourceAdmin): source is PipelineSourceClient<PipelineClient>;
    function isAdmin(source: PipelineSourceClient<PipelineClient> | PipelineSourceAdmin): source is PipelineSourceAdmin;
}
