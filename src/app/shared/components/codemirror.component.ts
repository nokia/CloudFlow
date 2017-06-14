import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from "@angular/core";
import * as CodeMirror from "codemirror";
import * as jsyaml from "js-yaml";
import {isObject} from "lodash/lang";
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
        const newValue: string = value;
        if (this.config.mode === "json" && isObject(value)) {
            // this is indeed json. convert it to string
            return JSON.stringify(value, null, 2);
        }

        if (this.config.mode === "json" && typeof value === "string") {
            // this is a string, convert it to JSON to fix newline problems
            return JSON.stringify(JSON.parse(value), null, 2);
        }

        if (this.config.mode === "yaml") {
            return jsyaml.safeDump(value, );
        }

        return (newValue || '').toString();
    }

    ngAfterViewInit() {
        (<any>window).cm = CodeMirror;
        this.instance = CodeMirror.fromTextArea(this.textArea.nativeElement, {
            value: '',
            mode: modes[this.config.mode],
            lineNumbers: true,
            lineWrapping: true,
            readOnly: this.config.readonly,
            foldGutter: true,
            matchBrackets: true,
            extraKeys: {"Ctrl-F": "findPersistent"},
            gutters: ["CodeMirror-foldgutter", "CodeMirror-search-match"]
        } as any);

        setTimeout(() => {
            this.instance.setValue(this.formatValue(this.input));
            if (this.config.fullHeight) {
                this.instance.setSize("100%", "100%");
            }
            setTimeout(() => this.instance.refresh(), 1000);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["input"]) {
            this.setValue(changes["input"].currentValue);
        }
    }
}
