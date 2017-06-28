// Copyright (C) 2017 Nokia

import {RuntimeContext, TaskExec} from "../../shared/models/taskExec";

/**
 * Convert on-<x> events to match state values (i.e. on-success -> SUCCESS)
 * @param event
 * @returns {string}
 */
function toStateName(event: string) {
    return event.split("-")[1].toUpperCase();
}

function _toGraphNodes(tasks: TaskExec[]) {
    return tasks;
}

function _toGraphEdges(tasks: TaskExec[]) {
    return tasks
        .filter(task => Object.keys(task.runtime_context).length)
        .map(task => {
                const context: RuntimeContext = task.runtime_context as RuntimeContext;
                return context.triggered_by.map(trigger => ({
                        source: trigger.task_id,
                        target: task.id,
                        state: toStateName(trigger.event)
                    })
                )
            }
        ).reduce((a, b) => a.concat(b), []);
}

/**
 * Convert Mistral's Task Executions to the graph library format
 * @param tasks
 */
export function toGraphData(tasks: TaskExec[]) {
    return {
        nodes: _toGraphNodes(tasks),
        edges: _toGraphEdges(tasks)
    };
}
