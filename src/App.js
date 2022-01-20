import './App.css';
import stylesheet from './stylesheet.json';
import { updateInputData } from './graphFunctions/updateInputData.js';
import React, { useState, useRef } from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import AceEditor from 'react-ace';
import { saveAs } from 'file-saver';
import NodeEditor from './NodeEditor';

function concatNodesAndEdges(elements) {
  const {nodes, edges} = elements;
  return nodes.concat(edges.undirected, edges.directed);
}

function App() {
  const cyRef = useRef(cytoscape({ /* options */ }));
  const undirectedEditorRef = useRef();
  const directedEditorRef = useRef();
  const [tappedNodeId, setTappedNodeId] = useState('');

  const [elements, setElements] = useState({
    nodes: [],
    edges: {
        directed: [],
        undirected: []
    }
  });

  const [styles, setStyles] = useState({
    edges: {},
    nodes: {}
  });

  cyRef.current.removeListener('tap');
  cyRef.current.on('tap', 'node', (event) => {
    let node = event.target;
    setTappedNodeId(node.id());
  });
  cyRef.current.on('remove', 'node', (event) => {
    let node = event.target;
    delete styles.nodes[node.id()];
    if(node.id() === tappedNodeId) {
      setTappedNodeId('');
    }
    setStyles({...styles});
  })

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

        <NodeEditor
          elements={elements}
          tappedNodeId={tappedNodeId}
          setElements={setElements}
          setStyles={setStyles}
          styles={styles}
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
            onChange={(undirectedValue) => {
              const directedValue = directedEditorRef.current.editor.getValue();
              const { newAnnotations, newElements } = updateInputData(undirectedValue, directedValue, styles);
              // update annotations
              undirectedEditorRef.current.editor.getSession().setAnnotations(newAnnotations);
              setElements(newElements);
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
            onChange={(directedValue) => {
              const undirectedValue = undirectedEditorRef.current.editor.getValue();
              const { newAnnotations, newElements } = updateInputData(undirectedValue, directedValue, styles);
              // update annotations
              directedEditorRef.current.editor.getSession().setAnnotations(newAnnotations);
              setElements(newElements);
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
