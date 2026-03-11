# @appspltfrm/firebase-js-utils

Pakiet narzędziowy ujednolicający pracę z Firebase SDK (Web/Client) oraz Firebase Admin SDK (Server). Zapewnia spójną warstwę abstrakcji, która pozwala pisać kod działający w obu środowiskach bez konieczności ciągłego sprawdzania, czy używamy biblioteki `firebase` czy `firebase-admin`.

## Główna Idea (Dla Programisty i AI)

Kluczowym problemem przy pracy z Firebase w aplikacjach full-stack (np. Next.js, monorepo) jest różnica w API między Web SDK a Admin SDK. Ten pakiet rozwiązuje ten problem poprzez:

1.  **Universal Context**: Klasy `FirebaseContextClient` i `FirebaseContextAdmin` implementują wspólny interfejs `UniversalFirebaseContext`. Pozwala to na wstrzykiwanie kontekstu do serwisów/funkcji, które nie muszą wiedzieć, w jakim środowisku pracują.
2.  **Ujednolicone Typy (Polymorphic Types)**: Typy takie jak `Firestore`, `CollectionReference`, `DocumentReference`, `Query` są unią typów z obu SDK. Funkcje pomocnicze wewnątrz pakietu automatycznie wykrywają typ obiektu i wywołują odpowiednie metody natywne.
3.  **Funkcje Pomocnicze (Helpers)**: Funkcje takie jak `getData`, `getSnapshots`, `setDocument`, `updateDocument` abstrahują asynchroniczne operacje Firestore, obsługując różnice w sygnaturach metod (np. `getDoc(ref)` vs `ref.get()`).
4.  **Obsługa Dużych Zbiorów Danych (Chunking)**: Funkcje `getChunkedData` i `getChunkedSnapshots` pozwalają na bezpieczne pobieranie dużych ilości dokumentów, co jest szczególnie przydatne przy migracjach lub raportach.

## Struktura Katalogów `src/`

-   `client-auth/`: Abstrakcje dla uwierzytelniania użytkownika po stronie klienta.
-   `firestore/`: Główny moduł zawierający ujednolicone typy i funkcje dla bazy danych Firestore.
    -   `filters/`: Narzędzia do budowania filtrów i wyszukiwania tekstowego (trigramy).
    -   `rxjs/`: Observables dla danych Firestore (wymaga `rxjs`).
-   `functions/`: Narzędzia do serializacji i deserializacji danych (np. obsługa obiektów `Timestamp` przy przesyłaniu przez JSON).

## Przykłady Użycia

### Uniwersalne pobieranie danych

```typescript
import { getData } from "@appspltfrm/firebase-js-utils/firestore";

// Zadziała zarówno z DocumentReference z Web SDK, jak i Admin SDK
const data = await getData(docRef);
```

### Użycie Kontekstu

```typescript
async function processOrder(ctx: UniversalFirebaseContext, orderId: string) {
    const docRef = ctx.firestoreDocument(`orders/${orderId}`);
    const orderData = await getData(docRef);
    // ... logika biznesowa ...
}
```

## Dlaczego to jest ważne dla AI (LLMs)?

Dla agentów AI ten pakiet redukuje halucynacje dotyczące API Firebase. Zamiast zgadywać, czy użyć `getDoc` czy `.get()`, AI powinno preferować użycie uniwersalnych wrapperów z tego pakietu (`getData`, `setDocument` itp.), co gwarantuje poprawność kodu niezależnie od kontekstu wykonania.
