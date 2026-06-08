import { getDoc, getDocs } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference.js";
import { executePipeline } from "./executePipeline.js";
import { Pipeline } from "./Pipeline.js";
import { Query } from "./Query.js";
export async function getData(input, options) {
    if (Query.isInstance(input)) {
        if (Query.isClient(input)) {
            return (await getDocs(input)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (await input.get()).docs.map(snapshot => snapshot.data());
        }
    }
    else if (DocumentReference.isInstance(input)) {
        if (DocumentReference.isClient(input)) {
            return (await getDoc(input)).data(options);
        }
        else {
            return (await input.get()).data();
        }
    }
    else if (Pipeline.isInstance(input)) {
        return (await executePipeline(input)).results.map(r => r.data());
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getData.js.map