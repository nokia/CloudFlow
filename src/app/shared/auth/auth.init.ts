// Copyright (C) 2017 Nokia

import {HttpClient} from "@angular/common/http";
import {OAuthService} from "angular-oauth2-oidc";
import {Observable} from "rxjs/Observable";

const OPENID_COMMON_CONF = {
    redirectUri: window.location.href,
    silentRefreshRedirectUri: window.location.origin + "/assets/silent-refresh.html",
    disableAtHashCheck: true,
    scope: 'openid userinfo'
};

const AUTH_JSON = "assets/auth.json";

export function auth_init_app(http: HttpClient, oauthService: OAuthService) {
    return () => new Promise((resolve, reject) => {
        http.get(AUTH_JSON).catch(e => {
            // when no AUTH_JSON file found, assume app has no auth methods
            console.warn(`No ${AUTH_JSON} file found. Assume no auth is needed.`);
            resolve(false);
            return Observable.of(null);
        }).filter(conf => !!conf)
            .subscribe(conf => {
                oauthService.configure({...conf, ...OPENID_COMMON_CONF});

                // enable auto silent refresh of token
                oauthService.setupAutomaticSilentRefresh();

                // debug
                // oauthService.events.subscribe(e => console.log(e));

                oauthService.tryLogin().then(() => {
                    if (!oauthService.hasValidAccessToken()) {
                        oauthService.initImplicitFlow();
                    }
                });

                resolve(true);
            });
    });
}
