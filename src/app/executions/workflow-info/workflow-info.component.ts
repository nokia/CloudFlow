// Copyright (C) 2017 Nokia

import {Component, OnDestroy, OnInit} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution} from "../../shared/models/execution";
import {Subscription} from "rxjs/Subscription";
import {CodeMirrorModalService} from "../../shared/components/codemirror/codemirror-modal.service";
import {InfoItemProperty} from "../info-item/info-item.component";

@Component({
    selector: 'cf-workflow-info',
    templateUrl: './workflow-info.component.html',
    styleUrls: ['./workflow-info.component.scss']
})
export class WorkflowInfoComponent implements OnInit, OnDestroy {

    // render UI based on this properties list.
    // key = the attribute on the component (i.e. execution.created_at)
    // renderType = to draw a badge, codemirror element, etc...
    static readonly Properties: InfoItemProperty[] = [
        {key: "workflow_name", display: "Workflow Name"},
        {key: "state", display: "State", renderType: "badge"},
        {key: "id", display: "Execution ID"},
        {key: "workflow_id", display: "Workflow ID"},
        {key: "created_at", display: "Started"},
        {key: "updated_at", display: "Ended"},
        {key: "state_info", display: "State Info", renderType: "code", mode: "text"},
        {key: "input", display: "Input", renderType: "code", mode: "json"},
        {key: "output", display: "Output", renderType: "code", mode: "json"},
        {key: "params", display: "Params", renderType: "code", mode: "json"},
    ];

    private subscription: Subscription;

    properties: {[key: string]: InfoItemProperty} = {};
    execution: Execution;

    constructor(private service: MistralService, public cmModal: CodeMirrorModalService) {}

    ngOnInit() {
        // wait for selectedExecution to be set on the service
        this.subscription = this.service.selectedExecution.subscribe(execution => {
            this.execution = execution;
            if (execution) {
                WorkflowInfoComponent.Properties.forEach(prop => {
                    this.properties[prop.key] = {...prop, value: execution[prop.key]};
                });
            } else {
                this.properties = {};
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
