import { execute } from "firebase/firestore/pipelines";
import { Pipeline } from "./Pipeline.js";
export async function executePipeline(pipeline) {
    if (Pipeline.isClient(pipeline)) {
        return execute(pipeline);
    }
    else if (Pipeline.isAdmin(pipeline)) {
        return pipeline.execute();
    }
    else {
        throw new Error("Invalid Pipeline object");
    }
}
//# sourceMappingURL=executePipeline.js.map