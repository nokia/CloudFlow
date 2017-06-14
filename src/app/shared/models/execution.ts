import {CommonFields, ExecutionState} from "./common";

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

    constructor(other: JExecution) {
        Object.assign(this, other);
        this.params = JSON.parse(this.params as string);
        this.output = JSON.parse(this.output as string);
        this.input = JSON.parse(this.input as string);
    }

}
