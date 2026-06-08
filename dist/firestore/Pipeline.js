import { Pipeline as PipelineClient } from "firebase/firestore/pipelines";
import { Firestore } from "./Firestore.js";
export { Pipeline as PipelineClient } from "firebase/firestore/pipelines";
export var Pipeline;
(function (Pipeline) {
    function isInstance(obj) {
        return obj instanceof PipelineClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Pipelines.Pipeline);
    }
    Pipeline.isInstance = isInstance;
    function isClient(pipeline) {
        return pipeline instanceof PipelineClient;
    }
    Pipeline.isClient = isClient;
    function isAdmin(pipeline) {
        return !isClient(pipeline);
    }
    Pipeline.isAdmin = isAdmin;
})(Pipeline || (Pipeline = {}));
//# sourceMappingURL=Pipeline.js.map