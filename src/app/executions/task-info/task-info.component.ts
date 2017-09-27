// Copyright (C) 2017 Nokia

import {Component, OnDestroy, OnInit} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {TaskExec, TaskDef} from "../../shared/models/";
import {CodeMirrorModalService} from "../../shared/components/codemirror/codemirror-modal.service";
import {InfoItemProperty} from "../info-item/info-item.component";
import {Subscription} from "rxjs/Subscription";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/distinctUntilChanged";

@Component({
    selector: 'cf-task-info',
    templateUrl: './task-info.component.html',
    styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements OnInit, OnDestroy {

    // render UI based on this properties list.
    // key = the attribute on the component (i.e. execution.created_at)
    // renderType = to draw a badge, codemirror element, etc...
    private static readonly Properties: InfoItemProperty[] = [
        {key: 'name', display: 'Task', instance: 'taskExec'},
        {key: 'id', display: 'Task ID', instance: 'taskExec'},
        {key: 'action', display: 'Action', instance: 'taskDef'},
        {key: 'workflow', display: 'Workflow', instance: 'taskDef'},
        {key: 'state', display: 'State', renderType: 'badge', instance: 'taskExec'},
        {key: 'state_info', display: 'State Info', renderType: 'code', mode: 'text', instance: 'taskExec'},
        {key: 'created_at', display: 'Created', instance: 'taskExec'},
        {key: 'updated_at', display: 'Updated', instance: 'taskExec'},
        {key: 'duration', display: 'Duration', instance: 'taskExec'},
        {key: 'with-items', display: 'With Items', instance: 'taskDef'},
        {key: 'result', display: 'Result', renderType: 'code', mode: 'json', instance: 'taskExec'},
        {key: 'published', display: 'Published', renderType: 'code', mode: 'json', instance: 'taskExec'}
    ];

    private subscription: Subscription;

    task: TaskExec;
    taskDef: TaskDef;
    properties: {[key: string]: InfoItemProperty};

    constructor(private service: MistralService, private codeMirrorService: CodeMirrorModalService) {
        this.subscription = this.service.selectedTask
            .filter(taskData => !!taskData)
            .distinctUntilChanged((prevId, currId) => prevId === currId, taskData => taskData.task.id)
            .subscribe(taskData => {
                this.load(taskData);
            });
    }

    ngOnInit() {
        // Due to https://github.com/angular/angular/issues/17473,
        // the subscription is in the constructor.
        // Once closed, the code in CTOR should move it back here.
    }

    load({task, taskDef}: {task: TaskExec, taskDef: TaskDef}) {
        this.task = task;
        this.taskDef = taskDef;
        this.setProperties(this.task, this.taskDef);

        // get the 'result' value of the task
        this.service.patchTaskExecutionData(this.task).subscribe(() => {
            this.setPropertyValue("result", this.task.result);
            this.setPropertyValue("published", this.task.published);
        });
    }

    /**
     * Fill the properties values from the given task def and task execution
     * @param {TaskExec} task
     * @param {TaskDef} taskDef
     */
    private setProperties(task: TaskExec, taskDef: TaskDef): void {
        this.properties = {};
        TaskInfoComponent.Properties.forEach(prop => {
            this.properties[prop.key] = {...prop, value: (prop.instance === 'taskExec' ? task : taskDef)[prop.key]};
        });
    }

    private setPropertyValue(key: string, value: any) {
        this.properties[key]['value'] = value;
    }

    showTaskDefinition(taskDef: TaskDef): void {
        this.codeMirrorService.open(taskDef, {mode: 'yaml', readonly: true}, `${this.task.name} Task Definition`);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
