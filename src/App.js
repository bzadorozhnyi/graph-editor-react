import './App.css';
import stylesheet from './stylesheet.json';
import React, { useState, useRef } from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from 'file-saver';
import UserMenu from './components/UserMenu';
import Button from '@mui/material/Button';

function concatNodesAndEdges(elements) {
  const {nodes, edges} = elements;
  return nodes.concat(edges);
}

function App() {
  const cyRef = useRef(cytoscape({ /* options */ }));
  const [tappedNodeId, setTappedNodeId] = useState('');
  const [tappedEdgeId, setTappedEdgeId] = useState('');

  const [elements, setElements] = useState({
    dictOfNodes: {},
    nodes: [],
    edges: []
  });

  const [styles, setStyles] = useState({
    edges: {},
    nodes: {},
    isEdgeStyleCopyActive: false,
    isNodeStyleCopyActive: false,
  });

  cyRef.current.removeListener('tap');
  cyRef.current.on('tap', 'node', (event) => {
    let newTappedNodeId = event.target.id();
    if(elements.isNodeStyleCopyActive) {
      // copy style from tapped node to previous tapped node 
      styles.nodes[tappedNodeId] = typeof styles.nodes[newTappedNodeId] === 'undefined' ? {} : {...styles.nodes[newTappedNodeId]};

      // update data in elements
      let newElements = JSON.parse(JSON.stringify(elements));
      let tappedNode = newElements.nodes.find(node => node.data.id === tappedNodeId);
      tappedNode.data = { id: tappedNodeId, label: tappedNodeId, ...styles.nodes[tappedNodeId] };

      // reset node's (copy button icon) props
      newElements.isNodeStyleCopyActive = false;

      setElements({...newElements});
      setStyles({...styles})
    }
    else {
      setTappedNodeId(newTappedNodeId);
    }
  });
  cyRef.current.on('remove', 'node', (event) => {
    let node = event.target;
    delete styles.nodes[node.id()];
    if(node.id() === tappedNodeId) {
      setTappedNodeId('');
    }
    if(elements.isNodeStyleCopyActive) {
      elements.isNodeStyleCopyActive = false;
      setElements({...elements});
    }
    setStyles({...styles});
  });

  cyRef.current.on('tap', 'edge', (event) => {
    let newTappedEdgeId = event.target.id();
    if(elements.isEdgeStyleCopyActive) {
      // copy style from tapped edge to previous tapped edge 
      styles.edges[tappedEdgeId] = typeof styles.edges[newTappedEdgeId] === 'undefined' ? {} : {...styles.edges[newTappedEdgeId]};
      
      // update data in elements
      let newElements = JSON.parse(JSON.stringify(elements));
      let tappedEdge = newElements.edges.find(edge => edge.data.id === tappedEdgeId);
      tappedEdge.data = { id: tappedEdgeId, label: tappedEdge.data.label, ...styles.edges[tappedEdgeId] };

      // reset edge's (copy button icon) props
      newElements.isEdgeStyleCopyActive = false;

      setElements({...newElements});
      setStyles({...styles})
    }
    else {
      setTappedEdgeId(newTappedEdgeId);
    }
  });
  cyRef.current.on('remove', 'edge', (event) => {
    // update and (set empty) of tappedEdgeId implemented in EdgesEditor
    if(elements.isEdgeStyleCopyActive) {
      elements.isEdgeStyleCopyActive = false;
      setElements({...elements});
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
            width: '600px'
          }}
          stylesheet={stylesheet}
          cy={(cy) => { cyRef.current = cy; }}
        />

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

      <div className="download-buttons-wrapper">
        <Button onClick={() => { saveAs(cyRef.current.png(), 'graph.png') }} variant='outlined' >Download PNG</Button>
        <Button onClick={() => { saveAs(cyRef.current.jpg(), 'graph.jpg') }} variant='outlined' >Download JPG</Button>
      </div>
    </div>
  );
}

export default App;
