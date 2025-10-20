import { getCountFromServer as getCountFromServerClient } from "firebase/firestore";
import { Query } from "./Query.js";
import { RestQuery } from "./RestQuery";
export async function getCountFromServer(query) {
    if (query instanceof RestQuery) {
        return query.runCount();
    }
    else if (Query.isClient(query)) {
        return (await getCountFromServerClient(query)).data().count;
    }
    else {
        return (await (query.count().get())).data().count;
    }
}
//# sourceMappingURL=getCountFromServer.js.map