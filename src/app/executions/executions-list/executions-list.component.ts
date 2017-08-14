// Copyright (C) 2017 Nokia

import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution} from "../../shared/models/execution";
import {trigger, style, transition, animate, query, stagger} from '@angular/animations';

@Component({
    selector: 'cf-executions-list',
    templateUrl: './executions-list.component.html',
    styleUrls: ['./executions-list.component.scss'],
    animations: [
        trigger('listAnimation', [
            transition('* => *', [
                query(':enter', style({opacity: 0}), {optional: true}),
                query(':enter', stagger('80ms', [
                    animate('.15s ease-in', style({opacity: 1}))
                ]), {optional: true})
            ])
        ])
    ]
})
export class ExecutionsListComponent implements OnInit {
    @ViewChild("executionsList") private executionsList: ElementRef;
    executions: Execution[] = [];
    search: string;
    loading = false;

    constructor(private service: MistralService) {}

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.loading = true;
        this.service.executions()
            .subscribe(
                executions => {
                    // only display "root" executions (that have no 'task_execution_id' value)
                    this.executions = executions.filter(exec => !exec.task_execution_id);

                    // scroll the list to top
                    this.executionsList.nativeElement.scrollTop = 0;
                },
                () => {},
                () => this.loading = false
            );
    }

    execTrackBy(index: number, item: Execution) {
        return `${item.id}_${item.state}`;
    }

}
