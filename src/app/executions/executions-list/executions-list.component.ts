// Copyright (C) 2017 Nokia

import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution} from "../../shared/models/execution";

@Component({
    selector: 'cf-executions-list',
    templateUrl: './executions-list.component.html',
    styleUrls: ['./executions-list.component.scss'],
})
export class ExecutionsListComponent implements OnInit {
    @ViewChild("executionsList") private executionsList: ElementRef;
    private sort = {by: 'created_at', dir: 'desc'};
    executions: Execution[] = [];
    search: string;
    loading = false;

    constructor(private service: MistralService) {}

    ngOnInit() {
        this.refresh();
    }

    /**
     * Set the field name to sort by.
     * Optionally set the sort direction (or flip the current direction).
     * @param {string} by
     * @param {"desc" | "asc"} dir
     */
    changeSort(by: string, dir?: 'desc'|'asc') {
        const direction = dir ? dir : (this.sort.dir === 'desc' ? 'asc' : 'desc');
        this.sort = {by, dir: direction};
        this.refresh();
    }

    getSortClass(attr: string) {
        if (this.sort.by === attr) {
            return `attr-sort-${this.sort.dir}`;
        } else {
            return 'attr-sortable';
        }
    }

    refresh() {
        this.loading = true;
        this.service.executions(this.sort.by, this.sort.dir)
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
