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
    nodes: {}
  });

  cyRef.current.removeListener('tap');
  cyRef.current.on('tap', 'node', (event) => {
    setTappedNodeId(event.target.id());
  });
  cyRef.current.on('remove', 'node', (event) => {
    let node = event.target;
    delete styles.nodes[node.id()];
    if(node.id() === tappedNodeId) {
      setTappedNodeId('');
    }
    setStyles({...styles});
  });

  cyRef.current.on('tap', 'edge', (event) => {
    setTappedEdgeId(event.target.id());
  });
  // update and (set empty) of tappedEdgeId implemented in EdgesEditor

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
