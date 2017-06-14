export type ExecutionState = "SUCCESS" | "ERROR" | "IDLE" | "RUNNING";

export interface CommonFields {
    id: string;
    created_at: string;
    updated_at: string;
}
