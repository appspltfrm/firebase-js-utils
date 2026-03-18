import { first, firstValueFrom, map, of, ReplaySubject, switchMap, throwError } from "rxjs";
/**
 * Reprezentuje zalogowanego użytkownika po stronie klienta (Web SDK).
 * Ułatwia dostęp do instancji User, jej ID oraz tokenów ID, a także dostarcza
 * strumienie Observable (RxJS) do śledzenia zmian stanu uwierzytelnienia.
 *
 * @category Auth
 */
export class AuthUser {
    auth;
    constructor(auth) {
        this.auth = auth;
        this.auth.onIdTokenChanged((user) => this.userChanged(user));
    }
    authInitialized = false;
    _user = null;
    /**
       * Zwraca aktualną instancję użytkownika Firebase.
       */
    get user() {
        return this._user;
    }
    /**
       * Zwraca UID aktualnego użytkownika lub null.
       */
    get userId() {
        return this.user ? this.user.uid : undefined;
    }
    /**
       * Strumień emitujący aktualną instancję użytkownika przy każdej zmianie.
       */
    userObservable = new ReplaySubject(1);
    /**
       * Strumień emitujący UID użytkownika (lub null) przy każdej zmianie.
       */
    userIdObservable = this.userObservable.pipe(map(user => user?.uid || null));
    /**
       * Zwraca aktualny token ID użytkownika.
       */
    get userIdToken() {
        return new Promise(async (resolve) => {
            await this.initialized();
            resolve((await this.auth.currentUser?.getIdToken()) || null);
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
    /**
       * Zwraca Promise, który rozwiązuje się, gdy stan uwierzytelnienia zostanie po raz pierwszy zainicjalizowany.
       */
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
    /**
       * Zwraca strumień użytkownika, opcjonalnie rzucając błąd, jeśli użytkownik nie jest zalogowany.
       */
    observeUser(assertSigned) {
        return this.userObservable.pipe(switchMap(user => user || !assertSigned ? of(user) : throwError(() => this.userNotSignedError())));
    }
}
//# sourceMappingURL=AuthUser.js.map