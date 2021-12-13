import {first, firstValueFrom, map, Observable, of, ReplaySubject, switchMap, throwError} from "rxjs";
import {Auth, User} from "firebase/auth";

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

    readonly userIdObservable: ReplaySubject<string> = new ReplaySubject<string>(1);

    get userIdToken(): Promise<string> {
        return this.auth.currentUser?.getIdToken();
    }

    get userIdTokenObservable(): Observable<string> {

        return new Observable<User>(subscriber => {
            let unsubscribe = this.auth.onIdTokenChanged(subscriber);
            return () => unsubscribe();
        }).pipe(switchMap(user => user.getIdToken()));
    }

    private userChanged(user: User) {

        const changed = !this.authInitialized || (!this._user && !!user) || (this._user && !user) || (this._user && user && this._user.uid !== user.uid);

        this._user = user;
        this.authInitialized = true;

        try {

            if (!user) {
                this.userObservable.next(null);
                this.userIdObservable.next(null);

            } else if (changed) {
                this.userObservable.next(this._user ? this._user : null);
                this.userIdObservable.next(this._user ? this._user.uid : null);
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
