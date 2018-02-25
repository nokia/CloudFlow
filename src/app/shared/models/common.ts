// Copyright (C) 2017 Nokia

import * as moment from "moment";

export type ExecutionState = "SUCCESS" | "ERROR" | "IDLE" | "RUNNING" | "PAUSED" | "CANCELLED" | "WAITING";
export const NonWaitingStates = new Set<String>(["SUCCESS", "ERROR", "CANCELLED"]);

export interface CommonFields {
    id: string;
    created_at: string;
    updated_at: string;
}

export class ItemDuration {
    duration_sec: number;
    duration: string;

    constructor(private created_at: string, private updated_at: string) {
        if (this.updated_at && this.created_at) {
            const diffMs: number = moment(this.updated_at).diff(this.created_at); // diff in milliseconds
            this.duration = moment.utc(diffMs).format("HH:mm:ss"); // formatted string
            this.duration_sec = diffMs / 1000; // diff in seconds
            if (this.duration_sec === 0) {
                this.duration = "< 1 second";
            }
        } else {
            this.duration = "";
            this.duration_sec = 0;
        }
    }
}
