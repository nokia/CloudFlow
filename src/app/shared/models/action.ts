// Copyright (C) 2017 Nokia

import {CommonFields, ExecutionState} from "./common";

export interface ActionExecution extends CommonFields {
    state_info: string;
    name: string;
    tags: any[] | null;
    workflow_name: string;
    task_execution_id: string;
    state: ExecutionState;
    task_name: string;
    input: string | object;
    output: string | object;
    accepted: boolean;
    description: string;
}
