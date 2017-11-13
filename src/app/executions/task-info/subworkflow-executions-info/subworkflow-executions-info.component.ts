// Copyright (C) 2017 Nokia

import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {MistralService} from "../../../engines/mistral/mistral.service";
import "rxjs/add/operator/toPromise";
import {NgbPanelChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {SubWorkflowExecution} from "../../../shared/models";

@Component({
    selector: 'cf-subworkflow-executions-info',
    templateUrl: './subworkflow-executions-info.component.html',
    styleUrls: ['./subworkflow-executions-info.component.scss']
})
export class SubworkflowExecutionsInfoComponent implements OnChanges {
    @Input() taskExecId: string;
    subWfExecutions: SubWorkflowExecution[] = null;

    constructor(private service: MistralService, private router: Router) {

    }

    /**
     * For task of type "Workflow"- load the sub workflow executions
     * @param taskExecId
     */
    private async loadWfExecutionsByTaskExecutionId(taskExecId: string) {
        this.subWfExecutions = await this.service.wfExecutionsByTaskExecutionId(taskExecId).toPromise();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.subWfExecutions = null;
        this.loadWfExecutionsByTaskExecutionId(changes['taskExecId'].currentValue);
    }

    executionTrackBy(index: number, execution: any) {
        return `${execution.id}_${execution.state}`;
    }

    /**
     * When opening an action execution tab, fetch the missing info of the action
     * @param {Number} panelId - index of the action execution
     * @param {Boolean} nextState - is the panel opened (true) or closed (false)
     */
    panelChanged({panelId, nextState}: NgbPanelChangeEvent) {
        if (nextState /* panel opened */) {
            this.service.patchSubWorkflowExecutionOutput(this.subWfExecutions[panelId]).subscribe(() => {});
        }
    }

    goToExecution(e, executionId: string) {
        e.stopPropagation();
        this.router.navigate(['/executions', executionId]);
        return false;
    }

}
