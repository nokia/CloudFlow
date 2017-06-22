// Copyright (C) 2017 Nokia

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Execution} from "../../shared/models/execution";
import {TaskExec} from "../../shared/models/taskExec"
import {WorkflowDef} from "../../shared/models/workflow";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {TaskDef} from "../../shared/models/task";
import {toUrlParams} from "../../shared/utils";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/forkJoin";
import {ActionExecution} from "../../shared/models/action";


@Injectable()
export class MistralService {
    private prefix = "api/";

    selectedExecution = new BehaviorSubject<Execution>(null);
    selectedExecutionTasks = new BehaviorSubject<TaskExec[]>(null);
    selectedTask = new BehaviorSubject<{task: TaskExec, taskDef: TaskDef}>(null);

    constructor(protected http: Http) {
    }

    handleError(e) {
        console.error(e);
        return Observable.throw(e);
    }

    /**
     * url: /executions?<query_params>
     */
    executions(): Observable<Execution[]> {
        const params = toUrlParams({
            limit: 100,
            fields: "workflow_name,created_at,state",
            sort_keys: "created_at,name",
            sort_dirs: "desc"
        });

        return this.http.get(this.prefix + "executions", {search: params})
            .map(res => res.json().executions)
            .catch(e => this.handleError(e));
    }

    /**
     * url: /executions/<id>
     */
    execution(id: string): Observable<Execution> {
        return this.http.get(this.prefix + "executions/" + id)
            .map(res => {
                const execution = new Execution(res.json());
                this.selectedExecution.next(execution);
                return execution;
            })
            .catch(e => this.handleError(e));
    }

    /**
     * url: /executions/<id>/tasks
     */
    executionTasks(id: string): Observable<TaskExec[]> {
        return this.http.get(this.prefix + `executions/${id}/tasks`)
            .map(res => res.json())
            .map(res => res["tasks"])
            .map(res => {
                const tasks = res.map(task => new TaskExec(task));
                this.selectedExecutionTasks.next(tasks);
                return tasks;
            }).catch(e => this.handleError(e));
    }

    /**
     * url: /workflows/<id>
     * Extract the definition
     */
    workflowDef(id: string): Observable<WorkflowDef> {
        return this.http.get(this.prefix + `workflows/${id}`)
            .map(res => res.json())
            .map(res => new WorkflowDef(res.definition))
            .catch(e => this.handleError(e));
    }

    actionExecutions(taskExecId: string): Observable<ActionExecution[]> {
        return this.http.get(this.prefix + `tasks/${taskExecId}/action_executions`)
            .map(res => res.json())
            .map(res => res.action_executions)
            .catch(e => this.handleError(e));
    }

    wfExecutionsByTaskExecutionId(taskExecId: string): Observable<any[]> {
        const params = toUrlParams({task_execution_id: taskExecId});
        return this.http.get(this.prefix + "executions", {search: params})
            .map(res => res.json())
            .map(res => res.executions)
            .catch(e => this.handleError(e));
    }
}
