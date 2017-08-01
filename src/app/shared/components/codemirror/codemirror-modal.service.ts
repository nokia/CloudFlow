// Copyright (C) 2017 Nokia

import {Component, Injectable, Input} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CodeMirrorConfig as _CodeMirrorConfig} from "./codemirror.component";
type CodeMirrorConfig = _CodeMirrorConfig; // https://github.com/angular/angular-cli/issues/2034

@Component({
    selector: '', /*tslint:disable-line */
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{title}}</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="text-right copy-to-clipboard-header px-2">
                Copy to Clipboard:
                <cf-copyable [content]="input" [contentType]="config.mode"></cf-copyable>
            </div>
            <codemirror [input]="input" [config]="config"></codemirror>
        </div>
    `
})
export class CodeMirrorModalComponent {
    @Input() input: any;
    @Input() config: CodeMirrorConfig;
    @Input() title = '';
    constructor(public activeModal: NgbActiveModal) {}
}

@Injectable()
export class CodeMirrorModalService {

    constructor(protected modal: NgbModal) {}

    open(input: any, config?: CodeMirrorConfig, title?) {
        const modalRef = this.modal.open(CodeMirrorModalComponent, {size: "lg"});
        modalRef.componentInstance.input = input;
        modalRef.componentInstance.config = config;
        modalRef.componentInstance.title = title || '';
        return modalRef;
    }
}
