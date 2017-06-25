// Copyright (C) 2017 Nokia

import {Component, OnInit, OnDestroy} from '@angular/core';
import {MistralService} from "../../engines/mistral/mistral.service";
import {TaskExec} from "../../shared/models/taskExec";
import {ActionExecution} from "../../shared/models/action";
import {TaskDef} from "../../shared/models/task";
import {Subscription} from "rxjs/Subscription";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/toPromise";
import {
    CodeMirrorModalService
} from "../../shared/components/codemirror/codemirror-modal.service";
import {CodeMirrorConfig} from "../../shared/components/codemirror/codemirror.component";

@Component({
    selector: 'cf-task-info',
    templateUrl: './task-info.component.html',
    styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    task: TaskExec;
    taskDef: TaskDef;
    actionExecutions: ActionExecution[];
    subWfExecutions: any[];

    constructor(private service: MistralService, private codeMirrorService: CodeMirrorModalService) {
    }

    ngOnInit() {
        this.load();
    }

    load() {
        this.subscription = this.service.selectedTask
            .filter(task => !!task)
            .subscribe(task => {
                this.task = task.task;
                this.taskDef = task.taskDef;

                if (this.task.isAction) {
                    this.loadActionExecutions(this.task.id);
                } else {
                    this.loadWfExecutionsByTaskExecutionId(this.task.id);
                }
            })
    }

    /**
     * For task of type "ACTION"- load the action executions
     * @param taskExecId
     * @returns {Promise<void>}
     */
    private loadActionExecutions(taskExecId: string) {
        this.service.actionExecutions(taskExecId).subscribe(executions => this.actionExecutions = executions);
    }

    private loadWfExecutionsByTaskExecutionId(taskExecId: string) {
        this.service.wfExecutionsByTaskExecutionId(taskExecId).subscribe(executions => this.subWfExecutions = executions);
    }

    codeMirrorModal(input: any, config: CodeMirrorConfig) {
        this.codeMirrorService.open(input, config, 'Task Definition');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
