import type { GeoPoint as GeoPointAdmin } from "firebase-admin/firestore";
import { GeoPoint as GeoPointClient } from "firebase/firestore";
export type { GeoPointClient };
export type { GeoPointAdmin };
export type GeoPoint = GeoPointAdmin | GeoPointClient;
export declare namespace GeoPoint {
    function isClient(gp: GeoPoint): gp is GeoPointClient;
    function isAdmin(gp: GeoPoint): gp is GeoPointAdmin;
    function isInstance(obj: any): obj is GeoPoint;
    function create(latitude: number, longitude: number): GeoPoint;
}
