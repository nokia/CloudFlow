// Copyright (C) 2017 Nokia

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpModule} from "@angular/http";
import {ExecutionsModule} from "./executions/executions.module";
import {MistralService} from "./engines/mistral/mistral.service";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        BrowserAnimationsModule,
        HttpModule,
        ExecutionsModule,
    ],
    providers: [
        MistralService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
