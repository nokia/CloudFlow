import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AngularSplitModule} from "angular-split";
import {CodeMirrorComponent} from "./components/codemirror.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
    ],
    declarations: [
        CodeMirrorComponent,
    ],
    exports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSplitModule,
        CodeMirrorComponent,
    ]
})
export class SharedModule {
}
