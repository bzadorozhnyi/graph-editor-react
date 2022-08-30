import '../styles/TextEdgeInputs.css';
import { Button } from "@mui/material";
import { React, useState } from "react";

function TextEdgeInputs(props) {
    const [textEdges, setTextEdges] = useState('');

    return (
        <div>
            <div id="addListBlock">
                ADD LIST OF EDGES
            </div>
            <div id="textEdgeInputs">
                <div>
                    <textarea
                        onChange={(event) => { setTextEdges(event.target.value) }}
                        value={textEdges}
                    />
                    <Button onClick={() => { props.onAdd(textEdges, setTextEdges) }} variant='outlined'>
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TextEdgeInputs;