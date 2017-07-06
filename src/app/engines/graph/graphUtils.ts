import {Graph} from "./graph";

export namespace GraphUtils {

    /**
     * Traverse the graph from the given node and the given direction
     * @param {Graph} graph
     * @param {String} fromNode
     * @param {String} direction -
     *      "up": find all connections that the given node is their target, and recursively traverse from the source of the connection.
     *      "down": find all connection that the given node is their source and recursively traverse from the target of the connection.
     * @returns {{nodes: Set<string>, edges: Set<string>}} - a set of the nodes ids and a set of the connections ids traversed.
     */
    function traverse(graph: Graph, fromNode: string, direction: "up" | "down"): {nodes: Set<string>, edges: Set<string>} {
        const nodes = new Set<string>([fromNode]);
        const edges = new Set<string>();
        const connectionFilter = direction === "up" ? "target" : "source";
        const connectionMember = direction === "up" ? "sourceId" : "targetId";

        const helper = (nodeId: string) => {
            graph.getConnections({[connectionFilter]: nodeId}).forEach(connection => {
                const node: string = connection[connectionMember];
                nodes.add(node);
                edges.add(connection.id);
                helper(node);
            });
        };

        helper(fromNode);
        return {nodes, edges};
    }

    /**
     * Find all the ancestors of given node.
     * Return set of ancestors ids and connection ids.
     * @param {Graph} graph - graph instance
     * @param {string} nodeId - node id to start traversing form
     */
    export function findAncestors(graph: Graph, nodeId: string): {nodes: Set<string>, edges: Set<string>} {
        return traverse(graph, nodeId, "up");
    }

    /**
     * Find all descendants of given node.
     * Return set of descendants ids and connection ids.
     * @param {Graph} graph - graph instance
     * @param {string} nodeId - node id to start traversing form
     */
    export function findDescendants(graph: Graph, nodeId: string): {nodes: Set<string>, edges: Set<string>} {
        return traverse(graph, nodeId, "down");
    }

}
