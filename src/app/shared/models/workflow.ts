// Copyright (C) 2017 Nokia

import * as jsyaml from "js-yaml";
import {CommonFields} from "./common";
import {TaskDef} from "./task";

/**
 * Workflow structure from API response
 */
export interface JWorkflow extends CommonFields {
    name: string;
    tags: string[];
    scope: string;
    input: string;
    project_id: string;
    definition: string | IWorkflowDef;
}

/**
 * Workflow Definition structure
 */
export interface IWorkflowDef {
    tasks: {[workflow_name: string]: TaskDef[]};
}


export class WorkflowDef {
    private workflowName: string;
    definition: IWorkflowDef;

    constructor(definition: string, workflowName: string) {
        this.definition = jsyaml.safeLoad(definition);

        if (!(workflowName in this.definition)) {
            // workflow name may describe nested wf (contains dots)
            const normalizedName = workflowName.split(".");
            this.workflowName = normalizedName[normalizedName.length - 1];
        } else {
            this.workflowName = workflowName;
        }
    }

    /**
     * Get the task definition part from the Workflow definition
     * @param {String} taskName
     * @returns {TaskDef[]}
     */
    getTaskDef(taskName: string): TaskDef {
        return this.definition[this.workflowName].tasks[taskName];
    }
}
