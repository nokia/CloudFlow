// Copyright (C) 2017 Nokia

import {RuntimeContext, TaskExec} from "../../shared/models/taskExec";
import {ExecutionState} from "../../shared/models/common";

export interface GraphEdge {
    source: string;
    target: string;
    state: ExecutionState;
}

const OnEvent = /^on-(.*)/;

/**
 * Convert on-<x> events to match state values (i.e. on-success -> SUCCESS)
 * @param event
 * @returns {string}
 */
function eventToStateName(event: string): ExecutionState {
    return event.match(OnEvent)[1].toUpperCase() as ExecutionState;
}

function _toGraphNodes(tasks: TaskExec[]) {
    return tasks;
}

function hasValidRuntimeContext(task: TaskExec): boolean {
    return Object.keys(task.runtime_context).length > 0 &&
        task.runtime_context.hasOwnProperty("triggered_by");
}

function hasValidEvent(triggerItem): boolean {
    return triggerItem.event && OnEvent.test(triggerItem.event);
}

function _toGraphEdges(tasks: TaskExec[]): GraphEdge[] {
    return tasks
        .filter(hasValidRuntimeContext)
        .map(task => {
                const context: RuntimeContext = task.runtime_context as RuntimeContext;
                return context.triggered_by.filter(hasValidEvent).map(trigger => ({
                        source: trigger.task_id,
                        target: task.id,
                        state: eventToStateName(trigger.event)
                    })
                );
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
