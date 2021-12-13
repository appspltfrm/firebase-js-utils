import type {firestore as admin} from "firebase-admin";
import {GeoPoint as $GeoPointClient} from "firebase/firestore";
import {Firestore} from "./Firestore";

export type GeoPointClient = $GeoPointClient;
export type GeoPointAdmin = admin.GeoPoint;

export type GeoPoint = GeoPointAdmin | GeoPointClient;

export namespace GeoPoint {

    export function isClient(gp: GeoPoint): gp is GeoPointClient {
        return gp instanceof $GeoPointClient;
    }

    export function isAdmin(gp: GeoPoint): gp is GeoPointAdmin {
        return !isClient(gp) && Firestore.adminInitialized() && gp instanceof Firestore.admin().GeoPoint;
    }

    export function create(firestore: Firestore, latitude: number, longitude: number) {
        if (Firestore.isClient(firestore)) {
            return new $GeoPointClient(latitude, longitude);
        } else {
            return new (Firestore.admin().GeoPoint)(latitude, longitude);
        }
    }
}
