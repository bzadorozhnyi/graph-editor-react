import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import EdgeEditor from './EdgeEditor';
import EdgesEditor from './EdgesEditor';
import NodeEditor from './NodeEditor';

export default function UserMenu(props) {
    const [value, setValue] = useState(0);
    const handleChange = (event, value) => {
        setValue(value);
    };
    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs onChange={handleChange} value={value}>
                    <Tab label='Edges editor' />
                    <Tab label='Node styling' />
                    <Tab label='Edge styling' />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <EdgesEditor
                    elements={props.elements}
                    setElements={props.setElements}
                    setStyles={props.setStyles}
                    setTappedEdgeId={props.setTappedEdgeId}
                    styles={props.styles}
                    tappedEdgeId={props.tappedEdgeId}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <NodeEditor
                    elements={props.elements}
                    tappedNodeId={props.tappedNodeId}
                    setElements={props.setElements}
                    setStyles={props.setStyles}
                    styles={props.styles}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <EdgeEditor
                    elements={props.elements}
                    setElements={props.setElements}
                    setStyles={props.setStyles}
                    styles={props.styles}
                    tappedEdgeId={props.tappedEdgeId}
                />
            </TabPanel>
        </div>
    );
}

function TabPanel(props) {
    return <div style={{height: '700px'}} hidden={props.value !== props.index}>{props.children}</div>;
}
