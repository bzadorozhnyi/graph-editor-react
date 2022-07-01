import CopyStyleButton from './CopyStyleButton';
import { ColorPicker } from 'material-ui-color';
import { Slider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import customDeepCopy from '../customDeepCopy';
import { BLACK, DEFAULT_EDGE, GRAY } from '../constants';

function EdgeEditor(props) {
    let { frames, setFrames, selectedFrameIndex } = props;

    const tappedEdge = frames[selectedFrameIndex].elements.tappedEdgeId !== ''
        ? frames[selectedFrameIndex].elements.edges.find(edge => edge.data.id === frames[selectedFrameIndex].elements.tappedEdgeId).data
        : customDeepCopy(DEFAULT_EDGE.data);

    return (
        <div className='style-editor panel'>
            <div>
                <h1>{tappedEdge.id}</h1>
                <div style={{ position: 'absolute', top: '95px', zIndex: '100' }}>
                    <CopyStyleButton
                        frames={frames}
                        setFrames={setFrames}
                        selectedFrameIndex={selectedFrameIndex}
                        type='edge'
                    />
                </div>
            </div>

            <div className='panel'>
                <h1>Edge</h1>
                <hr></hr>
                <div className='menu-control'>
                    <ColorPicker
                        defaultValue={GRAY}
                        hideTextfield
                        onChange={(value) => {
                            if (frames[selectedFrameIndex].elements.tappedEdgeId !== '') {
                                let newColor = value.css.backgroundColor.substring(0, 7);
                                let newOpacity = value.alpha;

                                // base on user`s input set background and opacity
                                // P.S. if newColor.length === 5 cause warnings, maybe should be fixed in future
                                tappedEdge.edgeColor = (value.hasOwnProperty('error') ? 'transparent' : newColor);
                                tappedEdge.edgeOpacity = (value.hasOwnProperty('error') ? 0 : newOpacity);

                                // need to set current color with opacity in ColorPicker
                                tappedEdge.edgeColorPicker = value;
                                setFrames(customDeepCopy(frames));
                            }
                        }}
                        value={tappedEdge.edgeColorPicker}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            marks
                            max={10}
                            min={1}
                            onChange={(_, value) => {
                                if (frames[selectedFrameIndex].elements.tappedEdgeId !== '') {
                                    tappedEdge.edgeWidth = value;
                                    setFrames(customDeepCopy(frames));
                                }
                            }}
                            step={1}
                            value={tappedEdge.edgeWidth}
                            valueLabelDisplay='auto'
                        />
                    </div>
                    <ToggleButtonGroup
                        color='primary'
                        defaultValue={'solid'}
                        exclusive
                        onChange={(_, value) => {
                            if (frames[selectedFrameIndex].elements.tappedEdgeId !== '') {
                                tappedEdge.edgeLineStyle = value;
                                setFrames(customDeepCopy(frames));
                            }
                        }}
                        value={tappedEdge.edgeLineStyle}
                    >
                        <ToggleButton value='solid'>Solid</ToggleButton>
                        <ToggleButton value='dotted'>Dotted</ToggleButton>
                        <ToggleButton value='dashed'>Dashed</ToggleButton>
                    </ToggleButtonGroup>
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
                            if (frames[selectedFrameIndex].elements.tappedEdgeId !== '') {
                                let newColor = value.css.backgroundColor;
                                tappedEdge.labelColor = (value.hasOwnProperty('error') ? 'black' : newColor);
                                //need to set text color in ColorPicker
                                tappedEdge.labelColorPicker = value;
                                setFrames(customDeepCopy(frames));
                            }
                        }}
                        value={tappedEdge.labelColorPicker}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            max={30}
                            min={10}
                            onChange={(_, value) => {
                                if (frames[selectedFrameIndex].elements.tappedEdgeId !== '') {
                                    tappedEdge.labelSize = value;
                                    setFrames(customDeepCopy(frames));
                                }
                            }}
                            step={5}
                            value={tappedEdge.labelSize}
                            valueLabelDisplay='auto'
                        />
                    </div>
                </div>
                <hr></hr>
                <div className='menu-control'>
                    <div className='row'>
                        <h2>X</h2>
                        <div className='slider-wrapper'>
                            <Slider
                                max={20}
                                min={-20}
                                onChange={(_, value) => {
                                    if (frames[selectedFrameIndex].elements.tappedEdgeId !== '') {
                                        tappedEdge.labelMarginX = value;
                                        setFrames(customDeepCopy(frames));
                                    }
                                }}
                                step={1}
                                value={tappedEdge.labelMarginX}
                                valueLabelDisplay='auto'
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <h2>Y</h2>
                        <div className='slider-wrapper'>
                            <Slider
                                max={20}
                                min={-20}
                                onChange={(_, value) => {
                                    if (frames[selectedFrameIndex].elements.tappedEdgeId !== '') {
                                        tappedEdge.labelMarginY = value;
                                        setFrames(customDeepCopy(frames));
                                    }
                                }}
                                step={1}
                                value={tappedEdge.labelMarginY}
                                valueLabelDisplay='auto'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EdgeEditor;