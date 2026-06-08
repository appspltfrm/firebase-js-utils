import type {PipelineSource as PipelineSourceAdmin} from "@google-cloud/firestore/pipelines"
import {PipelineSource as PipelineSourceClient} from "firebase/firestore/pipelines";
import {Pipeline, PipelineClient, PipelineAdmin} from "./Pipeline.js";

export type {PipelineSourceClient, PipelineSourceAdmin};

export type PipelineSource<T extends P, P extends Pipeline = T extends PipelineClient ? PipelineClient : PipelineAdmin> = PipelineSourceClient<PipelineClient> | PipelineSourceAdmin;

export namespace PipelineSource {

  export function isClient(source: PipelineSourceClient<PipelineClient> | PipelineSourceAdmin): source is PipelineSourceClient<PipelineClient> {
    return source instanceof PipelineSourceClient;
  }

  export function isAdmin(source: PipelineSourceClient<PipelineClient> | PipelineSourceAdmin): source is PipelineSourceAdmin {
    return !isClient(source);
  }

}
