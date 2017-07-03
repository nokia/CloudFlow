// Copyright (C) 2017 Nokia

import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {MistralService} from "../../../engines/mistral/mistral.service";
import "rxjs/add/operator/toPromise";

@Component({
    selector: 'cf-subworkflow-executions-info',
    templateUrl: './subworkflow-executions-info.component.html',
    styleUrls: ['./subworkflow-executions-info.component.scss']
})
export class SubworkflowExecutionsInfoComponent implements OnChanges {
    @Input() taskExecId: string;
    subWfExecutions: any[];

    constructor(private service: MistralService) {

    }

    /**
     * For task of type "Workflow"- load the sub workflow executions
     * @param taskExecId
     */
    private async loadWfExecutionsByTaskExecutionId(taskExecId: string) {
        this.subWfExecutions = await this.service.wfExecutionsByTaskExecutionId(taskExecId).toPromise();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.loadWfExecutionsByTaskExecutionId(changes['taskExecId'].currentValue);
    }

}
