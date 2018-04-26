// Copyright (C) 2017 Nokia

import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Injectable, Injector} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";
import 'rxjs/add/operator/do';

/**
 * Add the X-Auth-Token header to all http requests
 */
@Injectable()
export class AuthIntercept implements HttpInterceptor {
    oauthService: OAuthService;  // https://github.com/angular/angular/issues/18224
    constructor(/*private oauthService: OAuthService*/ private injector: Injector) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.oauthService = this.injector.get(OAuthService);
        const token = this.oauthService.getAccessToken() || '';
        const cloneReq = req.clone({headers: req.headers.set("X-Auth-Token", token)});
        return next.handle(cloneReq);
    }
}

@Injectable()
export class UnauthorizedIntercept implements HttpInterceptor {
    oauthService: OAuthService;  // https://github.com/angular/angular/issues/18224
        constructor(/*private oauthService: OAuthService*/ private injector: Injector) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {

            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                console.warn("Unauthenticated");
                this.oauthService = this.injector.get(OAuthService);
                this.oauthService.logOut();
            }
        });
    }
}
