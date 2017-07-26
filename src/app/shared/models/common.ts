// Copyright (C) 2017 Nokia

export type ExecutionState = "SUCCESS" | "ERROR" | "IDLE" | "RUNNING" | "PAUSED" | "CANCELLED";

export interface CommonFields {
    id: string;
    created_at: string;
    updated_at: string;
}
