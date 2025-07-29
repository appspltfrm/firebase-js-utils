import {getCountFromServer as getCountFromServerClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {Query} from "./Query.js";

export async function getCountFromServer<T = DocumentData>(query: Query<T>): Promise<number> {
    if (Query.isClient(query)) {
        return (await getCountFromServerClient(query)).data().count;
    } else {
        return (await (query.count().get())).data().count;
    }
}
