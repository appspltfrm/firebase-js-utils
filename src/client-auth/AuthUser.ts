import {Auth, User} from "firebase/auth";
import {first, firstValueFrom, map, Observable, of, ReplaySubject, switchMap, throwError} from "rxjs";

export class AuthUser {

    constructor(private readonly auth: Auth) {
        this.auth.onIdTokenChanged((user) => this.userChanged(user));
    }

    private authInitialized: boolean = false;

    private _user: User;

    get user(): User {
        return this._user;
    }

    get userId(): string {
        return this.user && this.user.uid;
    }

    readonly userObservable: ReplaySubject<User> = new ReplaySubject<User>(1);

    readonly userIdObservable = this.userObservable.pipe(map(user => user?.uid || null));

    get userIdToken(): Promise<string | null> {
        return new Promise<string>(async (resolve) => {
            await this.initialized();
            resolve(this.auth.currentUser?.getIdToken() || null);
        })
    }
    //
    // get userIdTokenObservable(): Observable<string> {
    //     return new Observable<User>(subscriber => {
    //         let unsubscribe = this.auth.onIdTokenChanged(subscriber);
    //         return () => unsubscribe();
    //     }).pipe(switchMap(user => user.getIdToken()));
    // }

    private userChanged(user: User) {

        this._user = user;
        this.authInitialized = true;

        try {

            if (!user) {
                this.userObservable.next(null);
            } else {
                this.userObservable.next(user ? user : null);
            }

        } catch (e) {
            this.onAuthError(e);
        }

    }

    protected onAuthError(error: any) {
        console.error(error);
    }

    initialized(): Promise<boolean> {
        if (this.authInitialized) {
            return Promise.resolve(true);
        } else {
            return firstValueFrom(this.userIdObservable.pipe(first(), map(id => true)));
        }
    }

    protected userNotSignedError() {
        return new Error("User not signed");
    }

    observeUser(assertSigned?: boolean): Observable<User> {
        return this.userObservable.pipe(switchMap(user => user || !assertSigned ? of(user) : throwError(() => this.userNotSignedError())));
    }

}
