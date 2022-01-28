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
            label: ""
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
        let { id, source, target, label } = changedEdge;

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

        switch (property) {
            case "directed":
                // set 'directed' new value because of bug in switch new value (not local problem)
                changedEdge.directed = !oldValue;

                // if edge exists => change arrow of it
                if (source !== "" && target !== "") {
                    let currentEdge = elements.edges.find(edge => edge.data.id === id);
                    currentEdge.data.arrow = changedEdge.directed ? "triangle" : "none";
                }
                break;
            case "label":
                if(source !== '' && target !== '') {
                    let currentEdge = elements.edges.find(edge => edge.data.id === id);
                    currentEdge.data.label = newValue;
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
                        elements.edges.push({
                            data: {
                                arrow: changedEdge.directed ? "triangle" : "none",
                                id: changedEdge.id,
                                source: newValue,
                                target: target,
                                label: label
                            },
                        });
                    }
                } else {
                    // remove source node if need
                    if (--elements.dictOfNodes[oldValue] === 0) {
                        delete elements.dictOfNodes[oldValue];
                        delete styles.nodes[oldValue];
                        elements.nodes = elements.nodes.filter(
                            (node) => node.data.id !== oldValue
                        );
                    }
                    // add new node if need
                    addNode(newValue);

                    // set current edge style
                    let edgeStyle = id in styles.edges ? styles.edges[id] : {};

                    // remove old edge
                    elements.edges = elements.edges.filter((edge) => edge.data.id !== id);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // set new edge style as current
                    styles.edges[changedEdge.id] = edgeStyle;

                    // add new edge if it`s possible
                    if (newValue !== "" && target !== "") {
                        elements.edges.push({
                            data: {
                                arrow: changedEdge.directed ? "triangle" : "none",
                                id: changedEdge.id,
                                source: newValue,
                                target: target,
                                label: label,
                                ...edgeStyle
                            },
                        });

                        // if current edge is tapped => set new id of tapped edge
                        if(id === this.props.tappedEdgeId) {
                            this.props.setTappedEdgeId(changedEdge.id);
                        }
                    }
                    // if cannot add edge and current edge is tapped => update tappedEdgeId
                    else if(id === this.props.tappedEdgeId) { 
                        this.props.setTappedEdgeId('');
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
                        elements.edges.push({
                            data: {
                                arrow: changedEdge.directed ? "triangle" : "none",
                                id: changedEdge.id,
                                source: source,
                                target: newValue,
                                label: label
                            },
                        });
                    }
                } else {
                    // remove target node if need
                    if (--elements.dictOfNodes[oldValue] === 0) {
                        delete elements.dictOfNodes[oldValue];
                        delete styles.nodes[oldValue];
                        elements.nodes = elements.nodes.filter(
                            (node) => node.data.id !== oldValue
                        );
                    }
                    // add new node if need
                    addNode(newValue);

                    // set current edge style
                    let edgeStyle = id in styles.edges ? styles.edges[id] : {};

                    // remove old edge
                    elements.edges = elements.edges.filter((edge) => edge.data.id !== id);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // set new edge style as current
                    styles.edges[changedEdge.id] = edgeStyle;

                    // add new edge if it`s possible
                    if (newValue !== "" && target !== "") {
                        elements.edges.push({
                            data: {
                                arrow: changedEdge.directed ? "triangle" : "none",
                                id: changedEdge.id,
                                source: source,
                                target: newValue,
                                label: label,
                                ...edgeStyle
                            },
                        });

                        // if current edge is tapped => set new id of tapped edge
                        if(id === this.props.tappedEdgeId) {
                            this.props.setTappedEdgeId(changedEdge.id);
                        }
                    }
                    // if cannot add edge and current edge is tapped => update tappedEdgeId
                    else if(id === this.props.tappedEdgeId) { 
                        this.props.setTappedEdgeId('');
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
        const { id, source, target } = removedEdge;

        // remove not existed nodes
        if (source !== "" && --elements.dictOfNodes[source] === 0) {
            delete elements.dictOfNodes[source];
            delete styles.nodes[source];
            elements.nodes = elements.nodes.filter(
                (node) => node.data.id !== source
            );
        }
        if (target !== "" && --elements.dictOfNodes[target] === 0) {
            delete elements.dictOfNodes[target];
            delete styles.nodes[target];
            elements.nodes = elements.nodes.filter(
                (node) => node.data.id !== target
            );
        }

        // remove edge
        if (source !== "" && target !== "") {
            delete styles.edges[id];
            // if removed edge is tapped => set tappedEdgeId as empty
            if(id === this.props.tappedEdgeId) {
                this.props.setTappedEdgeId('');
            }
            elements.edges = elements.edges.filter(
                (edge) => edge.data.id !== id
            );
        }
    };

    render() {
        return (
            <div className='edges-editor'>
                <div style={{'background-color': 'white', 'position': 'sticky', 'top': '0px', 'z-index': '10'}}>
                    <Button onClick={this.addEdge}>Add edge</Button>
                </div>
                <div className='edges-list'>
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
