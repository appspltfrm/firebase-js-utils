import {sleep} from "@co.mmons/js-utils/core";
import {deleteApp, getApp, initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {map} from "rxjs";
import {AuthUser} from "../client-auth";
import {FirebaseContextClient} from "../FirebaseContext";
import {getData} from "../firestore";
import {dataObservable, snapshotObservable} from "../firestore/rxjs";

interface SomeType {
    field: string;
}

(async () => {

    try {
        initializeApp({
            apiKey: "AIzaSyACkS2lYh-KO9YGPfEVDfrIvHlB8QrWr00",
            authDomain: "dev-test-17b7a.firebaseapp.com",
            databaseURL: "https://dev-test-17b7a.firebaseio.com",
            projectId: "dev-test-17b7a",
            storageBucket: "dev-test-17b7a.appspot.com",
            messagingSenderId: "35542723106",
            appId: "1:35542723106:web:51ff9a1acd32af35e6387b"
        })

        const context = new class extends FirebaseContextClient {
            readonly firestore = getFirestore();
            readonly authUser = new AuthUser(getAuth());
        }

        const recordQuery = context.firestoreQuery("records");
        dataObservable(recordQuery).subscribe(aa => console.log(aa));

        await sleep(10000);

    } catch (error) {
        console.error(error);
    } finally {
        await deleteApp(getApp());
    }

})();
