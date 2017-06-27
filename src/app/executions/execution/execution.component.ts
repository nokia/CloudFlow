// Copyright (C) 2017 Nokia

import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution, TaskExec, WorkflowDef} from "../../shared/models/";
import {Subscription} from "rxjs/Subscription";
import "rxjs/add/operator/toPromise";

@Component({
    selector: 'cf-execution',
    templateUrl: './execution.component.html',
    styleUrls: ['./execution.component.scss']
})
export class ExecutionComponent implements OnInit, OnDestroy {
    private executionId = "";
    private routerSubscription$: Subscription;
    execution: Execution = null;
    tasks: TaskExec[] = [];
    workflowDef: WorkflowDef = null;

    constructor(protected service: MistralService, protected route: ActivatedRoute, private router: Router) {
    }

    /**
     * When a task ID is given in the URL, mark it as selected.
     *
     * If the ID can't be found among the tasks (shouldn't happen in production) emit a warning to the console,
     * and remove the ID from the URL.
     */
    private initSelectedTaskFromUrl() {
        if (this.route.firstChild) {
            const selectedTaskId = this.route.firstChild.snapshot.params['taskid'];
            if (!selectedTaskId) {
                return;
            }
            const task = this.tasks.find(_task => _task.id === selectedTaskId);
            if (task) {
                this.setSelectedTask(task);
            } else {
                console.warn(`Invalid task id given in URL: ${selectedTaskId}`);
                this.router.navigate(['/executions', this.execution.id]);
            }
        }
    }

    ngOnInit() {
        // Act on workflow execution id changes in URL
        this.routerSubscription$ = this.route.params.subscribe(params => {
            this.load(params["id"]);
        });

    }

    async load(executionId: string) {
        this.tasks = [];
        this.executionId = executionId;
        this.execution = await this.service.execution(this.executionId).toPromise();
        this.tasks = await this.service.executionTasks(this.executionId).toPromise();
        this.workflowDef = await this.service.workflowDef(this.execution.workflow_id).toPromise();

        this.initSelectedTaskFromUrl();
    }

    setSelectedTask(task: TaskExec) {
        this.service.selectedTask.next({task, taskDef: this.workflowDef.getTaskDef(task.name)});
    }

    ngOnDestroy() {
        this.routerSubscription$.unsubscribe();
    }

}
