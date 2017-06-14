import {Component, OnDestroy, OnInit} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution} from "../../shared/models/execution";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'cf-workflow-info',
    templateUrl: './workflow-info.component.html',
    styleUrls: ['./workflow-info.component.scss']
})
export class WorkflowInfoComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    execution: Execution;

    constructor(private service: MistralService) {}

    ngOnInit() {
        this.subscription = this.service.selectedExecution.subscribe(execution => this.execution = execution);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
