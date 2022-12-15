// Copyright (C) 2017 Nokia

import {HttpParams, HttpHeaders} from "@angular/common/http";
import * as jsyaml from 'js-yaml';

/**
 * Build HttpHeaders object
 * @param obj
 * @returns {HttpHeaders}
 */
export function toHTTPHeaders(obj = {}): HttpHeaders {
    let headers = new HttpHeaders();
    Object.keys(obj).forEach(key => headers = headers.append(key, obj[key].toString()));
    return headers;
}

/**
 * Build URLSearchParams object
 * @param obj
 * @returns {URLSearchParams}
 */
export function toUrlParams(obj = {}): HttpParams {
    let params = new HttpParams();
    Object.keys(obj).forEach(key => params = params.append(key, obj[key].toString()));
    return params;
}

/**
 * Convert the given string content into an object
 * @param {string} content
 * @param {string} mode - result object type (JSON, YAML)
 * @returns {any}
 */
export function stringToObject(content: any, mode: "json" | "yaml") {
    if (content && typeof(content) === "string") {
        if (mode === "yaml") {
            return jsyaml.safeLoad(content);
        } else {
            // assume json
            return JSON.parse(content);
        }
    } else {
        return content;
    }
}

/**
 * Convert the given object (JSON, YAML) to string
 * @param content
 * @param {string} mode - the object  type
 * @returns {string}
 */
export function objectToString(content: any, mode: string /*json | yaml | text*/): string {
    if (!content || typeof content === "string" || mode === "text") {
        if (typeof content === "string" && mode === "json") {
            // for json- need to parse then stringify to fix newlines parsing
            return JSON.stringify(JSON.parse(content), null, 2);
        } else {
            return (content || '').toString();
        }
    } else if (mode === "yaml") {
        return jsyaml.safeDump(content);
    } else {
        // assume json
        return JSON.stringify(content, null, 2);
    }
}
