import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CodeMirrorModalComponent, CodeMirrorModalService} from "./codemirror-modal.service";
import {CodeMirrorComponent} from "./codemirror.component";


@NgModule({
    imports: [
        CommonModule,
        NgbModule
    ],
    declarations: [
        CodeMirrorModalComponent,
        CodeMirrorComponent,
    ],
    exports: [
        NgbModule,
        CodeMirrorComponent
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
