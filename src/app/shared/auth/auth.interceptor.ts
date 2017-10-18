// Copyright (C) 2017 Nokia

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";

/**
 * Add the X-Auth-Token header to all http requests
 */
@Injectable()
export class AuthIntercept implements HttpInterceptor {
    constructor(private oauthService: OAuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.oauthService.getAccessToken() || '';
        const cloneReq = req.clone({headers: req.headers.set("X-Auth-Token", token)});
        return next.handle(cloneReq);
    }
}
