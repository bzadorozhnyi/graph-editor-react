import './App.css';
import stylesheet from './stylesheet.json';
import { updateInputData } from './graphFunctions/updateInputData.js';
import React, { useState, useRef } from 'react'
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import AceEditor from 'react-ace';
import { saveAs } from 'file-saver';

function App() {
  const cyRef = useRef(cytoscape({ /* options */ }));
  const undirectedEditorRef = useRef();
  const directedEditorRef = useRef();

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
            annotations={[]}
            className='input-graph-data'
            mode='javascript'
            name='undirected'
            ref={(editor) => { undirectedEditorRef.current = editor }}
            height='235px'
            width='300px'
            onChange={(userInput) => {
              const { newAnnotations, newEdges } = updateInputData(userInput, edges, 'undirected');
              // update annotations
              undirectedEditorRef.current.editor.getSession().setAnnotations(newAnnotations);
              setEdges(newEdges);
            }}
          />
          
          <h3>Directed edges</h3>
          <AceEditor
            className='input-graph-data'
            mode='javascript'
            name='directed'
            ref={(editor) => { directedEditorRef.current = editor }}
            height='235px'
            width='300px'
            onChange={(userInput) => {
              const { newAnnotations, newEdges } = updateInputData(userInput, edges, 'directed');
              // update annotations
              directedEditorRef.current.editor.getSession().setAnnotations(newAnnotations);
              setEdges(newEdges);
            }}
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
