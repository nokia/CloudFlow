// Copyright (C) 2017 Nokia

import {CommonFields, ExecutionState, ItemDuration, NonWaitingStates} from "./common";
import {stringToObject} from "../utils";

export interface JExecution extends CommonFields {
    state_info: null | string;
    description: string;
    state: ExecutionState;
    workflow_name: string;
    workflow_id: string;
    task_execution_id: null | string;
    params: string | object;
    output: string | object;
    input: string | object;
}

export class Execution implements JExecution {
    state_info: any | string;
    description: string;
    state: ExecutionState;
    workflow_name: string;
    workflow_id: string;
    task_execution_id: any | string;
    params: string | Object;
    output: string | Object;
    input: string | Object;
    id: string;
    created_at: string;
    updated_at: string;

    // Denote if execution run has finished
    done = false;

    // will hold the ID of the parent execution when task_execution_id is not null
    parentExecutionId: string | null = null;

    executionDuration: ItemDuration;

    constructor(other: JExecution) {
        Object.assign(this, other);
        this.params = stringToObject(this.params, "json");
        this.output = stringToObject(this.output, "json");
        this.input = stringToObject(this.input, "json");
        this.done = NonWaitingStates.has(this.state);
        this.executionDuration = new ItemDuration(this.created_at, this.updated_at);
    }

    get duration() {
        return this.executionDuration.duration;
    }
}
