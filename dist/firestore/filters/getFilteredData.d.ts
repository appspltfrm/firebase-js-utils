import { DocumentData } from "../DocumentData.js";
import { Pipeline } from "../Pipeline.js";
import { Query } from "../Query.js";
import { RestQuery } from "../rest.js";
import { PipelineQuerySort } from "./_getFilteredDataFromPipeline.js";
import { Filter } from "./specs.js";
type BasicArgs<T extends DocumentData = any> = {
    allData?: T[];
    limit: number;
    filters: Filter.SpecRequired[];
    transliterate?: (input: string) => string;
};
type StandardArgs<T extends DocumentData = any> = BasicArgs<T> & {
    query: Query<T> | RestQuery<T>;
    startAfter?: any[];
    getStartAfter: (data: T) => any[];
};
type PipelineArgs<T extends DocumentData = any> = BasicArgs<T> & {
    query: Pipeline;
    /** Sort for the pipeline path (when `query` is a {@link Pipeline}): drives the `sort` stage and ordering for `queryOffset`. */
    querySort?: PipelineQuerySort;
    /** Offset (rows to skip) for the pipeline path. The Pipeline API has no value cursor, so pagination uses the native `offset` stage instead of `startAfter`. */
    queryOffset?: number;
};
export declare function getFilteredData<T extends DocumentData = any>(props: StandardArgs<T>): Promise<{
    next: boolean;
    records: T[];
}>;
export declare function getFilteredData<T extends DocumentData = any>(props: PipelineArgs<T>): Promise<{
    next: boolean;
    records: T[];
}>;
export {};
