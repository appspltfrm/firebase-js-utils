import { Auth, User } from "firebase/auth";
import { Observable, ReplaySubject } from "rxjs";
/**
 * Reprezentuje zalogowanego użytkownika po stronie klienta (Web SDK).
 * Ułatwia dostęp do instancji User, jej ID oraz tokenów ID, a także dostarcza
 * strumienie Observable (RxJS) do śledzenia zmian stanu uwierzytelnienia.
 *
 * @category Auth
 */
export declare class AuthUser {
    private readonly auth;
    constructor(auth: Auth);
    private authInitialized;
    private _user;
    /**
     * Zwraca aktualną instancję użytkownika Firebase.
     */
    get user(): User | null;
    /**
     * Zwraca UID aktualnego użytkownika lub null.
     */
    get userId(): string | undefined;
    /**
     * Strumień emitujący aktualną instancję użytkownika przy każdej zmianie.
     */
    readonly userObservable: ReplaySubject<User | null>;
    /**
     * Strumień emitujący UID użytkownika (lub null) przy każdej zmianie.
     */
    readonly userIdObservable: Observable<string | null>;
    /**
     * Zwraca aktualny token ID użytkownika.
     */
    get userIdToken(): Promise<string | null>;
    private userChanged;
    protected onAuthError(error: any): void;
    /**
     * Zwraca Promise, który rozwiązuje się, gdy stan uwierzytelnienia zostanie po raz pierwszy zainicjalizowany.
     */
    initialized(): Promise<boolean>;
    protected userNotSignedError(): Error;
    /**
     * Zwraca strumień użytkownika, opcjonalnie rzucając błąd, jeśli użytkownik nie jest zalogowany.
     */
    observeUser(assertSigned?: boolean): Observable<User | null>;
}
