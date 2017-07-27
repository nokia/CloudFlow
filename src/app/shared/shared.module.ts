// Copyright (C) 2017 Nokia

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AngularSplitModule} from "angular-split";
import {CodeMirrorModule} from "./components/codemirror/codemirror.module";
import {ClipboardModule} from "ngx-clipboard/dist";
import {CopyableComponent} from "./components/copyable.component";
import {SearchPipe} from './filters/search.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
        CodeMirrorModule,
        ClipboardModule,
    ],
    declarations: [
        CopyableComponent,
        SearchPipe,
    ],
    exports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
        CodeMirrorModule,
        ClipboardModule,
        CopyableComponent,
        SearchPipe,
    ]
})
export class SharedModule {
}
