import CopyStyleButton from './CopyStyleButton';
import { ColorPicker } from 'material-ui-color';
import { Slider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import customDeepCopy from '../customDeepCopy';
import { BLACK, DEFAULT_EDGE, GRAY } from '../constants';

function EdgeEditor(props) {
    let { elements, setElements, tappedEdgeId } = props;

    const tappedEdge = tappedEdgeId !== ''
        ? elements.edges.find(edge => edge.data.id === tappedEdgeId).data
        : customDeepCopy(DEFAULT_EDGE.data);

    console.log(tappedEdge);

    return (
        <div className='style-editor panel'>
            <div>
                <h1>{tappedEdge.id}</h1>
                <div style={{ position: 'absolute', top: '95px', zIndex: '100' }}>
                    <CopyStyleButton
                        elements={elements}
                        isActiveCopy={elements.isEdgeStyleCopyActive}
                        setElements={setElements}
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
                            if (tappedEdgeId !== '') {
                                let newColor = value.css.backgroundColor.substring(0, 7);
                                let newOpacity = value.alpha;

                                // base on user`s input set background and opacity
                                // P.S. if newColor.length === 5 cause warnings, maybe should be fixed in future
                                tappedEdge.edgeColor = (value.hasOwnProperty('error') ? 'transparent' : newColor);
                                tappedEdge.edgeOpacity = (value.hasOwnProperty('error') ? 0 : newOpacity);

                                // need to set current color with opacity in ColorPicker
                                tappedEdge.edgeColorPicker = value;
                                setElements(customDeepCopy(elements));
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
                                if (tappedEdgeId !== '') {
                                    tappedEdge.edgeWidth = value;
                                    setElements(customDeepCopy(elements));
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
                            if (tappedEdgeId !== '') {
                                tappedEdge.edgeLineStyle = value;
                                setElements(customDeepCopy(elements));
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
                            if (tappedEdgeId !== '') {
                                let newColor = value.css.backgroundColor;
                                tappedEdge.labelColor = (value.hasOwnProperty('error') ? 'black' : newColor);
                                //need to set text color in ColorPicker
                                tappedEdge.labelColorPicker = value;
                                setElements(customDeepCopy(elements));
                            }
                        }}
                        value={tappedEdge.labelColorPicker}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            max={30}
                            min={10}
                            onChange={(_, value) => {
                                if (tappedEdgeId !== '') {
                                    tappedEdge.labelSize = value;
                                    setElements(customDeepCopy(elements));
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
                                    if (tappedEdgeId !== '') {
                                        tappedEdge.labelMarginX = value;
                                        setElements(customDeepCopy(elements));
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
                                    if (tappedEdgeId !== '') {
                                        tappedEdge.labelMarginY = value;
                                        setElements(customDeepCopy(elements));
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