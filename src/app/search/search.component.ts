// Copyright (C) 2018 Nokia

import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MistralService} from "../engines/mistral/mistral.service";


@Component({
    selector: 'cf-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    searchInput = "";
    err: null | "NOT_FOUND";
    searching = false;
    readonly uuidPattern = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    constructor(public readonly service: MistralService, public readonly router: Router) {
    }

    async search() {
        const searchValue = this.searchInput.trim();
        if (!searchValue || this.searching) {
            return;
        }

        this.searching = true;
        this.err = null;

        try {
            await this.searchTaskExecution(searchValue);
        } catch {
            // ignore this: the given id is not a task execution.
        }

        try {
            await this.searchWorkflowExecution(searchValue);
        } catch {
            // ignore this: this given id is not a workflow execution
        }

        try {
            await this.searchActionExecution(searchValue);
        } catch {
            // the given id is also not an action execution -> show error
            this.err = "NOT_FOUND";
        }

        this.searching = false;
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
