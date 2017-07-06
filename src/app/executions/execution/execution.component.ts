// Copyright (C) 2017 Nokia

import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution, TaskExec, WorkflowDef} from "../../shared/models/";
import {WorkflowGraphComponent} from "../workflow-graph/workflow-graph.component";
import "rxjs/add/operator/toPromise";

@Component({
    selector: 'cf-execution',
    templateUrl: './execution.component.html',
    styleUrls: ['./execution.component.scss']
})
export class ExecutionComponent implements AfterViewInit {
    private executionId = "";
    @ViewChild(WorkflowGraphComponent) private workflowGraph: WorkflowGraphComponent;

    execution: Execution = null;
    tasks: TaskExec[] = [];
    workflowDef: WorkflowDef = null;

    constructor(protected service: MistralService, protected route: ActivatedRoute, private router: Router) {
    }

    /**
     * Observe changes to task ID that happened due to navigation events (Back/Forward) or when directly
     *  opening a link with task ID in it.
     */
    private setSelectedTaskFromNavigation() {
        const taskId = this.route.firstChild.snapshot.paramMap.get("taskId");
        if (taskId) {
            // there is task ID in the URL
            this.setSelectedTaskFromTaskId(taskId);
        } else {
            setTimeout(() => this.workflowGraph.taskSelected(null));
        }
    }

    /**
     * Given a taskId, find the task from the tasks list and notify the graph this task should be selected.
     * @param {String} taskId
     */
    private setSelectedTaskFromTaskId(taskId: string) {
        const task = this.tasks.find(_task => _task.id === taskId);
        if (task) {
            this.setSelectedTask(task);
            setTimeout(() => this.workflowGraph.taskSelected(task));
        } else {
            console.warn(`Invalid task id given in URL: ${taskId}`);
            this.router.navigate(['/executions', this.execution.id]);
        }
    }

    ngAfterViewInit() {
        // watch for changes in execution id value
        this.route.paramMap.subscribe(params => {
            this.load(params.get("id"));
        });

        // watch for changes in task id value
        this.router.events
            .filter(e => e instanceof NavigationEnd)
            .subscribe(() =>  this.setSelectedTaskFromNavigation());
    }

    async load(executionId: string) {
        this.tasks = [];
        this.executionId = executionId;
        this.execution = await this.service.execution(this.executionId).toPromise();
        this.tasks = await this.service.executionTasks(this.executionId).toPromise();
        this.workflowDef = await this.service.workflowDef(this.execution.workflow_id).toPromise();

        // init the selected task given in URL
        this.setSelectedTaskFromNavigation();
    }

    setSelectedTask(task: TaskExec) {
        this.service.selectedTask.next(task
            ? {task, taskDef: this.workflowDef.getTaskDef(task.name)}
            : null);
    }
}
