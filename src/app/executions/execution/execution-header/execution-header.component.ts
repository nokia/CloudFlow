// Copyright (C) 2018 Nokia

import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {Execution, WorkflowDef} from "../../../shared/models";
import {CountdownComponent} from "../../../shared/components/countdown/countdown.component";

@Component({
    selector: 'cf-execution-header',
    templateUrl: './execution-header.component.html',
    styleUrls: ['./execution-header.component.scss']
})
export class ExecutionHeaderComponent {
    @Input() workflowDef: WorkflowDef;
    @Input() execution: Execution;
    @Input() tasksRuntimeActive: boolean;
    @Output() autoReloadDone = new EventEmitter<null>();
    @Output() tasksRuntimeClicked = new EventEmitter<null>();
    @ViewChild(CountdownComponent) countdown: CountdownComponent;

    constructor() {}

    counterRestart() {
        this.countdown.restart();
    }

    autoReloadEnd() {
        this.counterRestart();
        this.autoReloadDone.emit();
    }

    showTasksRuntime() {
        this.tasksRuntimeClicked.emit();
    }

    get tasksRuntimeEnabled() {
        return this.execution.done;
    }
}
