// Copyright (C) 2017 Nokia

import {Component, OnDestroy, OnInit} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {TaskExec, ActionExecution, TaskDef} from "../../shared/models/";
import {CodeMirrorModalService} from "../../shared/components/codemirror/codemirror-modal.service";
import {Subscription} from "rxjs/Subscription";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/do";
import {NgbPanelChangeEvent} from "@ng-bootstrap/ng-bootstrap";

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
        this.subscription = this.service.selectedTask
            .do(() => {
                this.actionExecutions = [];
                this.subWfExecutions = [];
            })
            .filter(task => !!task)
            .subscribe(task => {
                this.load(task);
            });
    }

    load(taskData) {

        this.task = taskData.task;
        this.taskDef = taskData.taskDef;

        if (this.task.isAction) {
            // for task of type 'action' => load action_executions
            this.loadActionExecutions(this.task.id);
        } else {
            // for task of type 'workflow => load sub workflow executions
            this.loadWfExecutionsByTaskExecutionId(this.task.id);
        }

        // get the 'result' value of the task
        this.service.patchTaskExecutionResult(this.task).subscribe(() => {});

    }

    /**
     * For task of type "ACTION"- load the action executions
     * @param taskExecId
     */
    private async loadActionExecutions(taskExecId: string) {
        return this.actionExecutions = await this.service.actionExecutions(taskExecId).toPromise();
    }

    /**
     * For task of type "Workflow"- load the sub workflow executions
     * @param taskExecId
     */
    private async loadWfExecutionsByTaskExecutionId(taskExecId: string) {
        return this.subWfExecutions = await this.service.wfExecutionsByTaskExecutionId(taskExecId).toPromise();
    }

    /**
     * Fetch the 'output' value of the given action execution
     * @param actionExecution
     */
    private patchActionExecutionOutput(actionExecution: ActionExecution) {
        this.service.patchActionExecutionOutput(actionExecution).subscribe(() => {});
    }

    showTaskDefinition(taskDef: TaskDef) {
        this.codeMirrorService.open(taskDef, {mode: 'yaml'}, 'Task Definition');
    }

    /**
     * When opening an action execution tab, fetch the missing info of the action
     * @param {Number} panelId - index of the action execution
     * @param {Boolean} nextState - is the panel opened (true) or closed (false)
     */
    panelChanged({panelId, nextState}: NgbPanelChangeEvent) {
        if (nextState /* panel opened */) {
            this.patchActionExecutionOutput(this.actionExecutions[panelId]);
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
