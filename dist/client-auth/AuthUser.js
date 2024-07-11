"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUser = void 0;
const rxjs_1 = require("rxjs");
class AuthUser {
    constructor(auth) {
        this.auth = auth;
        this.authInitialized = false;
        this.userObservable = new rxjs_1.ReplaySubject(1);
        this.userIdObservable = this.userObservable.pipe((0, rxjs_1.map)(user => (user === null || user === void 0 ? void 0 : user.uid) || null));
        this.auth.onIdTokenChanged((user) => this.userChanged(user));
    }
    get user() {
        return this._user;
    }
    get userId() {
        return this.user && this.user.uid;
    }
    get userIdToken() {
        var _a;
        return (_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.getIdToken();
    }
    get userIdTokenObservable() {
        return new rxjs_1.Observable(subscriber => {
            let unsubscribe = this.auth.onIdTokenChanged(subscriber);
            return () => unsubscribe();
        }).pipe((0, rxjs_1.switchMap)(user => user.getIdToken()));
    }
    userChanged(user) {
        this._user = user;
        this.authInitialized = true;
        try {
            if (!user) {
                this.userObservable.next(null);
            }
            else {
                this.userObservable.next(user ? user : null);
            }
        }
        catch (e) {
            this.onAuthError(e);
        }
    }
    onAuthError(error) {
        console.error(error);
    }
    initialized() {
        if (this.authInitialized) {
            return Promise.resolve(true);
        }
        else {
            return (0, rxjs_1.firstValueFrom)(this.userIdObservable.pipe((0, rxjs_1.first)(), (0, rxjs_1.map)(id => true)));
        }
    }
    userNotSignedError() {
        return new Error("User not signed");
    }
    observeUser(assertSigned) {
        return this.userObservable.pipe((0, rxjs_1.switchMap)(user => user || !assertSigned ? (0, rxjs_1.of)(user) : (0, rxjs_1.throwError)(() => this.userNotSignedError())));
    }
}
exports.AuthUser = AuthUser;
//# sourceMappingURL=AuthUser.js.map