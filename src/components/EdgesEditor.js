import React, { Component } from "react";
import EdgeInput from "./EdgeInput";
import { v4 as uuidv4 } from "uuid";
import { Button } from '@mui/material';

class EdgesEditor extends Component {
    state = {
        edgeInputs: [],
    };

    addEdge = () => {
        let edgeInputs = this.state.edgeInputs;
        edgeInputs.push({
            directed: false,
            edgeInputId: uuidv4(),
            id: uuidv4(),
            source: "",
            target: "",
        });
        this.setState({ ...edgeInputs });
    };
    handleEdgeDelete = (deletedEdgeId) => {
        let { elements, styles } = this.props;
        elements = JSON.parse(JSON.stringify(elements));

        // remove old data from elements
        this.removeOldData(
            this.state.edgeInputs.find((edge) => edge.id === deletedEdgeId),
            elements,
            styles
        );

        // remove edge input
        const edgeInputs = this.state.edgeInputs.filter(
            (edge) => edge.id !== deletedEdgeId
        );

        this.setState({ edgeInputs });
        this.props.setElements({ ...elements });
        this.props.setStyles({ ...styles });
    };
    handleEdgeChange = (changedEdgeId, property, newValue) => {
        let changedEdge = this.state.edgeInputs.find(
            (edge) => edge.id === changedEdgeId
        );
        let { id, source, target } = changedEdge;

        let { elements, styles } = this.props;
        elements = JSON.parse(JSON.stringify(elements));

        function addNode(name) {
            // if node not exist => set number of it to 0
            if (!(name in elements.dictOfNodes)) {
                elements.dictOfNodes[name] = 0;
            }
            // if node appear => add to graph`s nodes
            if (name !== "" && ++elements.dictOfNodes[name] === 1) {
                elements.nodes.push(
                    name in styles.nodes
                        ? { data: { id: name, label: name, ...styles.nodes[name], }, }
                        : { data: { id: name, label: name } }
                );
            }
        }

        // update inputs
        let oldValue = changedEdge[property];
        changedEdge[property] = newValue;

        // for source and target cases
        let direction = changedEdge["directed"] ? "directed" : "undirected";

        switch (property) {
            case "directed":
                // set 'directed' new value because of bug in switch new value (not local problem)
                newValue = !oldValue;
                changedEdge["directed"] = newValue;

                // if edge exists => change arrow of it
                if (source !== "" && target !== "") {
                    let oldDirection = oldValue ? "directed" : "undirected";
                    let newDirection = newValue ? "directed" : "undirected";

                    // remove from directed/undirected edges current edge
                    elements.edges[oldDirection] = elements.edges[
                        oldDirection
                    ].filter((edge) => edge.data.id !== id);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // add to undirected/directed edges current edge
                    elements.edges[newDirection].push({
                        data: {
                            arrow: newValue ? "triangle" : "none",
                            id: changedEdge.id,
                            source: source,
                            target: target,
                        },
                    });
                }
                break;
            case "source":
                if (oldValue === "") {
                    // add new node if need
                    addNode(newValue);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // add new edge if it exists
                    if (newValue !== "" && target !== "") {
                        elements.edges[direction].push({
                            data: {
                                arrow:
                                    direction === "directed"
                                        ? "triangle"
                                        : "none",
                                id: changedEdge.id,
                                source: newValue,
                                target: target,
                            },
                        });
                    }
                } else {
                    // remove source node if need
                    if (--elements.dictOfNodes[oldValue] === 0) {
                        delete elements.dictOfNodes[oldValue];
                        delete styles[oldValue];
                        elements.nodes = elements.nodes.filter(
                            (node) => node.data.id !== oldValue
                        );
                    }
                    // add new node if need
                    addNode(newValue);

                    // remove old edge
                    elements.edges[direction] = elements.edges[
                        direction
                    ].filter((edge) => edge.data.id !== id);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // add new edge if it`s possible
                    if (newValue !== "" && target !== "") {
                        elements.edges[direction].push({
                            data: {
                                arrow:
                                    direction === "directed"
                                        ? "triangle"
                                        : "none",
                                id: changedEdge.id,
                                source: newValue,
                                target: target,
                            },
                        });
                    }
                }
                break;
            case "target":
                if (oldValue === "") {
                    // add new node if need
                    addNode(newValue);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // add new edge if it exists
                    if (source !== "" && newValue !== "") {
                        elements.edges[direction].push({
                            data: {
                                arrow:
                                    direction === "directed"
                                        ? "triangle"
                                        : "none",
                                id: changedEdge.id,
                                source: source,
                                target: newValue,
                            },
                        });
                    }
                } else {
                    // remove target node if need
                    if (--elements.dictOfNodes[oldValue] === 0) {
                        delete elements.dictOfNodes[oldValue];
                        delete styles[oldValue];
                        elements.nodes = elements.nodes.filter(
                            (node) => node.data.id !== oldValue
                        );
                    }
                    // add new node if need
                    addNode(newValue);

                    // remove old edge
                    elements.edges[direction] = elements.edges[
                        direction
                    ].filter((edge) => edge.data.id !== id);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // add new edge if it`s possible
                    if (newValue !== "" && target !== "") {
                        elements.edges[direction].push({
                            data: {
                                arrow:
                                    direction === "directed"
                                        ? "triangle"
                                        : "none",
                                id: changedEdge.id,
                                source: source,
                                target: newValue,
                            },
                        });
                    }
                }
                break;
            default:
                break;
        }

        this.setState({ ...this.state.edgeInputs });
        this.props.setElements({ ...elements });
        this.props.setStyles({ ...styles });
    };

    removeOldData = (removedEdge, elements, styles) => {
        const { directed, id, source, target } = removedEdge;

        // remove not existed nodes
        if (source !== "" && --elements.dictOfNodes[source] === 0) {
            delete elements.dictOfNodes[source];
            delete styles[source];
            elements.nodes = elements.nodes.filter(
                (node) => node.data.id !== source
            );
        }
        if (target !== "" && --elements.dictOfNodes[target] === 0) {
            delete elements.dictOfNodes[target];
            delete styles[target];
            elements.nodes = elements.nodes.filter(
                (node) => node.data.id !== target
            );
        }

        // remove edge
        if (source !== "" && target !== "") {
            let direction = directed ? "directed" : "undirected";
            elements.edges[direction] = elements.edges[direction].filter(
                (edge) => edge.data.id !== id
            );
        }
    };

    render() {
        return (
            <div className='edge-editor'>
                <div style={{'background-color': 'white', 'position': 'sticky', 'top': '0px', 'z-index': '10'}}>
                    <Button onClick={this.addEdge}>Add edge</Button>
                </div>
                <div className='edge-list'>
                        {this.state.edgeInputs.map((edgeInput) => (
                            <EdgeInput
                                edge={edgeInput}
                                key={edgeInput.edgeInputId}
                                onChange={this.handleEdgeChange}
                                onDelete={this.handleEdgeDelete}
                            />
                        ))}
                </div>
            </div>
        );
    }
}

export default EdgesEditor;
