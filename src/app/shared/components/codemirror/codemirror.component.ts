// Copyright (C) 2017 Nokia

import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from "@angular/core";
import * as CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/indent-fold";
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/search/matchesonscrollbar";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/display/autorefresh";
import {objectToString} from "../../utils";

export interface CodeMirrorConfig {
    readonly?: boolean;
    mode?: string;
    fullHeight?: boolean;
}

const modes = {yaml: "text/x-yaml", json: "application/json", text: "text/plain"};

@Component({
    selector: 'codemirror', /*tslint:disable-line*/
    template: `<textarea #ta></textarea>`
})
export class CodeMirrorComponent implements AfterViewInit, OnChanges {
    @Input() input: any;
    @Input() config: CodeMirrorConfig = {mode: "json"};

    @ViewChild('ta') private textArea: ElementRef;

    private instance: CodeMirror.Editor = null;

    private setValue(value: any) {
        if (this.instance) {
            this.instance.setValue(this.formatValue(value));
        }
    }

    private formatValue(value: any) {
        try {
            return objectToString(value, this.config.mode);
        } catch (e) {
            console.warn(`objectToString error. Falling back to toString() (${e.message})`);
            return (value || '').toString();
        }

    }

    ngAfterViewInit() {
        this.instance = CodeMirror.fromTextArea(this.textArea.nativeElement, {
            value: '',
            mode: modes[this.config.mode],
            lineNumbers: true,
            lineWrapping: true,
            readOnly: this.config.readonly,
            foldGutter: true,
            matchBrackets: true,
            autoRefresh: true,
            extraKeys: {"Ctrl-F": "findPersistent"},
            gutters: ["CodeMirror-foldgutter"],
        } as any);

        setTimeout(() => {
            this.instance.setValue(this.formatValue(this.input));
            if (this.config.fullHeight) {
                this.instance.setSize("100%", "100%");
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["input"]) {
            this.setValue(changes["input"].currentValue);
        }
    }
}
