// Copyright (C) 2018 Nokia

import {Component, Input, OnInit} from '@angular/core';
import {Execution, TaskExec, ExecutionState} from "../../shared/models";
import * as moment from 'moment';

interface TaskProgress {
    id: string;
    name: string;
    started_at: string;
    finished_at: string;
    created_at_relative: number;
    started_at_relative: number;
    finished_at_relative: number;
    duration_sec: number;
    preBarWidth: number;
    waitingBeforeBarWidth: number;
    runningBarWidth: number;
    waitingAfterBarWidth: number;
    totalBarWidth: number;
    duration: string;
    state: ExecutionState;
}

function timeDiff(t1: string, t2: string, diffUnit: moment.unitOfTime.Diff = "seconds") {
    return moment(t1).diff(t2, diffUnit);
}

const STARTED_AT_RELATIVE = "started_at_relative";
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

    readonly STARTED_AT_RELATIVE = STARTED_AT_RELATIVE;
    readonly DURATION_SEC = DURATION_SEC;

    private sort = {by: STARTED_AT_RELATIVE, dir: 'asc'};

    ngOnInit(): void {
        this.calculateTimes(this.execution, this.tasks);
    }

    private createGraphModel(tasks: TaskExec[], workflowStarted: string) {
        return tasks.map(task => {

            const {created_at, updated_at, started_at, finished_at} = task;

            return {
                id: task.id,
                name: task.name,
                started_at: started_at,
                finished_at: finished_at,
                created_at_relative: timeDiff(created_at, workflowStarted, 'seconds'),
                started_at_relative: timeDiff(started_at, created_at, 'seconds'),
                finished_at_relative: timeDiff(updated_at, finished_at, 'seconds'),
                duration_sec: task.taskDuration.duration_sec,
                duration: task.taskDuration.duration,
                preBarWidth: 0,
                waitingBeforeBarWidth: 0,
                runningBarWidth: 0,
                waitingAfterBarWidth: 0,
                totalBarWidth: 0,
                state: task.state
            };
        }).sort((t1, t2) => t1.started_at_relative - t2.started_at_relative);
    }

    /**
     * Calculate and create the data model of the relative runtimes.
     * Each task is assigned several "relative changing state times" based on workflow's time measures.
     * This will position the task's graph start and waiting points relative to its start time.
     * The task's duration (in seconds) will determine the width of the graph itself.
     *
     * A task with a runtime == 0 will set it's graph width to 1% (for visibility purposes).
     * @param {Execution} execution
     * @param {TaskExec[]} tasks
     */
    calculateTimes(execution: Execution, tasks: TaskExec[]) {
        const workflowStarted = execution.created_at;
        const workflowDurationSec = execution.executionDuration.duration_sec;

        const graphModel = this.createGraphModel(tasks, workflowStarted);

        graphModel.forEach((task) => {

            // set the position of the task
            let preBarWidth = (task.created_at_relative / workflowDurationSec) * 100;
            if (preBarWidth === 100) {
                // Edge case when the *last* task(s) runtime is 0.
                // Need to decrease the pre-highlight width to 99 (since a task running in 0 time will get width of 1%)
                preBarWidth = 99;
            }
            task.preBarWidth = preBarWidth;

            task.waitingBeforeBarWidth = (task.started_at_relative / workflowDurationSec) * 100;

            // set the graph's width
            const runningBarWidth = (task.duration_sec / workflowDurationSec) * 100;
            task.runningBarWidth = runningBarWidth || 1;

            task.waitingAfterBarWidth = (task.finished_at_relative / workflowDurationSec) * 100;

            task.totalBarWidth = task.waitingBeforeBarWidth + runningBarWidth + task.waitingAfterBarWidth;
        });

        this.graphModel = graphModel;
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
