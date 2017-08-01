// Copyright (C) 2017 Nokia

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CodeMirrorModalComponent, CodeMirrorModalService} from "./codemirror-modal.service";
import {CodeMirrorComponent} from "./codemirror.component";
import {CodeMirrorExpandComponent} from "./codemirror-expand.component";
import {CopyableModule} from "../copyable/copyable.module";


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        CopyableModule,
    ],
    declarations: [
        CodeMirrorModalComponent,
        CodeMirrorComponent,
        CodeMirrorExpandComponent
    ],
    exports: [
        CodeMirrorComponent,
        CodeMirrorExpandComponent,
    ],
    providers: [
        CodeMirrorModalService
    ],
    entryComponents: [
        CodeMirrorModalComponent
    ]
})
export class CodeMirrorModule {
}
