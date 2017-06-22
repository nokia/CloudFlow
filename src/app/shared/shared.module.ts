import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AngularSplitModule} from "angular-split";
import {CodeMirrorModule} from "./components/codemirror/codemirror.module";
import {ClipboardModule} from "ngx-clipboard/dist";
import {CopyableComponent} from "./components/copyable.component";

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
    ],
    exports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
        CodeMirrorModule,
        ClipboardModule,
        CopyableComponent
    ]
})
export class SharedModule {
}
