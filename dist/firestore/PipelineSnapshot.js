import { PipelineSnapshot as PipelineSnapshotClient } from "firebase/firestore/pipelines";
import { Firestore } from "./Firestore.js";
export { PipelineSnapshot as PipelineSnapshotClient } from "firebase/firestore/pipelines";
export var PipelineSnapshot;
(function (PipelineSnapshot) {
    function isInstance(obj) {
        return obj instanceof PipelineSnapshotClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Pipelines.PipelineSnapshot);
    }
    PipelineSnapshot.isInstance = isInstance;
    function isClient(snapshot) {
        return snapshot instanceof PipelineSnapshotClient;
    }
    PipelineSnapshot.isClient = isClient;
    function isAdmin(snapshot) {
        return (Firestore.adminInitialized() && snapshot instanceof Firestore.admin().Pipelines.PipelineSnapshot);
    }
    PipelineSnapshot.isAdmin = isAdmin;
})(PipelineSnapshot || (PipelineSnapshot = {}));
//# sourceMappingURL=PipelineSnapshot.js.map