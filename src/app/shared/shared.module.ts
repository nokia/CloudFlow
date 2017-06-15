import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AngularSplitModule} from "angular-split";
import {CodeMirrorModule} from "./components/codemirror/codemirror.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
        CodeMirrorModule,
    ],
    declarations: [

    ],
    exports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
        CodeMirrorModule,
    ]
})
export class SharedModule {
}
