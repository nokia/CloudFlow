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
    definition: IWorkflowDef;

    constructor(definition: string, workflowName: string) {
        const asJson = jsyaml.safeLoad(definition);

        if (workflowName in asJson) {
            this.definition = asJson[workflowName];
        } else {
            // workflow name may describe nested wf (contains dots)
            const normalizeName = workflowName.split(".");
            const actualName = normalizeName[normalizeName.length - 1];
            this.definition = asJson[actualName];
        }
    }

    /**
     * Get the task definition part from the Workflow definition
     * @param {String} taskName
     * @returns {TaskDef[]}
     */
    getTaskDef(taskName: string): TaskDef {
        return this.definition.tasks[taskName];
    }
}
