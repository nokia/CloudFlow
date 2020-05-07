// Copyright (C) 2017 Nokia

import {filter, catchError} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {OAuthService} from "angular-oauth2-oidc";
import {of as ObservableOf} from "rxjs";
import {AuthConfig} from "angular-oauth2-oidc/auth.config";
import createStorageGuest from 'cross-domain-storage/guest';

const OPENID_COMMON_CONF: AuthConfig = {
    redirectUri: window.location.href,
    silentRefreshRedirectUri: window.location.origin + "/assets/silent-refresh.html",
    disableAtHashCheck: true,
    postLogoutRedirectUri: window.location.origin,
    scope: 'openid userinfo'
};

const AUTH_JSON = "assets/auth.json";
let timeoutKey;

export function auth_init_app(http: HttpClient, oauthService: OAuthService) {
    const hasValidToken = (resolve, reject) => {
        if (!oauthService.hasValidAccessToken()) {
            oauthService.initImplicitFlow();
            reject('unauthenticated');
        }
        resolve(true);
        clearTimeout(timeoutKey);
    }

    const getAuthByPostMessage = (storageGuest, key, resolve, reject) => {
        try {
            storageGuest.get(key, (error, data) => {
                if (!!data) {
                    sessionStorage.setItem(key, data);
                    hasValidToken(resolve, reject);
                }
                storageGuest.close();
            });
        } catch (e) {
            hasValidToken(resolve, reject);
            storageGuest.close();
        }
    };

    return () => new Promise((resolve, reject) => {
        http.get(AUTH_JSON).pipe(catchError(e => {
            // when no AUTH_JSON file found, assume app has no auth methods
            console.warn(`No ${AUTH_JSON} file found. Assume no auth is needed.`);
            resolve(false);
            return ObservableOf(null);
        })).pipe(filter(conf => !!conf))
            .subscribe(conf => {
                oauthService.configure({...conf, ...OPENID_COMMON_CONF});

                // enable auto silent refresh of token
                oauthService.setupAutomaticSilentRefresh();

                // debug
                // oauthService.events.subscribe(e => console.log(e));

                oauthService.tryLogin().then(() => {
                    const storageGuest = createStorageGuest(conf.loginUrl);
                    getAuthByPostMessage(storageGuest, 'access_token', resolve, reject);
                    timeoutKey = setTimeout(() => hasValidToken(resolve, reject), 5000);
                });

            });
    });
}
