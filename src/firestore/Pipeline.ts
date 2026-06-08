import type {Pipeline as PipelineAdmin} from "@google-cloud/firestore/pipelines"
import {Pipeline as PipelineClient} from "firebase/firestore/pipelines";
import {Firestore} from "./Firestore.js";

export {Pipeline as PipelineClient} from "firebase/firestore/pipelines";
export type {Pipeline as PipelineAdmin} from "@google-cloud/firestore/pipelines";

export type Pipeline = PipelineClient | PipelineAdmin;

export namespace Pipeline {

  export function isInstance(obj: any): obj is Pipeline {
    return obj instanceof PipelineClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Pipelines.Pipeline);
  }

  export function isClient(pipeline: Pipeline): pipeline is PipelineClient {
    return pipeline instanceof PipelineClient;
  }

  export function isAdmin(pipeline: Pipeline): pipeline is PipelineAdmin {
    return !isClient(pipeline);
  }

}
