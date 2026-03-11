import {Auth, User} from "firebase/auth";
import {first, firstValueFrom, map, Observable, of, ReplaySubject, switchMap, throwError} from "rxjs";

/**
 * Reprezentuje zalogowanego użytkownika po stronie klienta (Web SDK).
 * Ułatwia dostęp do instancji User, jej ID oraz tokenów ID, a także dostarcza
 * strumienie Observable (RxJS) do śledzenia zmian stanu uwierzytelnienia.
 *
 * @category Auth
 */
export class AuthUser {

    constructor(private readonly auth: Auth) {
        this.auth.onIdTokenChanged((user) => this.userChanged(user));
    }

    private authInitialized: boolean = false;

    private _user: User | null = null;

    /**
     * Zwraca aktualną instancję użytkownika Firebase.
     */
    get user(): User | null {
        return this._user;
    }

    /**
     * Zwraca UID aktualnego użytkownika lub null.
     */
    get userId(): string | undefined {
        return this.user ? this.user.uid : undefined;
    }

    /**
     * Strumień emitujący aktualną instancję użytkownika przy każdej zmianie.
     */
    readonly userObservable: ReplaySubject<User | null> = new ReplaySubject<User | null>(1);

    /**
     * Strumień emitujący UID użytkownika (lub null) przy każdej zmianie.
     */
    readonly userIdObservable = this.userObservable.pipe(map(user => user?.uid || null));

    /**
     * Zwraca aktualny token ID użytkownika.
     */
    get userIdToken(): Promise<string | null> {
        return new Promise<string | null>(async (resolve) => {
            await this.initialized();
            resolve((await this.auth.currentUser?.getIdToken()) || null);
        })
    }
    //
    // get userIdTokenObservable(): Observable<string> {
    //     return new Observable<User>(subscriber => {
    //         let unsubscribe = this.auth.onIdTokenChanged(subscriber);
    //         return () => unsubscribe();
    //     }).pipe(switchMap(user => user.getIdToken()));
    // }

    private userChanged(user: User | null) {

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

    /**
     * Zwraca Promise, który rozwiązuje się, gdy stan uwierzytelnienia zostanie po raz pierwszy zainicjalizowany.
     */
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

    /**
     * Zwraca strumień użytkownika, opcjonalnie rzucając błąd, jeśli użytkownik nie jest zalogowany.
     */
    observeUser(assertSigned?: boolean): Observable<User | null> {
        return this.userObservable.pipe(switchMap(user => user || !assertSigned ? of(user) : throwError(() => this.userNotSignedError())));
    }

}
