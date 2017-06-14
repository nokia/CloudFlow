import jsPlumb from 'jsplumb/dist/js/jsplumb';
import * as dagre from "dagre";
import * as $ from "jquery";

export class Graph {
    private static readonly Anchors = ["Bottom", "Top"];
    private static readonly EndpointStyle = {radius: 6, fill: "#456"};

    private p = jsPlumb.jsPlumb;

    private connectAll(edges: any) {
        for (const edge of edges) {
            this.p.connect({
                source: edge.source,
                target: edge.target,
                detachable: false,
                anchors: Graph.Anchors,
                endpointStyle: Graph.EndpointStyle,
                paintStyle: {strokeWidth: 3},
                cssClass: `edge-${edge.state}`,
            })
        }
    }

    constructor(container: any, elements: any) {
        this.p.ready(() => {
            this.p.importDefaults({
                Connector: ["Flowchart", {cornerRadius: 10, midpoint: .9}]
            });
            this.p.setContainer(container);
            this.p.batch(() => {
                this.connectAll(elements.edges);
                this.layout(elements);
            });
        });
    }

    destroy(elements) {
        elements.nodes.forEach(node => {
            this.p.removeAllEndpoints(node.id);
            this.p.remove(node.id);
        });
    }

    layout(elements) {
        const g = new dagre.graphlib.Graph();
        g.setGraph({marginx: 50, marginy: 10});
        g.setDefaultEdgeLabel(() => ({}));

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
            node.top = top;
            node.left = left;
        });

        setTimeout(() => this.p.repaintEverything());
    }
}
