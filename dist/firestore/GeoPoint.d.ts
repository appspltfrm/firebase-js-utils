import type { firestore as admin } from "firebase-admin";
import { GeoPoint as $GeoPointClient } from "firebase/firestore";
import { Firestore } from "./Firestore";
export declare type GeoPointClient = $GeoPointClient;
export declare type GeoPointAdmin = admin.GeoPoint;
export declare type GeoPoint = GeoPointAdmin | GeoPointClient;
export declare namespace GeoPoint {
    function isClient(gp: GeoPoint): gp is GeoPointClient;
    function isAdmin(gp: GeoPoint): gp is GeoPointAdmin;
    function create(firestore: Firestore, latitude: number, longitude: number): admin.GeoPoint | $GeoPointClient;
}
