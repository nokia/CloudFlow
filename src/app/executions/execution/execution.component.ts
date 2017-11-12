// Copyright (C) 2017 Nokia

import {AfterViewInit, Component, OnDestroy, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution, TaskExec, WorkflowDef} from "../../shared/models/";
import {WorkflowGraphComponent} from "../workflow-graph/workflow-graph.component";
import {Subscription} from "rxjs/Subscription";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {take, map, filter} from "rxjs/operators";
import {CountdownComponent} from "../../shared/components/countdown/countdown.component";
import {CodeMirrorModalService} from "../../shared/components/codemirror/codemirror-modal.service";
import {AlertsService} from "../../shared/services/alerts.service";
import * as AlertMessages from "../../shared/services/alert-messages";

@Component({
    selector: 'cf-execution',
    templateUrl: './execution.component.html',
    styleUrls: ['./execution.component.scss']
})
export class ExecutionComponent implements AfterViewInit, OnDestroy {
    private executionId = "";
    private subscriptions: Subscription[] = [];
    @ViewChild(WorkflowGraphComponent) private workflowGraph: WorkflowGraphComponent;
    @ViewChild(CountdownComponent) private countdown: CountdownComponent;
    private interval: Subscription = null;

    execution: Execution = null;
    tasks: TaskExec[] = [];
    workflowDef: WorkflowDef = null;

    constructor(protected readonly service: MistralService,
                protected readonly route: ActivatedRoute,
                protected readonly router: Router,
                protected readonly codeMirrorService: CodeMirrorModalService,
                protected readonly alerts: AlertsService) {
    }

    /**
     * Observe changes to task ID that happened due to navigation events (Back/Forward) or when directly
     *  opening a link with task ID in it.
     */
    private setSelectedTaskFromNavigation() {
        const taskId = this.route.firstChild.snapshot.paramMap.get("taskId");
        this.emitSelectedTask(taskId);

        if (taskId) {
            // there is task ID in the URL
            this.setSelectedTaskFromTaskId(taskId);
        } else {
            // there ISN'T a task ID in the URL, we are at workflow level
            setTimeout(() => this.workflowGraph && this.workflowGraph.taskSelected(null));
        }
    }

    /**
     * Given a taskId, find the task from the tasks list and notify the graph this task should be selected.
     * @param {String} taskId
     */
    private setSelectedTaskFromTaskId(taskId: string) {
        const task = this.tasks.find(_task => _task.id === taskId);
        if (task) {
            setTimeout(() => this.workflowGraph.taskSelected(taskId));
        } else {
            const {msg, confirmButtonText} = AlertMessages.taskNotFound(taskId);
            this.alerts.notFound(msg, {confirmButtonText})
                .then(() => this.router.navigate(['/executions', this.execution.id]));
        }
    }

    ngAfterViewInit() {
        // watch for changes in execution id value
        const paramsSubscription = this.route.paramMap.subscribe(params => {
            this.load(params.get("id"));
        });

        // watch for changes in task id value
        const eventsSubscription = this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            filter(() => this.execution && this.route.snapshot.queryParamMap.get("id") !== this.execution.id)
        ).subscribe(() => this.setSelectedTaskFromNavigation());

        this.subscriptions = [paramsSubscription, eventsSubscription];
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        if (this.interval) {
            this.interval.unsubscribe();
        }
    }

    async load(executionId: string) {
        this.tasks = [];
        this.executionId = executionId;

        if (this.interval) {
            this.interval.unsubscribe();
        }

        try {
            this.execution = await this.service.execution(this.executionId).toPromise();
            this.tasks = await this.service.executionTasks(this.executionId).toPromise();
            this.service.setParentExecutionId(this.execution);
        } catch (e) {
            const {msg, confirmButtonText} = AlertMessages.executionNotFound(this.executionId);
            this.alerts.notFound(msg, {confirmButtonText})
                .then(() => this.router.navigate(['/executions']));
            return;
        }

        try {
            this.workflowDef = await this.service.workflowDef(this.execution.workflow_id).toPromise();
        } catch (e) {
            this.workflowDef = WorkflowDef.FromEmpty();
            // const {msg, title} = AlertMessages.workflowDefinitionNotFound(this.execution.workflow_id);
            // this.alerts.notFound(msg, {title});
        }

        // init the selected task given in URL
        this.setSelectedTaskFromNavigation();
        if (!this.execution.done) {
            this.autoReload(this.execution);
        }
    }

    showWorkflowDefinition(workflowDef: WorkflowDef) {
        this.codeMirrorService.open(workflowDef.definition, {mode: 'yaml', readonly: true}, `Workflow Definition`);
    }

    private autoReload(execution: Execution) {
        const interval = 30;
        this.countdown.setInitValue(interval);
        this.interval = new TimerObservable(0, 1000)
            .pipe(
                take(interval + 1),
                map(i => interval - i))
            .subscribe(
                (i) => this.countdown.setValue(i),
                () => {},
                () => this.load(execution.id)
            );
    }

    private emitSelectedTask(taskId: string|null) {
        const task = this.tasks.find(t => t.id === taskId);
        this.service.selectedTask.next(task
            ? {task, taskDef: this.workflowDef.getTaskDef(task.name)}
            : null);
    }
}
