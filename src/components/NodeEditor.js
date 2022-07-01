import CopyStyleButton from './CopyStyleButton';
import { ColorPicker } from 'material-ui-color';
import { Slider } from '@mui/material';
import customDeepCopy from "../customDeepCopy";
import { BLACK, GRAY, DEFAULT_NODE } from '../constants';

function NodeEditor(props) {
    let { frames, setFrames, selectedFrameIndex } = props;
    
    const tappedNode = frames[selectedFrameIndex].elements.tappedNodeId !== ''
        ? frames[selectedFrameIndex].elements.nodes.find(node => node.data.id === frames[selectedFrameIndex].elements.tappedNodeId).data
        : customDeepCopy(DEFAULT_NODE.data);

    return (
        <div className="style-editor panel">
            <div>
                <h1>{tappedNode.label}</h1>
                <div style={{ position: 'absolute', top: '85px', zIndex: '100' }}>
                    <CopyStyleButton
                        frames={frames}
                        setFrames={setFrames}
                        selectedFrameIndex={selectedFrameIndex}
                        type='node'
                    />
                </div>
            </div>

            <div className='panel'>
                <h1>Node</h1>
                <hr></hr>
                <div className='menu-control'>
                    <ColorPicker
                        defaultValue={GRAY}
                        hideTextfield
                        onChange={(value) => {
                            if (frames[selectedFrameIndex].elements.tappedNodeId !== '') {
                                let newColor = value.css.backgroundColor.substring(0, 7);
                                let newOpacity = value.alpha;

                                // base on user`s input set background and opacity
                                // P.S. if newColor.length === 5 cause warnings, maybe should be fixed in future
                                tappedNode.nodeColor = (value.hasOwnProperty('error') ? 'transparent' : newColor);
                                tappedNode.nodeOpacity = (value.hasOwnProperty('error') ? 0 : newOpacity);

                                // need to set current color with opacity in ColorPicker
                                tappedNode.nodeColorPicker = value;
                                setFrames(customDeepCopy(frames));
                            }
                        }}
                        value={tappedNode.nodeColorPicker}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            marks
                            max={100}
                            min={50}
                            onChange={(_, value) => {
                                if (frames[selectedFrameIndex].elements.tappedNodeId !== '') {
                                    tappedNode.nodeSize = value;
                                    setFrames(customDeepCopy(frames));
                                }
                            }}
                            step={10}
                            value={tappedNode.nodeSize}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </div>
            </div>

            <div className='panel'>
                <h1>Label</h1>
                <hr></hr>
                <div className='menu-control'>
                    <ColorPicker
                        defaultValue={BLACK}
                        disableAlpha
                        hideTextfield
                        onChange={(value) => {
                            if (frames[selectedFrameIndex].elements.tappedNodeId !== '') {
                                let newColor = value.css.backgroundColor;
                                tappedNode.labelColor = (value.hasOwnProperty('error') ? 'black' : newColor);
                                //need to set text color in ColorPicker
                                tappedNode.labelColorPicker = value;
                                setFrames(customDeepCopy(frames));
                            }
                        }}
                        value={tappedNode.labelColorPicker}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            max={45}
                            min={15}
                            onChange={(event) => {
                                let newLabelSize = Number(event.target.value);
                                if (frames[selectedFrameIndex].elements.tappedNodeId !== '') {
                                    tappedNode.labelSize = newLabelSize;
                                    setFrames(customDeepCopy(frames));
                                }
                            }}
                            step={5}
                            value={tappedNode.labelSize}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </div>
            </div>

            <div className='panel'>
                <h1>Border</h1>
                <hr></hr>
                <div className='menu-control'>
                    <ColorPicker
                        defaultValue={BLACK}
                        disableAlpha
                        hideTextfield
                        onChange={(value) => {
                            if (frames[selectedFrameIndex].elements.tappedNodeId !== '') {
                                let newColor = value.css.backgroundColor;
                                tappedNode.borderColor = (value.hasOwnProperty('error') ? 'black' : newColor);
                                //need to set border color in ColorPicker
                                tappedNode.borderColorPicker = value;
                                setFrames(customDeepCopy(frames));
                            }
                        }}
                        value={tappedNode.borderColorPicker}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            marks
                            max={10}
                            min={0}
                            onChange={(_, value) => {
                                if (frames[selectedFrameIndex].elements.tappedNodeId !== '') {
                                    tappedNode.borderWidth = value;
                                    setFrames(customDeepCopy(frames));
                                }
                            }}
                            step={1}
                            value={tappedNode.borderWidth}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NodeEditor;