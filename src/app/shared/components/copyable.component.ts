// Copyright (C) 2017 Nokia

import {Component, Input} from '@angular/core';
import {objectToString} from "../utils";

@Component({
    selector: 'cf-copyable',
    template: `
        <i class="fa fa-copy text-muted2 pointer pl-2"
           [ngbTooltip]="copyMessage" placement="bottom" container="body" (hidden)="toDefault()"
           ngxClipboard [cbContent]="content" (cbOnSuccess)="copySuccess()"></i>
        <ng-template #copyMessage><i *ngIf="copied" class="fa fa-check pr-2 text-success"></i>{{message}}</ng-template>`
})
export class CopyableComponent {

    private static readonly DEFAULT_MSG = "Copy to clipboard";
    private static readonly COPIED_MSG = "Copied!";
    private _content = "";

    message = CopyableComponent.DEFAULT_MSG;
    copied = false;

    @Input() contentType = "text";

    @Input() set content(content: any) {
        this._content = objectToString(content, this.contentType);
    }

    get content() {
        return this._content;
    }

    private onCopied() {
        this.copied = true;
        this.message = CopyableComponent.COPIED_MSG;
    }

    toDefault() {
        this.copied = false;
        this.message = CopyableComponent.DEFAULT_MSG;
    }

    copySuccess() {
        this.onCopied();
        setTimeout(() => this.toDefault(), 1500);
    }

}
