import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import EdgeEditor from './EdgeEditor';
import EdgesEditor from './EdgesEditor';
import NodeEditor from './NodeEditor';
import Animation from "./Animation";

export default function UserMenu(props) {
    const [value, setValue] = useState(0);
    const handleChange = (_, value) => {
        setValue(value);
    };
    return (
        <div style={{ widht: "60%" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs centered onChange={handleChange} value={value}>
                    <Tab label='Edges editor' />
                    <Tab label='Node styling' />
                    <Tab label='Edge styling' />
                    <Tab label='Animation' />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <EdgesEditor
                    frames={props.frames}
                    setFrames={props.setFrames}
                    selectedFrameIndex={props.selectedFrameIndex}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <NodeEditor
                    frames={props.frames}
                    setFrames={props.setFrames}
                    selectedFrameIndex={props.selectedFrameIndex}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <EdgeEditor
                    frames={props.frames}
                    setFrames={props.setFrames}
                    selectedFrameIndex={props.selectedFrameIndex}
                />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Animation
                    frames={props.frames}
                    getPNG={props.getPNG}
                    setFrames={props.setFrames}
                    selectedFrameIndex={props.selectedFrameIndex}
                    setSelectedFrameIndex={props.setSelectedFrameIndex}
                />
            </TabPanel>
        </div>
    );
}

function TabPanel(props) {
    return <div style={{ height: '635px' }} hidden={props.value !== props.index}>{props.children}</div>;
}
