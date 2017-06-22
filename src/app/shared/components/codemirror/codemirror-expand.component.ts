// Copyright (C) 2017 Nokia

import {CodeMirrorModalService} from "./codemirror-modal.service";
import {Component, Input} from "@angular/core";
import {CodeMirrorConfig} from "./codemirror.component";

@Component({
    selector: 'cf-cm-expand',
    template: `<span class="text-muted2 pointer pl-2"
                     [ngbTooltip]="'Open in Fullscreen'" placement="bottom" container="body"
                     (click)="cmModal.open(input, config)">
        <i class="fa fa-external-link"></i></span>`
})
export class CodeMirrorExpandComponent {
    @Input() input: any;
    @Input() config: CodeMirrorConfig;

    constructor(public cmModal: CodeMirrorModalService) {}
}
