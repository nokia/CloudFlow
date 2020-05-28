// Copyright (C) 2017 Nokia

import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution} from "../../shared/models/execution";
import {fromEvent, Subscription} from "rxjs";
import {map, filter, tap, debounceTime, finalize} from "rxjs/operators";
import {ItemDuration} from "../../shared/models/common";

function getNextMarker(next: string) {
    try {
        return next.match(/marker=([^&]+)/)[1];
    } catch (e) {
        return '';
    }
}

const FILL_GAP_THRESHOLD = 100;

@Component({
    selector: 'cf-executions-list',
    templateUrl: './executions-list.component.html',
    styleUrls: ['./executions-list.component.scss'],
})
export class ExecutionsListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("executionsList") private executionsList: ElementRef;
    private sort = {by: 'created_at', dir: 'desc'};
    private scrollEvent: Subscription;
    private scrollSum = 0;

    nextMarker = "";
    executions: Execution[] = null;
    search: string;
    loading = false;

    constructor(private service: MistralService) {}

    ngOnInit() {
        this.refresh();
    }

    ngAfterViewInit() {
        this.scrollEvent = fromEvent(this.executionsList.nativeElement, "scroll").pipe(
            debounceTime(500),

            // disable listener when not loaded minimum executions
            filter(e => this.executions && this.executions.length >= FILL_GAP_THRESHOLD),

            // only if we have a next marker
            filter(e => !!this.nextMarker),

            // when scrolled to bottom of list
            filter(e => {
                const {scrollTop, scrollHeight, offsetHeight} = e['target'];
                return scrollTop + offsetHeight >= scrollHeight;
            })
        ).subscribe(this.listScroll.bind(this));
    }

    ngOnDestroy() {
        this.scrollEvent.unsubscribe();
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

    /**
     * Fetch the executions.
     * As a side effect- set the 'next' marker (for infinite scroll).
     */
    private getExecutions(sortBy: string, sortDir: string, marker?: string) {
        this.loading = true;
        return this.service.executions(sortBy, sortDir, marker).pipe(
            // extract and set 'next' marker
            tap(res => this.nextMarker = getNextMarker(res.next)),

            // map the response to get only the "root" executions
            map(({executions}) => executions.filter(exec => !exec.task_execution_id)),

            finalize(() => { this.loading = false; })
        );
    }

    /**
     * Refresh the executions list, according to 'sort' options.
     * This replaces the current executions.
     */
    refresh() {
        this.executions = null;
        this.nextMarker = '';
        this.scrollSum = 0;
        this.getExecutions(this.sort.by, this.sort.dir)
            .subscribe(executions => {
                this.executions = executions;

                // scroll the list to top
                this.executionsList.nativeElement.scrollTop = 0;

                /**
                 * Today there is no way to fetch "root" executions (executions not triggered by a parent execution)
                 * from Mistral.
                 * So we fetch all executions (using limit query param), and filter according to task_execution_id
                 * being null.
                 * This may lead to a case where there are no "root" executions in the whole data set loaded.
                 *
                 * This check will trigger the 'listScroll' function to mimic user scroll, thus loading more
                 * executions until we reach the initial threshold.
                 */
                if (this.nextMarker && this.executions.length < FILL_GAP_THRESHOLD) {
                    this.listScroll();
                }
            }
        );
    }

    /**
     * Implement infinite scroll (called from scrollEvent observable).
     * When scrolled to end of list- fetch the next batch of executions and append to existing list.
     * Due to the same reason above, this function will continue to fetch executions until reaching the threshold.
     */
    async listScroll() {
        this.scrollSum = 0;

        while (this.nextMarker && this.scrollSum < FILL_GAP_THRESHOLD) {
            const executions = await this.getExecutions(this.sort.by, this.sort.dir, this.nextMarker).toPromise();
            this.scrollSum += executions.length;
            this.executions.push(...executions);
        }
    }

    execTrackBy(index: number, item: Execution) {
        return `${item.id}_${item.state}`;
    }

    getItemDuration(created_at, updated_at, state) {
        const duration = new ItemDuration(created_at, updated_at);
        if (state === "RUNNING") {
            return duration.duration_sec > 0 ? `${duration.duration} so far` : duration.duration;
        }
        return duration.duration;
    }

}
