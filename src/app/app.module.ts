// Copyright (C) 2017 Nokia

import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ExecutionsModule} from "./executions/executions.module";
import {MistralService} from "./engines/mistral/mistral.service";
import {AboutComponent} from "./about/about.component";

@NgModule({
    declarations: [
        AppComponent,
        AboutComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientModule,
        ExecutionsModule,
    ],
    providers: [
        MistralService
    ],
    entryComponents: [
        AboutComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
