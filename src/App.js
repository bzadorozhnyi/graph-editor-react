import './App.css';
import stylesheet from './stylesheet.json';
import React, { useState, useRef } from 'react'
import cytoscape from 'cytoscape'; 
import CytoscapeComponent from 'react-cytoscapejs';
import AceEditor from 'react-ace';
import { saveAs } from 'file-saver';

function updateGraph(userInput, oldEdges, direction) {
  // console.log(oldEdges);
  let edges = {
    undirected: [],
    directed: []
  };

  if(direction === 'undirected')
    edges.directed = oldEdges.directed;
  else
    edges.undirected = oldEdges.undirected;

  userInput.split('\n').forEach(function(row) {
    let items = row.split(' ').filter(item => item.length > 0);
    switch(items.length) {
      case 0:
        break;
      case 1:
        edges[direction].push({ data: { id: items[0], label: items[0] } });
        break;
      case 2:
        edges[direction].push({ data: { id: items[0], label: items[0] } });
        edges[direction].push({ data: { id: items[1], label: items[1] } });
        if(direction === 'undirected')
          edges[direction].push({ data: { source: items[0], target: items[1] } });
        else
          edges[direction].push({ data: { source: items[0], target: items[1], arrow: "triangle" } });
        break;
      case 3:
        edges[direction].push({ data: { id: items[0], label: items[0] } });
        edges[direction].push({ data: { id: items[1], label: items[1] } });
        if(direction === 'undirected')
          edges[direction].push({ data: { source: items[0], target: items[1], label: items[2] } });
        else
          edges[direction].push({ data: { source: items[0], target: items[1], label: items[2], arrow: 'triangle' } });
        break;
    }
  });
  return edges;
}

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
            backgroundColor: 'green',
            height: '100%',
            width: '600px'
          }}
          stylesheet={stylesheet}
          cy={(cy) => (cyRef.current = cy)}
        />
        <div>
          <h3>Undirected edges</h3>
          <AceEditor
            className='input-graph-data'
            mode='javascript'
            name='undirected'
            theme='github'
            height='250px'
            width='300px'
            onChange={userInput => setEdges(updateGraph(userInput, edges, 'undirected'))}
          />
          <h3>Directed edges</h3>
          <AceEditor
            className='input-graph-data'
            mode='javascript'
            name='directed'
            theme='github'
            height='250px'
            width='300px'
            onChange={userInput => setEdges(updateGraph(userInput, edges, 'directed'))}
          />
        </div>
      </div>
      <button onClick={ () => { saveAs(cyRef.current.png(), "graph.png") } }>Download</button>
    </div>
  );
}

export default App;
