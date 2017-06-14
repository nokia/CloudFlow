import {URLSearchParams} from "@angular/http";

export function toUrlParams(obj = {}): URLSearchParams {
    const params = new URLSearchParams();
    Object.keys(obj).forEach(key => params.set(key, obj[key].toString()));
    return params;
}
