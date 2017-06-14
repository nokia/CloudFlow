import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output,
    ViewChild
} from '@angular/core';
import {TaskExec} from "../../shared/models/taskExec";
import {Graph} from "../../engines/graph/graph";
import {toGraphData} from "../../engines/graph/translator";

@Component({
    selector: 'cf-workflow-graph',
    templateUrl: './workflow-graph.component.html',
    styleUrls: ['./workflow-graph.component.scss']
})
export class WorkflowGraphComponent implements AfterViewInit, OnDestroy {

    private _tasks: TaskExec[] = [];
    private graphElements: any;

    @ViewChild("graphContainer") private container: ElementRef;

    @Output() taskSelect = new EventEmitter<TaskExec>();

    private graph: Graph = null;

    @Input()
    set tasks(tasks: TaskExec[]) {
        this._tasks = tasks;
        this.graphElements = toGraphData(this._tasks);
    }

    get tasks(): TaskExec[] {
        return this._tasks;
    }


    constructor() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.graph = new Graph(this.container.nativeElement, this.graphElements);
        });
    }

    taskSelected(task: TaskExec) {
        this.taskSelect.emit(task);
    }

    ngOnDestroy() {
        this.graph.destroy(this.graphElements);
    }

}
