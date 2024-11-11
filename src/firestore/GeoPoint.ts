import type {firestore as admin} from "firebase-admin";
import {GeoPoint as $GeoPointClient} from "firebase/firestore";
import {Firestore} from "./Firestore.js";

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

    export function isInstance(obj: any): obj is GeoPoint {
        return isClient(obj) || isAdmin(obj);
    }

    export function create(latitude: number, longitude: number): GeoPoint {
        if (Firestore.adminInitialized()) {
            return new (Firestore.admin().GeoPoint)(latitude, longitude);
        } else {
            return new $GeoPointClient(latitude, longitude);
        }
    }
}
