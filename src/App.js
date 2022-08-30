import './App.css';
import stylesheet from './stylesheet.json';
import React, { useState, useRef } from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from 'file-saver';
import UserMenu from './components/UserMenu';
import Button from '@mui/material/Button';
import customDeepCopy from './customDeepCopy';
import { EMPTY_FRAME } from './constants';

function App() {
  // handle graph events and data memorization 
  const cyRef = useRef(cytoscape({ /* options */ }));

  function getPNG() {
    return cyRef.current.png({
      bg: 'white'
    });
  }

  const [frames, setFrames] = useState([customDeepCopy(EMPTY_FRAME)]);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);

  cyRef.current.removeListener('tap');
  cyRef.current.on('tap', 'node', (event) => {
    let newTappedNodeId = event.target.id();
    if (frames[selectedFrameIndex].elements.isActiveCopy.node) {
      // update data in elements
      let tappedNodeIndex = frames[selectedFrameIndex].elements.nodes.findIndex(node => node.data.id === frames[selectedFrameIndex].elements.tappedNodeId);
      let newTappedNode = frames[selectedFrameIndex].elements.nodes.find(node => node.data.id === newTappedNodeId).data;

      frames[selectedFrameIndex].elements.nodes[tappedNodeIndex].data = {
        ...newTappedNode,
        id: frames[selectedFrameIndex].elements.tappedNodeId,
        label: frames[selectedFrameIndex].elements.tappedNodeId,
      };

      // reset node's (copy button icon) props
      frames[selectedFrameIndex].elements.isActiveCopy.node = false;

      setFrames(customDeepCopy(frames));
    }
    else {
      frames[selectedFrameIndex].elements.tappedNodeId = newTappedNodeId;
      setFrames(customDeepCopy(frames));
    }
  });

  cyRef.current.removeListener('remove', 'node');
  cyRef.current.on('remove', 'node', (_) => {
    // update and (set empty) of tappedNodeId implemented in EdgesEditor
    if (frames[selectedFrameIndex].elements.isActiveCopy.node) {
      frames[selectedFrameIndex].elements.isActiveCopy.node = false;
      setFrames(customDeepCopy(frames));
    }
  });

  cyRef.current.removeListener('dragfree', 'node');
  cyRef.current.on('dragfree', 'node', (event) => {
    let graggedNodeId = event.target._private.data.id;
    let newPosition = cyRef.current.$id(graggedNodeId).position();
    let draggedNode = frames[selectedFrameIndex].elements.nodes.find(node => node.data.id === graggedNodeId);
    draggedNode.position = newPosition;
    setFrames(customDeepCopy(frames));
  })

  cyRef.current.removeListener('tap', 'edge');
  cyRef.current.on('tap', 'edge', (event) => {
    let newTappedEdgeId = event.target.id();
    if (frames[selectedFrameIndex].elements.isActiveCopy.edge) {
      // update data in elements
      let tappedEdgeIndex = frames[selectedFrameIndex].elements.edges.findIndex(edge => edge.data.id === frames[selectedFrameIndex].elements.tappedEdgeId);
      let tappedEdge = frames[selectedFrameIndex].elements.edges.find(edge => edge.data.id === frames[selectedFrameIndex].elements.tappedEdgeId).data;
      let newTappedEdge = frames[selectedFrameIndex].elements.edges.find(edge => edge.data.id === newTappedEdgeId).data;

      frames[selectedFrameIndex].elements.edges[tappedEdgeIndex].data = {
        ...customDeepCopy(newTappedEdge),
        arrow: tappedEdge.arrow,
        id: tappedEdge.id,
        source: tappedEdge.source,
        target: tappedEdge.target,
        label: tappedEdge.label,
      };

      // reset edge's (copy button icon) props
      frames[selectedFrameIndex].elements.isActiveCopy.edge = false;

      setFrames(customDeepCopy(frames));
    }
    else {
      frames[selectedFrameIndex].elements.tappedEdgeId = newTappedEdgeId;
      setFrames(customDeepCopy(frames));
    }
  });

  cyRef.current.removeListener('remove', 'edge');
  cyRef.current.on('remove', 'edge', (_) => {
    // update and (set empty) of tappedEdgeId implemented in EdgesEditor
    if (frames[selectedFrameIndex].elements.isActiveCopy.edge) {
      frames[selectedFrameIndex].elements.isActiveCopy.edge = false;
      setFrames(customDeepCopy(frames));
    }
  });

  return (
    <div className="App">
      <div className="graph-wrapper">
        <CytoscapeComponent
          autounselectify
          elements={CytoscapeComponent.normalizeElements({
            nodes: frames[selectedFrameIndex].elements.nodes,
            edges: frames[selectedFrameIndex].elements.edges
          })}
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
            frames={frames}
            getPNG={getPNG}
            setFrames={setFrames}
            selectedFrameIndex={selectedFrameIndex}
            setSelectedFrameIndex={setSelectedFrameIndex}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '40%' }}>
        <div style={{ display: 'flex' }}>
          <Button
            onClick={() => { saveAs(cyRef.current.png(), 'graph.png') }}
            style={{ margin: '20px 10px 20px 0px' }}
            variant='outlined' >
            Download PNG
          </Button>
          <Button
            onClick={() => { saveAs(cyRef.current.jpg(), 'graph.jpg') }}
            style={{ margin: '20px 10px 20px 0px' }}
            variant='outlined' >
            Download JPG
          </Button>
        </div>
        <Button
          color='error'
          onClick={() => {
            frames[selectedFrameIndex] = customDeepCopy(EMPTY_FRAME);
            setFrames(customDeepCopy(frames));
          }}
          style={{ margin: '20px 0px' }}
          variant='outlined' >
          Clear frame
        </Button>
      </div>
    </div>
  );
}

export default App;
