// Copyright (C) 2017 Nokia

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {TaskExec} from "../../shared/models/taskExec";
import {Graph} from "../../engines/graph/graph";
import {GraphEdge, toGraphData} from "../../engines/graph/translator";
import {GraphUtils} from "../../engines/graph/graphUtils";

@Component({
    selector: 'cf-workflow-graph',
    templateUrl: './workflow-graph.component.html',
    styleUrls: ['./workflow-graph.component.scss']
})
export class WorkflowGraphComponent implements AfterViewInit, OnDestroy {

    private _tasks: TaskExec[] = [];
    private graphElements: {nodes: any, edges: GraphEdge[]};

    @ViewChild("graphContainer") private container: ElementRef;
    @ViewChild("zoomContainer") private zoomContainer: ElementRef;

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
            this.graph = new Graph(this.container.nativeElement, this.graphElements, this.zoomContainer.nativeElement);
        });
    }

    taskSelected(task: TaskExec|null) {
        this.taskSelect.emit(task);
        this.highlightPath(task ? task.id : null);
    }

    /**
     * Highlight all the nodes and edges that are ancestors and descendants of the given node (task).
     * @param {String} taskId
     */
    highlightPath(taskId: string|null): void {
        let nodes: Set<string>, edges: Set<string>;

        if (taskId !== null) {
            const {nodes: ancestors, edges: ancestorEdges} = GraphUtils.findAncestors(this.graph, taskId);
            const {nodes: descendants, edges: descendantsEdges} = GraphUtils.findDescendants(this.graph, taskId);
            nodes = new Set([...Array.from(ancestors), ...Array.from(descendants)]);
            edges = new Set([...Array.from(ancestorEdges), ...Array.from(descendantsEdges)]);
        } else {
            nodes = new Set();
            edges = new Set();
        }

        // highlight nodes
        this._tasks.forEach(task => {
            task.inPath = nodes.size === 0 || nodes.has(task.id);
        });

        // highlight edges
        this.graph.highlightPath(edges);
    }

    ngOnDestroy() {
        this.graph.destroy();
    }

}
