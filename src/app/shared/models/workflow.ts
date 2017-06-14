import * as jsyaml from "js-yaml";
import {CommonFields} from "./common";
import {TaskDef} from "./task";

export interface JWorkflow extends CommonFields {
    name: string;
    tags: string[];
    scope: string;
    input: string;
    project_id: string;
    definition: string | IWorkflowDef;
}

export interface IWorkflowDef {
    tasks: {[workflow_name: string]: TaskDef[]};
}


export class WorkflowDef {
    definition: IWorkflowDef;

    constructor(definition: string) {
        let asJson = jsyaml.safeLoad(definition);
        // remove the workflow name from the definition
        asJson = asJson[Object.keys(asJson)[0]];

        this.definition = asJson;
    }

    getTaskDef(taskName: string): TaskDef {
        return this.definition.tasks[taskName];
    }
}
