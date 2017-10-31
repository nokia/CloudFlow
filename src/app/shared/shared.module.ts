// Copyright (C) 2017 Nokia

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AngularSplitModule} from "angular-split";
import {CodeMirrorModule} from "./components/codemirror/codemirror.module";
import {SearchPipe} from './filters/search.pipe';
import {CopyableModule} from "./components/copyable/copyable.module";
import {CountdownComponent} from './components/countdown/countdown.component';
import {AlertsService} from "./services/alerts.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
        CodeMirrorModule,
        CopyableModule,
    ],
    declarations: [
        SearchPipe,
        CountdownComponent,
    ],
    exports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
        CodeMirrorModule,
        SearchPipe,
        CountdownComponent,
    ],
    providers: [
        AlertsService
    ]
})
export class SharedModule {
}
