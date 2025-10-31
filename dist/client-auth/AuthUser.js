import { first, firstValueFrom, map, of, ReplaySubject, switchMap, throwError } from "rxjs";
export class AuthUser {
    auth;
    constructor(auth) {
        this.auth = auth;
        this.auth.onIdTokenChanged((user) => this.userChanged(user));
    }
    authInitialized = false;
    _user;
    get user() {
        return this._user;
    }
    get userId() {
        return this.user && this.user.uid;
    }
    userObservable = new ReplaySubject(1);
    userIdObservable = this.userObservable.pipe(map(user => user?.uid || null));
    get userIdToken() {
        return new Promise(async (resolve) => {
            await this.initialized();
            resolve(this.auth.currentUser?.getIdToken() || null);
        });
    }
    //
    // get userIdTokenObservable(): Observable<string> {
    //     return new Observable<User>(subscriber => {
    //         let unsubscribe = this.auth.onIdTokenChanged(subscriber);
    //         return () => unsubscribe();
    //     }).pipe(switchMap(user => user.getIdToken()));
    // }
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
            return firstValueFrom(this.userIdObservable.pipe(first(), map(id => true)));
        }
    }
    userNotSignedError() {
        return new Error("User not signed");
    }
    observeUser(assertSigned) {
        return this.userObservable.pipe(switchMap(user => user || !assertSigned ? of(user) : throwError(() => this.userNotSignedError())));
    }
}
//# sourceMappingURL=AuthUser.js.map