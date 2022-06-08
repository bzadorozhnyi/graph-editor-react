import { Button } from "@mui/material";
import { React, useState } from "react";
import '../App.css';

function TextEdgeInputs(props) {
    return(
        <div>
            <div id="addListBlock">
                Add list of edges
            </div>
            <div id="textEdgeInputs">
                <TextInputs onAdd={props.onAdd} />
            </div>
        </div>
    );
}

function TextInputs(props) {
    const [textEdges, setTextEdges] = useState('');

    return (
        <div style={{
            backgroundColor: '#E5F4F8',
            border: '0.5px solid black', 
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            position: 'absolute',
            width: '300px'
        }}>
            <textarea
                id='text-editor'
                style={{height: '400px', resize: 'none'}}
                onChange={(event) => {setTextEdges(event.target.value)}}
                value={textEdges}
            />
            <Button onClick={() => {props.onAdd(textEdges, setTextEdges)}}>
                Add
            </Button>
        </div>
    );
}

export default TextEdgeInputs;