// Copyright (C) 2017 Nokia

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Execution, TaskExec, WorkflowDef, TaskDef, ActionExecution, SubWorkflowExecution} from "../../shared/models";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {toUrlParams} from "../../shared/utils";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/observable/of";


@Injectable()
export class MistralService {
    private prefix = "api/";

    selectedExecution = new BehaviorSubject<Execution>(null);
    selectedExecutionTasks = new BehaviorSubject<TaskExec[]>(null);
    selectedTask = new BehaviorSubject<{task: TaskExec, taskDef: TaskDef}>(null);

    constructor(protected http: HttpClient) {
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
            limit: 1000,
            fields: "workflow_name,created_at,state,task_execution_id",
            sort_keys: "created_at,name",
            sort_dirs: "desc"

        });

        return this.http.get(this.prefix + "executions", {params})
            .map(res => res["executions"])
            .catch(e => this.handleError(e));
    }

    /**
     * url: /executions/<id>
     */
    execution(id: string): Observable<Execution> {
        return this.http.get(this.prefix + "executions/" + id)
            .map((res: Execution) => {
                const execution = new Execution(res);
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
            .map(res => new WorkflowDef(res["definition"], res["name"]))
            .catch(e => this.handleError(e));
    }

    /**
     * url: /tasks/<taskExecId>
     * This call will patch the "missing" 'result' value on a task execution.
     */
    patchTaskExecutionResult(taskExec: TaskExec) {
        if (taskExec.result != null) {
            return Observable.of(taskExec);
        } else {
            return this.http.get(this.prefix + `tasks/${taskExec.id}`)
                .map(res => {
                    taskExec.setResult(res["result"]);
                    return taskExec;
                })
                .catch(e => this.handleError(e));
        }
    }

    /**
     * url: /actions_executions/<action_execution_id>
     * This call will patch the missing 'output' value on task action execution
     */
    patchActionExecutionOutput(actionExecution: ActionExecution) {
        if (actionExecution.output != null) {
            return Observable.of(actionExecution);
        } else {
            return this.http.get(this.prefix + `action_executions/${actionExecution.id}`)
                .map(res => actionExecution.output = res["output"])
                .catch(e => this.handleError(e));
        }
    }

    /**
     * This call will patch the missing 'output' value on sub-workflow execution.
     */
    patchSubWorfklowExecutionOutput(subWfExecution: SubWorkflowExecution) {
        if (subWfExecution.output != null) {
            return Observable.of(subWfExecution);
        } else {
            return this.execution(subWfExecution.id)
                .map(execution => subWfExecution.output = execution.output)
                .catch(e => this.handleError(e));
        }
    }

    /**
     * url: /tasks/<taskExecutionId>/action_executions
     */
    actionExecutions(taskExecId: string): Observable<ActionExecution[]> {
        return this.http.get(this.prefix + `tasks/${taskExecId}/action_executions`)
            .map(res => res["action_executions"])
            .catch(e => this.handleError(e));
    }

    /**
     * url: /executions/?task_execution_id=<id>
     * retrieve the sub-workflow execution details
     */
    wfExecutionsByTaskExecutionId(taskExecId: string): Observable<any[]> {
        const params = toUrlParams({task_execution_id: taskExecId});
        return this.http.get(this.prefix + "executions", {params})
            .map(res => res["executions"])
            .catch(e => this.handleError(e));
    }
}
