import {BigNumber} from "bignumber.js";

export type CursorDirection = "asc" | "desc";

/**
 * Rank of a value type in the Firestore ordering (`null < boolean < number < timestamp < string`). Types the
 * cursor never carries (bytes, references, arrays, maps) share the last rank and compare as equal.
 */
function typeRank(value: any): number {
  if (value === undefined || value === null) {
    return 0;
  }
  if (typeof value === "boolean") {
    return 1;
  }
  if (typeof value === "number" || value instanceof BigNumber) {
    return 2;
  }
  if (isTimestampLike(value)) {
    return 3;
  }
  if (typeof value === "string") {
    return 4;
  }
  return 5;
}

/**
 * A client, admin or REST-decoded `Timestamp` — detected structurally so this module stays free of SDK
 * imports and works on whichever flavour the query returned.
 */
function isTimestampLike(value: any): value is {toMillis(): number, nanoseconds: number} {
  return !!value && typeof value === "object" && typeof value.toMillis === "function" && typeof value.nanoseconds === "number";
}

/** Compares two values of the same {@link typeRank}. */
function compareSameType(a: any, b: any, rank: number): number {

  if (rank === 0 || rank === 5) {
    return 0;
  }

  if (rank === 1) {
    return a === b ? 0 : (a ? 1 : -1);
  }

  if (rank === 2) {
    return new BigNumber(a).comparedTo(new BigNumber(b)) ?? 0;
  }

  if (rank === 3) {
    const millis = a.toMillis() - b.toMillis();
    return millis !== 0 ? millis : (a.nanoseconds % 1_000_000) - (b.nanoseconds % 1_000_000);
  }

  // Firestore orders strings by UTF-8 bytes; comparing code units matches that for everything outside
  // surrogate pairs, which is close enough for a merge order.
  return a < b ? -1 : (a > b ? 1 : 0);
}

/** Orders one cursor value the way Firestore would in an ascending `orderBy`. */
export function compareCursorValue(a: any, b: any): number {
  const rankA = typeRank(a);
  const rankB = typeRank(b);
  return rankA !== rankB ? rankA - rankB : compareSameType(a, b, rankA);
}

/**
 * Orders two `startAfter` cursors (one value per `orderBy` field) the way the query does. `directions` is
 * positional; a position without a direction is ascending.
 */
export function compareCursorValues(a: any[], b: any[], directions: ReadonlyArray<CursorDirection | undefined> = []): number {
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const result = compareCursorValue(a[i], b[i]);
    if (result !== 0) {
      return directions[i] === "desc" ? -result : result;
    }
  }
  return 0;
}
