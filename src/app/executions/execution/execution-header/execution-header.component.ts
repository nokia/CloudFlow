// Copyright (C) 2018 Nokia

import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {Execution, WorkflowDef} from "../../../shared/models";
import {CodeMirrorModalService} from "../../../shared/components/codemirror/codemirror-modal.service";
import {CountdownComponent} from "../../../shared/components/countdown/countdown.component";

@Component({
    selector: 'cf-execution-header',
    templateUrl: './execution-header.component.html',
    styleUrls: ['./execution-header.component.scss']
})
export class ExecutionHeaderComponent {
    @Input() workflowDef: WorkflowDef;
    @Input() execution: Execution;
    @Output() autoReloadDone = new EventEmitter<null>();
    @Output() showRuntimesClick = new EventEmitter<null>();
    @ViewChild(CountdownComponent) countdown: CountdownComponent;

    constructor(public readonly codeMirrorService: CodeMirrorModalService) {}

    counterRestart() {
        this.countdown.restart();
    }

    autoReloadEnd() {
        this.counterRestart();
        this.autoReloadDone.emit();
    }

    showWorkflowDefinition(workflowDef: WorkflowDef) {
        this.codeMirrorService.open(workflowDef.definition, {mode: 'yaml', readonly: true}, `Workflow Definition`);
    }

    showTasksRuntimes() {
        this.showRuntimesClick.emit();
    }

    get runtimesEnabled() {
        return this.execution.done;
    }
}
