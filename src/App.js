import './App.css';
import stylesheet from './stylesheet.json';
import React, { useState, useRef } from 'react'
import CytoscapeComponent from 'react-cytoscapejs';
import AceEditor from "react-ace";

function updateGraph(userInput) {
  let elements = [];
  userInput.split('\n').forEach(function(row) {
    let items = row.split(' ').filter(item => item.length > 0);
    switch(items.length) {
      case 0:
        break;
      case 1:
        elements.push({ data: { id: items[0], label: items[0] } });
        break;
      case 2:
        elements.push({ data: { id: items[0], label: items[0] } });
        elements.push({ data: { id: items[1], label: items[1] } });
        elements.push({ data: { source: items[0], target: items[1] } });
        break;
      case 3:
        elements.push({ data: { id: items[0], label: items[0] } });
        elements.push({ data: { id: items[1], label: items[1] } });
        elements.push({ data: { source: items[0], target: items[1], label: items[2] } });
        break;
    }
  });
  return elements;
}

function App() {
  const cyRef = useRef();
  const [elements, setElements] = useState();
  return (
    <div className="App">
      <div className="graph-wrapper">
        <CytoscapeComponent
          elements={elements}
          style={{
            backgroundColor: 'green',
            height: '100%',
            width: '600px'
          }}
          stylesheet={stylesheet}
          cy={(cy) => (cyRef.current = cy)}
        />
        <AceEditor
          mode="javascript"
          theme="github"
          onChange={userInput => setElements(updateGraph(userInput))}
        />
      </div>
    </div>
  );
}

export default App;
