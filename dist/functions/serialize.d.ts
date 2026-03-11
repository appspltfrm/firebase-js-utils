import { SerializationOptions } from "@appspltfrm/js-utils/json";
/**
 * Serializuje obiekt do formatu JSON, obsługując typy specyficzne dla Firebase (np. Timestamp).
 * Rozszerza standardową serializację z `@appspltfrm/js-utils/json`, dodając obsługę ucieczki pola `@type`.
 * Jest to niezbędne przy przesyłaniu danych między klientem a serwerem (np. w Cloud Functions),
 * aby uniknąć konfliktów z systemami, które używają `@type` do innych celów.
 *
 * @param inputObject Obiekt do serializacji.
 * @param options Opcje serializacji.
 */
export declare function serialize(inputObject: any, options?: SerializationOptions): any;
