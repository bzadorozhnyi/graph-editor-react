import './App.css';
import stylesheet from './stylesheet.json';
import React, { useState, useRef } from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from 'file-saver';
import UserMenu from './components/UserMenu';
import Button from '@mui/material/Button';
import customDeepCopy from './customDeepCopy';

const DEFAULT_EDGE_STYLE = {
  "color": "#808080",
  "labelSize": 18,
  "labelColor": "black",
  "lineStyle": "solid",
  "marginX": 0,
  "marginY": 0,
  "opacity": 1,
  "width": 1
}

function concatNodesAndEdges(elements) {
  const { nodes, edges } = elements;
  return nodes.concat(edges);
}

function App() {
  // handle graph events and data memorization 
  const cyRef = useRef(cytoscape({ /* options */ }));
  const [tappedNodeId, setTappedNodeId] = useState('');
  const [tappedEdgeId, setTappedEdgeId] = useState('');

  const [elements, setElements] = useState({
    numberOfNodes: {},
    nodes: [],
    edges: [],
    isActiveCopy: {
      edge: false,
      node: false
    }
  });

  const [styles, setStyles] = useState({
    edges: {},
    nodes: {},
    isEdgeStyleCopyActive: false,
  });

  cyRef.current.removeListener('tap');
  cyRef.current.on('tap', 'node', (event) => {
    let newTappedNodeId = event.target.id();
    if (elements.isActiveCopy.node) {
      // update data in elements
      let tappedNodeIndex = elements.nodes.findIndex(node => node.data.id === tappedNodeId);
      let newTappedNode = elements.nodes.find(node => node.data.id === newTappedNodeId).data;

      elements.nodes[tappedNodeIndex].data = {
        ...newTappedNode,
        id: tappedNodeId,
        label: tappedNodeId,
      };

      // reset node's (copy button icon) props
      elements.isActiveCopy.node = false;

      setElements(customDeepCopy(elements));
    }
    else {
      setTappedNodeId(newTappedNodeId);
    }
  });

  cyRef.current.removeListener('remove', 'node');
  cyRef.current.on('remove', 'node', (event) => {
    if (event.target.id() === tappedNodeId) {
      setTappedNodeId('');
    }
    if (elements.isActiveCopy.node) {
      elements.isActiveCopy.node = false;
      setElements(customDeepCopy(elements));
    }
  });

  cyRef.current.removeListener('tap', 'edge');
  cyRef.current.on('tap', 'edge', (event) => {
    let newTappedEdgeId = event.target.id();
    if (elements.isEdgeStyleCopyActive) {
      // copy style from tapped edge to previous tapped edge
      let newEdgeStyle = customDeepCopy(DEFAULT_EDGE_STYLE);
      for (let property in styles.edges[newTappedEdgeId]) {
        newEdgeStyle[property] = customDeepCopy(styles.edges[newTappedEdgeId][property]);
      }
      styles.edges[tappedEdgeId] = newEdgeStyle;
      
      // update data in elements
      let newElements = customDeepCopy(elements);
      let tappedEdge = newElements.edges.find(edge => edge.data.id === tappedEdgeId);
      let isDirected = tappedEdge.data.arrow === 'triangle';
      
      tappedEdge.data = {
        id: tappedEdgeId,
        label: tappedEdge.data.label,
        arrow: isDirected ? 'triangle' : 'none',
        ...styles.edges[tappedEdgeId]
      };

      // reset edge's (copy button icon) props
      newElements.isEdgeStyleCopyActive = false;

      setElements(newElements);
      setStyles({ ...styles });
    }
    else {
      setTappedEdgeId(newTappedEdgeId);
    }
  });

  cyRef.current.removeListener('remove', 'edge');
  cyRef.current.on('remove', 'edge', (event) => {
    // update and (set empty) of tappedEdgeId implemented in EdgesEditor
    if (elements.isEdgeStyleCopyActive) {
      elements.isEdgeStyleCopyActive = false;
      setElements(customDeepCopy(elements));
    }
  });

  return (
    <div className="App">
      <div className="graph-wrapper">
        <CytoscapeComponent
          autounselectify
          elements={concatNodesAndEdges(elements)}
          style={{
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '6px',
            height: '100%',
            width: '40%'
          }}
          stylesheet={stylesheet}
          cy={(cy) => { cyRef.current = cy; }}
        />

        <div style={{ "width": "60%" }}>
          <UserMenu
            elements={elements}
            setElements={setElements}
            setStyles={setStyles}
            setTappedEdgeId={setTappedEdgeId}
            styles={styles}
            tappedEdgeId={tappedEdgeId}
            tappedNodeId={tappedNodeId}
          />
        </div>
      </div>

      <div className="download-buttons-wrapper">
        <Button onClick={() => { saveAs(cyRef.current.png(), 'graph.png') }} variant='outlined' >Download PNG</Button>
        <Button onClick={() => { saveAs(cyRef.current.jpg(), 'graph.jpg') }} variant='outlined' >Download JPG</Button>
      </div>
    </div>
  );
}

export default App;
