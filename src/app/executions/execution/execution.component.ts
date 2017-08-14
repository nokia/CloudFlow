// Copyright (C) 2017 Nokia

import {AfterViewInit, Component, OnDestroy, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution, TaskExec, WorkflowDef} from "../../shared/models/";
import {WorkflowGraphComponent} from "../workflow-graph/workflow-graph.component";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/take";
import {CountdownComponent} from "../../shared/components/countdown/countdown.component";

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
    private interval = null;

    execution: Execution = null;
    tasks: TaskExec[] = [];
    workflowDef: WorkflowDef = null;

    constructor(protected service: MistralService,
                protected route: ActivatedRoute,
                private router: Router) {
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
            console.warn(`Invalid task id given in URL: ${taskId}`);
            this.router.navigate(['/executions', this.execution.id]);
        }
    }

    ngAfterViewInit() {
        // watch for changes in execution id value
        const paramsSubscription = this.route.paramMap.subscribe(params => {
            this.load(params.get("id"));
        });

        // watch for changes in task id value
        const eventsSubscription = this.router.events
            .filter(e => e instanceof NavigationEnd)
            .subscribe(() =>  this.setSelectedTaskFromNavigation());

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
        try {
            this.execution = await this.service.execution(this.executionId).toPromise();
            this.tasks = await this.service.executionTasks(this.executionId).toPromise();
            this.workflowDef = await this.service.workflowDef(this.execution.workflow_id).toPromise();
        } catch (e) {
            console.warn(`Execution ID ${executionId} not found!`);
            this.router.navigate(['/executions']);
        }

        // init the selected task given in URL
        this.setSelectedTaskFromNavigation();

        if (!this.execution.done) {
            this.autoReload(this.execution);
        }
    }

    private autoReload(execution: Execution) {
        const interval = 30;
        this.countdown.setInitValue(interval);
        this.interval = Observable.timer(0, 1000).take(interval + 1).map(i => interval - i).subscribe(
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
