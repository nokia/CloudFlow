// Copyright (C) 2018 Nokia

import {Component, Input, OnInit} from '@angular/core';
import {Execution, TaskExec} from "../../shared/models";
import * as moment from 'moment';

interface TaskProgress {
    id: string;
    name: string;
    created_at_relative: number;
    duration_sec: number;
    barWidth: number;
    preBarWidth: number;
    backgroundColor: string;
    duration: string;
}

function getMixedColor({color1 = '#e74c3c', color2 = '#2ecc71', weight = 0.5}) {
    // https://gist.github.com/jedfoster/7939513
    const d2h = (d) => d.toString(16);
    const h2d = (h) => parseInt(h, 16);
    const strip = (hexColor) => hexColor.substr(hexColor.indexOf("#") + 1);

    color1 = strip(color1);
    color2 = strip(color2);

    let color = "";

    for (let i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairsred, green, and blue
        const v1 = h2d(color1.substr(i, 2)), // extract the current pairs
            v2 = h2d(color2.substr(i, 2));

        // combine the current pairs from each source color, according to the specified weight
        let val = d2h(Math.floor(v2 + (v1 - v2) * weight));

        // prepend a '0' if val results in a single digit
        val = val.padStart(2, "0");

        color += val; // concatenate val to our new color string
    }

    return "#" + color;
}

function noramlize(arr): number[] {
    const max = Math.max(...arr),
        min = Math.min(...arr),
        len = arr.length;
    if (max === min) {
        return Array(len).fill(1 / len);
    } else {
        return arr.map(i => (i - min) / (max - min));
    }
}

function timeDiff(t1: string, t2: string, diffUnit: moment.unitOfTime.Diff = "seconds") {
    return moment(t1).diff(t2, diffUnit);
}


@Component({
    selector: 'cf-tasks-runtime',
    templateUrl: './tasks-runtime.component.html',
    styleUrls: ['./tasks-runtime.component.scss']
})
export class TasksRuntimeComponent implements OnInit {

    @Input() tasks: TaskExec[];
    @Input() execution: Execution;
    graphModel: TaskProgress[] = [];

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
                created_at_relative: timeDiff(task.created_at, workflowStarted, 'seconds'),
                duration_sec: task.taskDuration.duration_sec,
                duration: task.taskDuration.duration,
                barWidth: 0,
                preBarWidth: 0,
                backgroundColor: 'fff'
            };
        }).sort((t1, t2) => t1.created_at_relative - t2.created_at_relative);
    }

    /**
     * Calculate and create the data model of the relative runtimes.
     * Each task is assigned a "relative created_at time" based on workflow's created_at time. This will position
     *  the task's graph start point relative to its start time.
     * The task's duration (in seconds) will determine the width of the graph itself.
     *
     * Each task will be colored in a color from green (the fastest) to red (the slowest).
     * A task with a runtime == 0 will set it's graph width to 1% (for visibility purposes).
     * @param {Execution} execution
     * @param {TaskExec[]} tasks
     */
    calculateTimes(execution: Execution, tasks: TaskExec[]) {
        const workflowStarted = execution.created_at;
        const workflowDurationSec = execution.executionDuration.duration_sec;

        this.graphModel = this.createGraphModel(tasks, workflowStarted);

        // normalize the run times to values in [0..1]. This will help to mix the colors (green -> red)
        const normalized = noramlize(this.graphModel.map(t => t.duration_sec));

        this.graphModel.forEach((t, index) => {
            // set the graph's background color
            t.backgroundColor = getMixedColor({weight: normalized[index]});

            // set the graph's width
            const barWidth = (t.duration_sec / workflowDurationSec) * 100;
            t.barWidth = barWidth || 1;

            // set the position of the task
            let preBarWidth = (t.created_at_relative / workflowDurationSec) * 100;
            if (preBarWidth === 100) {
                // Edge case when the *last* task(s) runtime is 0.
                // Need to decrease the pre-highlight width to 99 (since a task running in 0 time will get width of 1%)
                preBarWidth = 99;
            }
            t.preBarWidth = preBarWidth;
        });
    }

    trackByTaskId(index, task: TaskProgress) {
        return task.id;
    }

}
