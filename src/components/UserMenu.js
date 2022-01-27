import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
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
                    <Tab label='Node styling' />
                    <Tab label='Edges editor' />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <NodeEditor
                    elements={props.elements}
                    tappedNodeId={props.tappedNodeId}
                    setElements={props.setElements}
                    setStyles={props.setStyles}
                    styles={props.styles}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <EdgesEditor
                    elements={props.elements}
                    setElements={props.setElements}
                    setStyles={props.setStyles}
                    styles={props.styles}
                />
            </TabPanel>
        </div>
    );
}

function TabPanel(props) {
    return <div style={{height: '700px'}} hidden={props.value !== props.index}>{props.children}</div>;
}
