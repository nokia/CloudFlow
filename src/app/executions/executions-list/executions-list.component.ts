// Copyright (C) 2017 Nokia

import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MistralService} from "../../engines/mistral/mistral.service";
import {Execution} from "../../shared/models/execution";
import {fromEvent} from "rxjs/observable/fromEvent";
import {Subscription} from "rxjs/Subscription";
import {map, filter, tap, debounceTime, finalize} from "rxjs/operators";

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
        this.getExecutions(this.sort.by, this.sort.dir)
            .subscribe(executions => {
                this.executions = executions;

                // scroll the list to top
                this.executionsList.nativeElement.scrollTop = 0;

                // see 'fillGap' documentation
                this.fillGap();
            }
        );
    }

    /**
     * Implement infinite scroll (with scrollEvent observable).
     * When scrolled to end of list- fetch the next batch of executions and append to existing list.
     */
    listScroll() {
        if (this.nextMarker) {
            this.getExecutions(this.sort.by, this.sort.dir, this.nextMarker)
                .subscribe(executions => {
                    // concat the new executions to existing ones
                    this.executions.push(...executions);

                    // see 'fillGap' documentation
                    this.fillGap();
                });
        }
    }

    /**
     * Today there is no way to fetch "root" executions (executions not triggered by a parent execution).
     * So we fetch all executions (using limit query param), and filter according to task_execution_id being null.
     * This may lead to a case were there are no "root" executions in the whole data set loaded.
     *
     * This function is called from 'listScroll()' and 'refresh()' to keep loading more executions until we reach
     * a minimum executions list length.
     */
    private fillGap() {
        if (this.nextMarker && this.executions.length < FILL_GAP_THRESHOLD) {
            this.listScroll();
        }
    }

    execTrackBy(index: number, item: Execution) {
        return `${item.id}_${item.state}`;
    }

}
