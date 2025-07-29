import { getCountFromServer as getCountFromServerClient } from "firebase/firestore";
import { Query } from "./Query.js";
export async function getCountFromServer(query) {
    if (Query.isClient(query)) {
        return (await getCountFromServerClient(query)).data().count;
    }
    else {
        return (await (query.count().get())).data().count;
    }
}
//# sourceMappingURL=getCountFromServer.js.map