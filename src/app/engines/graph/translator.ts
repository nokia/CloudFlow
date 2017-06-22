// Copyright (C) 2017 Nokia

import {RuntimeContext, TaskExec} from "../../shared/models/taskExec";

/**
 * Convert on-<x> events to match state values (i.e. on-success -> SUCCESS)
 * @param event
 * @returns {string}
 */
export function toStateName(event: string) {
    return event.split("-")[1].toUpperCase();
}

/**
 * Convert Mistral's Task Executions to the graph library format
 * @param tasks
 */
export function toGraphData(tasks: TaskExec[]) {
    return {
        nodes: tasks,
        edges: tasks.filter(task => Object.keys(task.runtime_context).length)
            .map(task => {
                const context: RuntimeContext = task.runtime_context as RuntimeContext;
                return {
                    source: context.triggered_by[0].task_id,
                    target: task.id,
                    state: toStateName(context.triggered_by[0].event)
                }
            })
    };
}
