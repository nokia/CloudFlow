// Copyright (C) 2018 Nokia

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {of as ObservableOf} from "rxjs/observable/of";
import {tap} from "rxjs/operators/tap";

/**
 * Act like a cache for WorkflowDef getter
 */
@Injectable()
export class WorkflowDefInterceptor implements HttpInterceptor {
    private cache: Map<string, any> = new Map();
    private pathMatch = /\/workflows\/([a-z0-9\-]+)[^\/]/i;

    private sendRequest(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            tap (event => {
                if (event instanceof HttpResponse) {
                    this.cache.set(req.url, event);
                }
            })
        );
    }

    isCachable(url: string): boolean {
        return this.pathMatch.test(url);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isCachable(req.url)) {
            const res = this.cache.get(req.url);
            return res ? ObservableOf(res) : this.sendRequest(req, next);

        } else {
            return next.handle(req);
        }
    }

}
