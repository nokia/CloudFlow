// Copyright (C) 2017 Nokia

import {Component} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AboutComponent} from "./about/about.component";
import {OAuthService} from "angular-oauth2-oidc";

@Component({
    selector: 'cf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private modal: NgbModal, private oauthService: OAuthService) {}

    about() {
        this.modal.open(AboutComponent);
    }

    get isLoggedIn() {
        return this.oauthService.hasValidAccessToken();
    }

    logout() {
        this.oauthService.logOut();
    }

}
