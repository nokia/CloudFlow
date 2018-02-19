// Copyright (C) 2017 Nokia

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {CopyableComponent} from "./copyable.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ClipboardModule} from "ngx-clipboard";


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        ClipboardModule,
    ],
    declarations: [
        CopyableComponent
    ],
    exports: [
        CopyableComponent
    ]
})
export class CopyableModule {
}
