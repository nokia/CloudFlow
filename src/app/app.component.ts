// Copyright (C) 2017 Nokia

import {Component} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AboutComponent} from "./about/about.component";

@Component({
    selector: 'cf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private modal: NgbModal) {}

    about() {
        this.modal.open(AboutComponent);
    }

}
