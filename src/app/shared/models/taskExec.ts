import {CommonFields, ExecutionState} from "./common";
import * as moment from "moment";

export interface RuntimeContext {
    triggered_by?: {
        event: string; task_id: string;
    }[];
}

export interface JStackExec extends CommonFields {
    name: string;
    runtime_context: string | object;
    workflow_name: string;
    state_info: string;
    state: ExecutionState;
    workflow_execution_id: string;
    workflow_id: string;
    processed: boolean;
    published: string | object;
    type: "ACTION" | "WORKFLOW";
}

export interface TaskDrawing {
    top: number;
    left: number;
}

export class TaskExec implements JStackExec, TaskDrawing {
    name: string;
    runtime_context: string | RuntimeContext;
    workflow_name: string;
    state: ExecutionState;
    workflow_execution_id: string;
    workflow_id: string;
    processed: boolean;
    published: string | Object;
    type;
    id: string;
    created_at: string;
    updated_at: string;
    duration: string;
    state_info: string;

    // used to set position after graph calculation
    top = 0;
    left = 0;

    constructor(other: JStackExec) {
        Object.assign(this, other);
        this.published = JSON.parse(this.published as string);
        this.runtime_context = JSON.parse(this.runtime_context as string);
        this.duration = moment.utc(moment(this.updated_at).diff(this.created_at)).format("HH:mm:ss");
    }
}
