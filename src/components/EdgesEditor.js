import React, { Component } from "react";
import EdgeInput from "./EdgeInput";
import { v4 as uuidv4 } from "uuid";
import { Button } from '@mui/material';
import customDeepCopy from "../customDeepCopy";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DEFAULT_NODE_STYLE, DEFAULT_EDGE_STYLE } from "../constants";
import TextEdgeInputs from "./TextEdgeInputs";

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

    handleTextAdding = (textEdges, setTextEdges) => {
        let {elements, setElements} = this.props;
        let edgeInputs = this.state.edgeInputs;

        textEdges.split('\n').forEach(row => {
            let [source, target, ...label] = row.trim().split(/\s+/);

            if(source) {
                if(target === undefined) {
                    target = '';
                }
                label = label.join(' ');

                let newEdgeInput = {
                    directed: false,
                    edgeInputId: uuidv4(),
                    id: uuidv4(),
                    source: source,
                    target: target,
                    label: label
                };

                this.addNode(source);
                this.addNode(target);

                if(target !== '') {
                    elements.edges.push({
                        data: {
                            arrow: "none",
                            id: newEdgeInput.id,
                            source: source,
                            target: target,
                            label: label,
                            ...customDeepCopy(DEFAULT_EDGE_STYLE)
                        }
                    });
                }

                edgeInputs.push(newEdgeInput);
            }
        });

        setElements(customDeepCopy(elements));
        this.setState({ ...edgeInputs });
        setTextEdges('');
    }

    handleEdgeDelete = (deletedEdgeId) => {
        let { elements } = this.props;
        elements = customDeepCopy(elements);

        // remove old data from elements
        this.removeOldData(
            this.state.edgeInputs.find((edge) => edge.id === deletedEdgeId),
            elements
        );

        // remove edge input
        const edgeInputs = this.state.edgeInputs.filter(
            (edge) => edge.id !== deletedEdgeId
        );

        this.setState({ edgeInputs });
        this.props.setElements({ ...elements });
    };

    addNode = (name) => {
        const { elements } = this.props;
        // if node not exist => set number of it to 0
        if (!(name in elements.numberOfNodes)) {
            elements.numberOfNodes[name] = 0;
        }
        // if node appear => add to graph`s nodes
        if (name !== "" && ++elements.numberOfNodes[name] === 1) {
            elements.nodes.push({
                data: {
                    id: name,
                    label: name,
                    ...customDeepCopy(DEFAULT_NODE_STYLE)
                }
            });
        }
    }

    handleEdgeChange = (changedEdgeId, property, newValue) => {
        let changedEdge = this.state.edgeInputs.find(
            (edge) => edge.id === changedEdgeId
        );
        let { id, source, target, label } = changedEdge;

        let { elements } = this.props;

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
                if (source !== '' && target !== '') {
                    let currentEdge = elements.edges.find(edge => edge.data.id === id);
                    currentEdge.data.label = newValue;
                }
                break;
            case "source":
                if (oldValue === "") {
                    // add new node if need
                    this.addNode(newValue);

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
                                label: label,
                                ...customDeepCopy(DEFAULT_EDGE_STYLE)
                            }
                        });
                    }
                } else {
                    // remove source node if need
                    if (--elements.numberOfNodes[oldValue] === 0) {
                        delete elements.numberOfNodes[oldValue];
                        elements.nodes = elements.nodes.filter(
                            (node) => node.data.id !== oldValue
                        );
                    }
                    // add new node if need
                    this.addNode(newValue);

                    let oldEdge = elements.edges.find(edge => edge.data.id === id).data;

                    // remove old edge
                    elements.edges = elements.edges.filter((edge) => edge.data.id !== id);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // add new edge if it`s possible
                    if (newValue !== "" && target !== "") {
                        elements.edges.push({
                            data: {
                                ...customDeepCopy(oldEdge),
                                arrow: changedEdge.directed ? "triangle" : "none",
                                id: changedEdge.id,
                                source: newValue,
                                target: target,
                                label: label
                            }
                        });

                        // if current edge is tapped => set new id of tapped edge
                        if (id === this.props.tappedEdgeId) {
                            this.props.setTappedEdgeId(changedEdge.id);
                        }
                    }
                    // if cannot add edge and current edge is tapped => update tappedEdgeId
                    else if (id === this.props.tappedEdgeId) {
                        this.props.setTappedEdgeId('');
                    }
                }
                break;
            case "target":
                if (oldValue === "") {
                    // add new node if need
                    this.addNode(newValue);

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
                                label: label,
                                ...customDeepCopy(DEFAULT_EDGE_STYLE)
                            }
                        });
                    }
                } else {
                    // remove target node if need
                    if (--elements.numberOfNodes[oldValue] === 0) {
                        delete elements.numberOfNodes[oldValue];
                        elements.nodes = elements.nodes.filter(
                            (node) => node.data.id !== oldValue
                        );
                    }
                    // add new node if need
                    this.addNode(newValue);

                    let oldEdge = elements.edges.find(edge => edge.data.id === id).data;

                    // remove old edge
                    elements.edges = elements.edges.filter((edge) => edge.data.id !== id);

                    // set new edge id
                    changedEdge.id = uuidv4();

                    // add new edge if it`s possible
                    if (newValue !== "" && target !== "") {
                        elements.edges.push({
                            data: {
                                ...customDeepCopy(oldEdge),
                                arrow: changedEdge.directed ? "triangle" : "none",
                                id: changedEdge.id,
                                source: newValue,
                                target: target,
                                label: label
                            }
                        });

                        // if current edge is tapped => set new id of tapped edge
                        if (id === this.props.tappedEdgeId) {
                            this.props.setTappedEdgeId(changedEdge.id);
                        }
                    }
                    // if cannot add edge and current edge is tapped => update tappedEdgeId
                    else if (id === this.props.tappedEdgeId) {
                        this.props.setTappedEdgeId('');
                    }
                }
                break;
            default:
                break;
        }

        this.setState({ ...this.state.edgeInputs });
        this.props.setElements(customDeepCopy(elements));
    };

    removeOldData = (removedEdge, elements) => {
        const { id, source, target } = removedEdge;

        // remove not existed nodes
        if (source !== "" && --elements.numberOfNodes[source] === 0) {
            delete elements.numberOfNodes[source];
            elements.nodes = elements.nodes.filter(
                (node) => node.data.id !== source
            );
        }
        if (target !== "" && --elements.numberOfNodes[target] === 0) {
            delete elements.numberOfNodes[target];
            elements.nodes = elements.nodes.filter(
                (node) => node.data.id !== target
            );
        }

        // remove edge
        if (source !== "" && target !== "") {
            // if removed edge is tapped => set tappedEdgeId as empty
            if (id === this.props.tappedEdgeId) {
                this.props.setTappedEdgeId('');
            }
            elements.edges = elements.edges.filter(
                (edge) => edge.data.id !== id
            );
        }
    };

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(this.state.edgeInputs);
        const [reorderedEdgeInputs] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedEdgeInputs);

        this.setState({ edgeInputs: items });
    };

    render() {
        return (
            <div className='edges-editor panel'>
                <div id="addEdgePanel">
                    <Button onClick={this.addEdge}>Add edge</Button>
                    <TextEdgeInputs onAdd={this.handleTextAdding}/>
                    <p>
                        You can drag and drop edge`s inputs.
                    </p>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="edges-list">
                        {(provided) => (
                            <div className='edges-list' {...provided.droppableProps} ref={provided.innerRef}>
                                {this.state.edgeInputs.map((edgeInput, index) => {
                                    return (
                                        <Draggable key={edgeInput.edgeInputId + '-id'} draggableId={edgeInput.edgeInputId + '-id'} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <EdgeInput
                                                        edge={edgeInput}
                                                        key={edgeInput.edgeInputId}
                                                        onChange={this.handleEdgeChange}
                                                        onDelete={this.handleEdgeDelete}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

export default EdgesEditor;
