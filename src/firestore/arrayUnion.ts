import {arrayUnion as arrayUnionClient} from "firebase/firestore";
import {FieldValue} from "./FieldValue.js";
import {Firestore} from "./Firestore.js";

export function arrayUnion(...elements: any[]): FieldValue {

  if (Firestore.adminInitialized()) {
    return Firestore.admin().FieldValue.arrayUnion(...elements);
  } else {
    return arrayUnionClient(...elements);
  }

}
