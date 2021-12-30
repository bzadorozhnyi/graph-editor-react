import './App.css';
import stylesheet from './stylesheet.json';
import { updateGraph } from './graphFunctions/updateGraph.js';
import React, { useState, useRef } from 'react'
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import AceEditor from 'react-ace';
import { saveAs } from 'file-saver';

function App() {
  const cyRef = useRef(cytoscape({ /* options */ }));
  const [edges, setEdges] = useState({
    undirected: [],
    directed: []
  });
  return (
    <div className="App">
      <div className="graph-wrapper">
        <CytoscapeComponent
          elements={edges.undirected.concat(edges.directed)}
          style={{
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '6px',
            height: '100%',
            width: '600px'
          }}
          stylesheet={stylesheet}
          cy={(cy) => { cyRef.current = cy }}
        />
        <div>
          <h3>Undirected edges</h3>
          <AceEditor
            className='input-graph-data'
            mode='javascript'
            name='undirected'
            height='235px'
            width='300px'
            onChange={(userInput) => { setEdges(updateGraph(userInput, edges, 'undirected')) }}
          />
          <h3>Directed edges</h3>
          <AceEditor
            className='input-graph-data'
            mode='javascript'
            name='directed'
            height='235px'
            width='300px'
            onChange={(userInput) => { setEdges(updateGraph(userInput, edges, 'directed')) }}
          />
        </div>
      </div>

      <div className="download-buttons-wrapper">
        <button className='download-button' onClick={() => { saveAs(cyRef.current.png(), 'graph.png') }}>Download PNG</button>
        <button className='download-button' onClick={() => { saveAs(cyRef.current.jpg(), 'graph.jpg') }}>Download JPG</button>
      </div>
    </div>
  );
}

export default App;
