// Copyright (C) 2017 Nokia

import {jsPlumb, jsPlumbInstance} from 'jsplumb';
import * as dagre from "dagre";
import Zoom from "./zoom";
import {GraphEdge} from "./translator";

// add missing features in jsplumb declaration file
declare module 'jsplumb' {
    interface ConnectParams {
        cssClass?: string;
        overlays?: any[];
    }

    interface jsPlumbInstance { /*tslint:disable-line */
        setContainer(p: any): void;
        setZoom(n: number): void;
        getAllConnections(): any[];
        getConnections(p?: any): any[];
    }
}


export class Graph {
    private static readonly Anchors = ["Bottom", "Top"];
    private static readonly EndpointStyle = {radius: 6, fill: "#456"};
    private p: jsPlumbInstance = jsPlumb.getInstance() /* jsplumb typings is messed up again */;
    private zoom: Zoom;

    private connectAll(edges: GraphEdge[]) {
        for (const edge of edges) {
            this.p.connect({
                source: edge.source,
                target: edge.target,
                detachable: false,
                cssClass: `edge edge-${edge.state} inPath`,
                overlays: [
                    ["Label", {label: edge.state, id: "state-label", cssClass: `edge-overlay ${edge.state}`}],
                    ["PlainArrow", {width: 11, length: 11, location: -5}]
                ]
            });
        }
    }

    constructor(container: any, private elements: any, zoomContainer: any) {
        this.p.ready(() => {
            this.p.importDefaults({
                Connector: ["Flowchart", {cornerRadius: 10, midpoint: 0}],
                Anchors: Graph.Anchors,
                EndpointStyle: Graph.EndpointStyle,
                PaintStyle: {strokeWidth: 3}
            });
            this.p.setContainer(container);
            this.p.batch(() => {
                this.connectAll(elements.edges);
                this.layout(elements);
            });

            this.zoom = new Zoom(zoomContainer, {zoomOnly: true}, this.setZoom.bind(this));
        });
    }


    resetZoom() {
        this.zoom.resetZoom();
    }

    destroy() {
        this.elements.nodes.forEach(node => {
            this.p.removeAllEndpoints(node.id);
            this.p.remove(node.id);
        });
        this.zoom.destroy();
    }

    /**
     * Helper function to set the zoom levels of the graph.
     * This function uses css 'transform' by setting a 'scale' value, and also calls setZoom on jsPlumb.
     * (Adopted from: https://jsplumbtoolkit.com/community/doc/zooming.html)
     * @param {Number} zoom
     */
    private setZoom(zoom: number): void {
        const transformOrigin = [0.5, 0.5];
        const container: HTMLElement = this.p.getContainer() as HTMLElement;
        const prefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""],
            scale = `scale(${zoom})`,
            transform = `${transformOrigin[0] * 100}% ${transformOrigin[1] * 100}%`;

        prefixes.forEach(prefix => {
            container.style[`${prefix}transform`] = scale;
            container.style[`${prefix}transformOrigin`] = "top left";
        });

        this.p.setZoom(zoom);
    }

    /**
     * Calculate the layout of the graph. Calculation result it {top, left} css values and those are
     *  set for each node.
     * @param elements
     */
    private layout(elements) {
        const g = new dagre.graphlib.Graph();
        g.setGraph({marginx: 50, marginy: 10, ranksep: 100, nodesep: 50});
        g.setDefaultEdgeLabel(() => ({}) as any);

        // set nodes
        // width and height must match the CSS values
        elements.nodes.forEach(node => g.setNode(node.id, {width: 165, height: 65}));

        // set edges
        this.p.getAllConnections().forEach(edge => g.setEdge(edge.source.id, edge.target.id));

        // calculate the layout (node positions)
        dagre.layout(g);

        // apply the results of layout in form of css top+left properties
        elements.nodes.forEach(node => {
            const n = g.node(node.id);
            const top = Math.round(n.y - (n.height / 2));
            const left = Math.round(n.x - (n.width / 2));
            const element = document.getElementById(node.id);
            element.style.left = `${left}px`;
            element.style.top = `${top}px`;
        });

        requestAnimationFrame(this.p.repaintEverything.bind(this.p));
    }

    /**
     * Get connection objects
     * @param {Object} param - filter by:
     *              param = {"source": nodeId} - get all connection of which nodeId is the source of a connection
     *              param = {"target": nodeId} - get all connection of which nodeId is the target of a connection
     * @returns {any|void}
     */
    getConnections(param: object): any[] {
        return this.p.getConnections(param);
    }

    /**
     * Toggle 'inPath' class for all connections (edges) depending their presence in the edges set (or if set is empty).
     * Toggle visibility of edge's label- show only when there is a node selected.
     * @param {Set} edges
     */
    highlightPath(edges: Set<string>): void {
        const isNodeSelected: boolean = edges.size > 0;
        this.p.getConnections().forEach(connection => {
            // toggle 'inPath' class for edge
            const action = (!isNodeSelected || edges.has(connection.id)) ? "add" : "remove";
            connection[`${action}Class`]('inPath');

            // toggle visibility of label
            connection.getOverlay("state-label")[isNodeSelected && action === "add" ? 'show' : 'hide']();
        });
    }
}
