// Copyright (C) 2017 Nokia

import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {NgbPanelChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {MistralService} from "../../../engines/mistral/mistral.service";
import {ActionExecution} from "../../../shared/models/action";
import "rxjs/add/operator/toPromise";

@Component({
    selector: 'cf-action-executions-info',
    templateUrl: './action-executions-info.component.html',
    styleUrls: ['./action-executions-info.component.scss']
})
export class ActionExecutionsInfoComponent implements OnChanges {
    @Input() taskExecutionId: string;
    actionExecutions = [];

    constructor(private service: MistralService) {
    }

    private async loadActionExecutions(taskExecutionId: string) {
        this.actionExecutions = await this.service.actionExecutions(taskExecutionId).toPromise();
    }

    /**
     * Fetch the 'output' value of the given action execution
     * @param actionExecution
     */
    private patchActionExecutionOutput(actionExecution: ActionExecution) {
        this.service.patchActionExecutionOutput(actionExecution).subscribe(() => {});
    }

    ngOnChanges(changes: SimpleChanges) {
        this.loadActionExecutions(changes['taskExecutionId'].currentValue);
    }

    /**
     * When opening an action execution tab, fetch the missing info of the action
     * @param {Number} panelId - index of the action execution
     * @param {Boolean} nextState - is the panel opened (true) or closed (false)
     */
    panelChanged({panelId, nextState}: NgbPanelChangeEvent) {
        if (nextState /* panel opened */) {
            this.patchActionExecutionOutput(this.actionExecutions[panelId]);
        }
    }

}
