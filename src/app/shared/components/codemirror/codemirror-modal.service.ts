import {Component, Injectable, Input} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CodeMirrorConfig} from "./codemirror.component";

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
            <codemirror [input]="input" [config]="config"></codemirror>
        </div>
    `
})
export class CodeMirrorModalComponent {
    @Input() input: any;
    @Input() config: CodeMirrorConfig;
    title = '';
    constructor(public activeModal: NgbActiveModal) {}
}

@Injectable()
export class CodeMirrorModalService {

    constructor(protected modal: NgbModal) {}

    open(input: any, config?: CodeMirrorConfig) {
        const modalRef = this.modal.open(CodeMirrorModalComponent, {size: "lg"});
        modalRef.componentInstance.input = input;
        modalRef.componentInstance.config = config;
        modalRef.componentInstance.ready = true;
        return modalRef;
    }
}
