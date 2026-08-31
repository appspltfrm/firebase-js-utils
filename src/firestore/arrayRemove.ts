import {arrayRemove as arrayRemoveClient} from "firebase/firestore";
import {FieldValue} from "./FieldValue.js";
import {Firestore} from "./Firestore.js";

export function arrayRemove(...elements: any[]): FieldValue {

  if (Firestore.adminInitialized()) {
    return Firestore.admin().FieldValue.arrayRemove(...elements);
  } else {
    return arrayRemoveClient(...elements);
  }

}
