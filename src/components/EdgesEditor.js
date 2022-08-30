import React, { Component } from "react";
import EdgeInput from "./EdgeInput";
import { v4 as uuidv4 } from "uuid";
import { Button } from '@mui/material';
import customDeepCopy from "../customDeepCopy";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DEFAULT_NODE_STYLE, DEFAULT_EDGE_STYLE } from "../constants";
import TextEdgeInputs from "./TextEdgeInputs";

class EdgesEditor extends Component {
    addEdge = () => {
        let edgeInputs = this.props.frames[this.props.selectedFrameIndex].edgeInputs;
        edgeInputs.push({
            directed: false,
            edgeInputId: uuidv4(),
            id: uuidv4(),
            source: "",
            target: "",
            label: ""
        });
        this.props.setFrames(customDeepCopy(this.props.frames));
    };

    handleTextAdding = (textEdges, setTextEdges) => {
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
                    this.props.frames[this.props.selectedFrameIndex].elements.edges.push({
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

                this.props.frames[this.props.selectedFrameIndex].edgeInputs.push(newEdgeInput);
            }
        });

        this.props.setFrames(customDeepCopy(this.props.frames));
        setTextEdges('');
    }

    handleEdgeDelete = (deletedEdgeId) => {
        // remove old data from elements
        this.removeOldData(
            this.props.frames[this.props.selectedFrameIndex].edgeInputs.find((edge) => edge.id === deletedEdgeId),
            this.props.frames[this.props.selectedFrameIndex].elements
        );

        // remove edge input
        this.props.frames[this.props.selectedFrameIndex].edgeInputs = this.props.frames[this.props.selectedFrameIndex].edgeInputs.filter(
            (edge) => edge.id !== deletedEdgeId
        );

        this.props.setFrames(customDeepCopy(this.props.frames));
    };

    addNode = (name) => {
        const { elements } = this.props.frames[this.props.selectedFrameIndex];
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
                },
                position: {
                    x: 0,
                    y: 0
                }
            });
        }
    }

    handleEdgeChange = (changedEdgeId, property, newValue) => {
        let changedEdge = this.props.frames[this.props.selectedFrameIndex].edgeInputs.find(
            (edge) => edge.id === changedEdgeId
        );
        let { id, source, target, label } = changedEdge;

        let { elements } = this.props.frames[this.props.selectedFrameIndex];

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
                        if (id === elements.tappedEdgeId) {
                            this.props.frames[this.props.selectedFrameIndex].elements.tappedEdgeId = changedEdge.id;
                            this.props.setFrames(customDeepCopy(this.props.frames));
                        }
                    }
                    // if cannot add edge and current edge is tapped => update tappedEdgeId
                    else if (id === elements.tappedEdgeId) {
                        this.props.frames[this.props.selectedFrameIndex].elements.tappedEdgeId = '';
                        this.props.setFrames(customDeepCopy(this.props.frames));
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
                                source: source,
                                target: newValue,
                                label: label
                            }
                        });

                        // if current edge is tapped => set new id of tapped edge
                        if (id === elements.tappedEdgeId) {
                            this.props.frames[this.props.selectedFrameIndex].elements.tappedEdgeId = changedEdge.id;
                            this.props.setFrames(customDeepCopy(this.props.frames));
                        }
                    }
                    // if cannot add edge and current edge is tapped => update tappedEdgeId
                    else if (id === elements.tappedEdgeId) {
                        this.props.frames[this.props.selectedFrameIndex].elements.tappedEdgeId = '';
                        this.props.setFrames(customDeepCopy(this.props.frames));
                    }
                }
                break;
            default:
                break;
        }

        this.props.setFrames(customDeepCopy(this.props.frames));
    };

    removeOldData = (removedEdge, elements) => {
        const { id, source, target } = removedEdge;

        // remove not existed nodes
        if (source !== "" && --elements.numberOfNodes[source] === 0) {
            delete elements.numberOfNodes[source];
            elements.nodes = elements.nodes.filter(
                (node) => node.data.id !== source
            );
            // if removed node is tapped => set tappedNodeId as empty
            if (source === elements.tappedNodeId) {
                elements.tappedNodeId = '';
            }
        }
        if (target !== "" && --elements.numberOfNodes[target] === 0) {
            delete elements.numberOfNodes[target];
            elements.nodes = elements.nodes.filter(
                (node) => node.data.id !== target
            );
            // if removed node is tapped => set tappedNodeId as empty
            if (target === elements.tappedNodeId) {
                elements.tappedNodeId = '';
            }
        }

        // remove edge
        if (source !== "" && target !== "") {
            // if removed edge is tapped => set tappedEdgeId as empty
            if (id === elements.tappedEdgeId) {
                elements.tappedEdgeId = '';
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

        const items = Array.from(this.props.frames[this.props.selectedFrameIndex].edgeInputs);
        const [reorderedEdgeInputs] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedEdgeInputs);

        this.props.frames[this.props.selectedFrameIndex].edgeInputs = items;
        this.props.setFrames(customDeepCopy(this.props.frames));
    };

    render() {
        return (
            <div className='edges-editor panel'>
                <div id="addEdgePanel">
                    <Button
                        onClick={this.addEdge}
                        style={{margin: '10px'}}
                        variant='outlined'>
                        Add edge
                    </Button>
                    <TextEdgeInputs onAdd={this.handleTextAdding}/>
                    <p>
                        You can drag and drop edge`s inputs.
                    </p>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="edges-list">
                        {(provided) => (
                            <div className='edges-list' {...provided.droppableProps} ref={provided.innerRef}>
                                {this.props.frames[this.props.selectedFrameIndex].edgeInputs.map((edgeInput, index) => {
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
