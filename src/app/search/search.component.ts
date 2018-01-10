// Copyright (C) 2018 Nokia
import {Component, OnInit} from '@angular/core';
import {MistralService} from "../engines/mistral/mistral.service";
import 'rxjs/add/operator/toPromise';
import {Router} from "@angular/router";

@Component({
    selector: 'cf-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    searchInput: string;
    err: null | "NOT_FOUND" | "SEARCHING";

    constructor(public readonly service: MistralService, public readonly router: Router) {
    }

    ngOnInit() {
    }

    async search() {
        this.err = "SEARCHING";

        try {
            await this.searchTaskExecution(this.searchInput);
            return;
        } catch {
            // ignore this: the given id is probably not a task execution.
        }

        try {
            await this.searchWorkflowExecution(this.searchInput);
            return;
        } catch {
            // ignore this: this given id is probably not a workflow execution
        }

        try {
            await this.searchActionExecution(this.searchInput);
            return;
        } catch {
            this.err = "NOT_FOUND";
        }
    }

    private async searchTaskExecution(entityId: string) {
        const task = await this.service.getTask(entityId).toPromise();
        this.router.navigate(["executions", task.workflow_execution_id, "tasks", task.id]);
    }

    private async searchWorkflowExecution(executionId: string) {
        const workflowExecution = await this.service.execution(executionId).toPromise();
        this.router.navigate(["executions", workflowExecution.id]);
    }

    private async searchActionExecution(actionExecutionId: string) {
        const actionExecution = await this.service.getActionExecution(actionExecutionId).toPromise();
        await this.searchTaskExecution(actionExecution.task_execution_id);
    }

}
