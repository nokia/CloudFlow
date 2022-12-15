// Copyright (C) 2017 Nokia

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of as ObservableOf, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

import {ActionExecution, Execution, SubWorkflowExecution, TaskDef, TaskExec, WorkflowDef} from "../../shared/models";
import {toUrlParams, toHTTPHeaders} from "../../shared/utils";
import {NonWaitingStates} from "../../shared/models/common";

@Injectable()
export class MistralService {
    protected prefix = "api/";

    selectedExecution = new BehaviorSubject<Execution>(null);
    selectedExecutionTasks = new BehaviorSubject<TaskExec[]>(null);
    selectedTask = new BehaviorSubject<{task: TaskExec, taskDef: TaskDef}>(null);

    constructor(protected http: HttpClient) {
    }

    handleError(e) {
        console.error(e);
        return throwError(e);
    }

    /**
     * url: /executions?<query_params>
     */
    executions(sortBy="created_at", sortByDir="desc", marker=""): Observable<{executions: Execution[], next?: string}> { /*tslint:disable-line*/
        let headers = toHTTPHeaders({
            Accept: "application/json"
        });

        let params = toUrlParams({
            limit: 100,
            fields: "workflow_name,created_at,state,task_execution_id,updated_at",
            sort_keys: `${sortBy},name`,
            sort_dirs: `${sortByDir}`
        });

        if (marker) {
            params = params.append("marker", marker);
        }

        return this.http.get<any>(this.prefix + "executions", {params, headers})
            .pipe(
                catchError(e => this.handleError(e))
            );
    }

    /**
     * url: /executions/<id>
     */
    execution(id: string): Observable<Execution> {
        let headers = toHTTPHeaders({
            Accept: "application/json"
        });

        return this.http.get(this.prefix + "executions/" + id, {headers})
            .pipe(
                map((res: Execution) => {
                    const execution = new Execution(res);
                    this.selectedExecution.next(execution);
                    return execution;
                }),
                catchError(e => this.handleError(e))
            );
    }

    /**
     * url: /executions/<id>/tasks
     */
    executionTasks(id: string): Observable<TaskExec[]> {
        const fields = ["state_info", "created_at", "name", "runtime_context", "workflow_name", "state",
            "updated_at", "workflow_execution_id", "workflow_id", "type", "started_at", "finished_at"].join(",");
        const params = toUrlParams({fields});

        let headers = toHTTPHeaders({
            Accept: "application/json"
        });

        return this.http.get(this.prefix + `executions/${id}/tasks`, {params, headers})
            .pipe(
                map(res => res["tasks"]),
                map(res => {
                    const tasks = res.map(task => new TaskExec(task));
                    this.selectedExecutionTasks.next(tasks);
                    return tasks;
                }),
                catchError(e => this.handleError(e))
            );
    }

    /**
     * url: /workflows/<id>
     * Extract the definition
     */
    workflowDef(id: string): Observable<WorkflowDef> {
        let headers = toHTTPHeaders({
            Accept: "application/json"
        });

        return this.http.get(this.prefix + `workflows/${id}`, {headers})
            .pipe(
                map(res => new WorkflowDef(res["definition"], res["name"])),
                catchError(e => ObservableOf(WorkflowDef.FromEmpty()))
            );
    }

    setParentExecutionId(execution: Execution): void {
        if (execution.task_execution_id) {
            let headers = toHTTPHeaders({
                Accept: "application/json"
            });

            this.http.get(this.prefix + `tasks/${execution.task_execution_id}`, {headers})
                .pipe(
                    map((res: TaskExec) => execution.parentExecutionId = res.workflow_execution_id),
                    catchError(e => this.handleError(e))
                )
                .subscribe(() => {});

        }
    }

    /**
     * url: /tasks/<taskExecId>
     * This call will patch the "missing" 'result' value on a task execution.
     */
    patchTaskExecutionData(taskExec: TaskExec) {
        if (taskExec.result != null) {
            return ObservableOf(taskExec);
        } else {
            let headers = toHTTPHeaders({
                Accept: "application/json"
            });

            return this.http.get(this.prefix + `tasks/${taskExec.id}`, {headers})
                .pipe(
                    map(res => {
                        taskExec.setResult(res["result"]);
                        taskExec.setPublished(res["published"]);
                        return taskExec;
                    }),
                    catchError(e => this.handleError(e))
                );
        }
    }

    /**
     * url: /actions_executions/<action_execution_id>
     * This call will patch the missing 'output' value on task action execution
     */
    patchActionExecutionOutput(actionExecution: ActionExecution): Observable<ActionExecution> {
        if (NonWaitingStates.has(actionExecution.state) && actionExecution.output != null) {
            // when action execution is done, no need to re-fetch its data
            return ObservableOf(actionExecution);
        } else {
            return this.getActionExecution(actionExecution.id)
                .pipe(
                    map(res => {
                        actionExecution.input = res["input"];
                        actionExecution.output = res["output"];
                        actionExecution.state_info = res["state_info"];
                        return actionExecution;
                    }),
                    catchError(e => this.handleError(e))
                );
        }
    }

    /**
     * This call will patch the missing 'output' value on sub-workflow execution.
     */
    patchSubWorkflowExecutionOutput(subWfExecution: SubWorkflowExecution) {
        if (NonWaitingStates.has(subWfExecution.state) && subWfExecution.output != null) {
            return ObservableOf(subWfExecution);
        } else {
            return this.execution(subWfExecution.id)
                .pipe(
                    map(execution => {
                        subWfExecution.state_info = execution["state_info"];
                        subWfExecution.input = execution["input"];
                        subWfExecution.output = execution["output"];
                        return subWfExecution;
                    }),
                    catchError(e => this.handleError(e))
                );
        }
    }

    /**
     * url: /tasks/<taskExecutionId>/action_executions
     */
    actionExecutions(taskExecId: string): Observable<ActionExecution[]> {
        const params = toUrlParams({fields: "name,state,created_at,updated_at"});

        let headers = toHTTPHeaders({
            Accept: "application/json"
        });

        return this.http.get(this.prefix + `tasks/${taskExecId}/action_executions`, {params, headers})
            .pipe(
                map(res => res["action_executions"]),
                catchError(e => this.handleError(e))
            );
    }

    /**
     * url: /executions/?task_execution_id=<id>
     * retrieve the sub-workflow execution details
     */
    wfExecutionsByTaskExecutionId(taskExecId: string): Observable<any[]> {
        const params = toUrlParams({task_execution_id: taskExecId, fields: "state,workflow_name,created_at,updated_at"});

        let headers = toHTTPHeaders({
            Accept: "application/json"
        });

        return this.http.get(this.prefix + "executions", {params, headers})
            .pipe(
                map(res => res["executions"]),
                catchError(e => this.handleError(e))
            );
    }

    /**
     * url: /tasks/<task_id>
     */
    getTask(taskId: string): Observable<TaskExec> {
        let headers = toHTTPHeaders({
            Accept: "application/json"
        });

        return this.http.get<any>(this.prefix + `tasks/${taskId}`, {headers})
            .pipe(
                catchError(e => this.handleError(e))
            );
    }

    /**
     * url: /action_executions/<action_execution_id>
     */
    getActionExecution(actionExecutionId: string): Observable<ActionExecution> {
        let headers = toHTTPHeaders({
            Accept: "application/json"
        });

        return this.http.get<any>(this.prefix + `action_executions/${actionExecutionId}`, {headers})
            .pipe(
                catchError(e => this.handleError(e))
            );
    }
}
