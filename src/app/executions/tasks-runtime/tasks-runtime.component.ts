// Copyright (C) 2018 Nokia

import {Component, Input, OnInit} from '@angular/core';
import {Execution, TaskExec, ExecutionState} from "../../shared/models";
import * as moment from 'moment';

interface TaskProgress {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    created_at_relative: number;
    duration_sec: number;
    barWidth: number;
    preBarWidth: number;
    duration: string;
    state: ExecutionState;
}

function timeDiff(t1: string, t2: string, diffUnit: moment.unitOfTime.Diff = "seconds") {
    return moment(t1).diff(t2, diffUnit);
}

const CREATED_AT_RELATIVE = "created_at_relative";
const DURATION_SEC = "duration_sec";

@Component({
    selector: 'cf-tasks-runtime',
    templateUrl: './tasks-runtime.component.html',
    styleUrls: ['./tasks-runtime.component.scss']
})
export class TasksRuntimeComponent implements OnInit {

    @Input() tasks: TaskExec[];
    @Input() execution: Execution;
    graphModel: TaskProgress[] = [];
    filter: '';

    readonly CREATED_AT_RELATIVE = CREATED_AT_RELATIVE;
    readonly DURATION_SEC = DURATION_SEC;

    private sort = {by: CREATED_AT_RELATIVE, dir: 'asc'};

    constructor() {
    }

    ngOnInit(): void {
        this.calculateTimes(this.execution, this.tasks);
    }

    private createGraphModel(tasks: TaskExec[], workflowStarted: string) {
        return tasks.map(task => {
            return {
                id: task.id,
                name: task.name,
                created_at: task.created_at,
                updated_at: task.updated_at,
                created_at_relative: timeDiff(task.created_at, workflowStarted, 'seconds'),
                duration_sec: task.taskDuration.duration_sec,
                duration: task.taskDuration.duration,
                barWidth: 0,
                preBarWidth: 0,
                state: task.state
            };
        }).sort((t1, t2) => t1.created_at_relative - t2.created_at_relative);
    }

    /**
     * Calculate and create the data model of the relative runtimes.
     * Each task is assigned a "relative created_at time" based on workflow's created_at time. This will position
     *  the task's graph start point relative to its start time.
     * The task's duration (in seconds) will determine the width of the graph itself.
     *
     * A task with a runtime == 0 will set it's graph width to 1% (for visibility purposes).
     * @param {Execution} execution
     * @param {TaskExec[]} tasks
     */
    calculateTimes(execution: Execution, tasks: TaskExec[]) {
        const workflowStarted = execution.created_at;
        const workflowDurationSec = execution.executionDuration.duration_sec;

        this.graphModel = this.createGraphModel(tasks, workflowStarted);

        this.graphModel.forEach((task) => {

            // set the graph's width
            const barWidth = (task.duration_sec / workflowDurationSec) * 100;
            task.barWidth = barWidth || 1;

            // set the position of the task
            let preBarWidth = (task.created_at_relative / workflowDurationSec) * 100;
            if (preBarWidth === 100) {
                // Edge case when the *last* task(s) runtime is 0.
                // Need to decrease the pre-highlight width to 99 (since a task running in 0 time will get width of 1%)
                preBarWidth = 99;
            }
            task.preBarWidth = preBarWidth;
        });
    }

    getSortClass(attr: string) {
        if (this.sort.by === attr) {
            return `attr-sort-${this.sort.dir}`;
        } else {
            return 'attr-sortable';
        }
    }

    sortBy(attr: string) {
        if (attr === this.sort.by) {
            this.sort.dir = this.sort.dir === "asc" ? "desc" : "asc";
        }
        this.sort.by = attr;
        const sortDir = this.sort.dir === "asc" ? 1 : -1;
        this.graphModel = this.graphModel.sort((t1, t2) => {
            return (sortDir) * (t1[attr] - t2[attr]);
        });
    }

    trackByTaskId(index, task: TaskProgress) {
        return task.id;
    }

}
