// Copyright (C) 2017 Nokia

import {Component, OnDestroy, OnInit} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution} from "../../shared/models";
import {Subscription} from "rxjs/Subscription";
import {CodeMirrorModalService} from "../../shared/components/codemirror/codemirror-modal.service";
import {getPropTimeout, InfoItemProperty} from "../info-item/info-item.component";

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
        {key: "created_at", display: "Created"},
        {key: "updated_at", display: "Updated"},
        {key: "duration", display: "Duration"},
        {key: "state_info", display: "State Info", renderType: "code", mode: "text"},
        {key: "input", display: "Input", renderType: "code", mode: "json"},
        {key: "output", display: "Output", renderType: "code", mode: "json"},
        {key: "params", display: "Params", renderType: "code", mode: "json"},
    ];

    private subscription: Subscription;

    properties: {[key: string]: InfoItemProperty} = {};
    execution: Execution;

    ngOnInit() {
        // Due to https://github.com/angular/angular/issues/17473,
        // the subscription is in the constructor.
        // Once solved, should move it back here.
    }

    constructor(private service: MistralService, public cmModal: CodeMirrorModalService) {
        // wait for selectedExecution to be set on the service
        this.subscription = this.service.selectedExecution.subscribe(execution => {
            this.execution = execution;
            if (execution) {
                WorkflowInfoComponent.Properties.forEach(this.drawProp.bind(this));
            } else {
                this.properties = {};
            }
        });
    }

    private drawProp(prop: InfoItemProperty) {
        // defer drawing of 'code' components (due to UI excessive redraws)
        const timeout = getPropTimeout(prop);

        setTimeout(() => this.properties[prop.key] = {...prop, value: this.execution[prop.key]}, timeout);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
