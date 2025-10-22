import {getCountFromServer as getCountFromServerClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {Query} from "./Query.js";
import {RestQuery} from "./RestQuery.js";

export async function getCountFromServer<T = DocumentData>(query: Query<T> | RestQuery<T>): Promise<number> {
    if (query instanceof RestQuery) {
        return query.runCount();
    } else if (Query.isClient(query)) {
        return (await getCountFromServerClient(query)).data().count;
    } else {
        return (await (query.count().get())).data().count;
    }
}
