// Copyright (C) 2017 Nokia

import {BrowserModule} from "@angular/platform-browser";
import {APP_INITIALIZER, NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {ExecutionsModule} from "./executions/executions.module";
import {MistralService} from "./engines/mistral/mistral.service";
import {AboutComponent} from "./about/about.component";
import {OAuthModule, OAuthService} from "angular-oauth2-oidc";
import {AuthIntercept, auth_init_app} from "./shared/auth/auth.index";
import {SearchComponent} from './search/search.component';


@NgModule({
    declarations: [
        AppComponent,
        AboutComponent,
        HomeComponent,
        SearchComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        OAuthModule.forRoot(),
        ExecutionsModule,
        FormsModule,
    ],
    providers: [
        MistralService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthIntercept,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: auth_init_app,
            deps: [HttpClient, OAuthService],
            multi: true
        }
    ],
    entryComponents: [
        AboutComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
