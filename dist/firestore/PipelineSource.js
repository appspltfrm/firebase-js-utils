import { PipelineSource as PipelineSourceClient } from "firebase/firestore/pipelines";
export var PipelineSource;
(function (PipelineSource) {
    function isClient(source) {
        return source instanceof PipelineSourceClient;
    }
    PipelineSource.isClient = isClient;
    function isAdmin(source) {
        return !isClient(source);
    }
    PipelineSource.isAdmin = isAdmin;
})(PipelineSource || (PipelineSource = {}));
//# sourceMappingURL=PipelineSource.js.map