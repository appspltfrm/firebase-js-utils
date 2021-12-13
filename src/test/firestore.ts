import {deleteApp, getApp, initializeApp} from "firebase/app";
import {doc, getFirestore} from "firebase/firestore";
import {getDocData} from "../firestore";

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

        const docRef = await getDocData(doc(getFirestore(), "records/9VWhWrzmsTS8UCnNlzzQ"));
        console.log(docRef);

    } catch (error) {
        console.error(error);
    } finally {
        await deleteApp(getApp());
    }

})();
