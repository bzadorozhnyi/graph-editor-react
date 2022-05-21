import CopyStyleButton from './CopyStyleButton';
import { ColorPicker, createColor } from 'material-ui-color';
import { Slider } from '@mui/material';
import customDeepCopy from "../customDeepCopy";

function NodeEditor(props) {
    let { elements, tappedNodeId, setElements, setStyles, styles } = props;
    let grayColor = createColor('#808080');
    let blackColor = createColor('black');

    return (
        <div className="style-editor panel">
            <div>
                <h1>{ tappedNodeId === '' ? 'Node not selected' : tappedNodeId }</h1>
                <div style={{position: 'absolute', top: '85px', zIndex: '100'}}>
                    <CopyStyleButton
                        elements={elements}
                        isActiveCopy={elements.isNodeStyleCopyActive}
                        setElements={setElements}
                        type='node'
                    />
                </div>
            </div>

            <div className='panel'>
                <h1>Node</h1>
                <hr></hr>
                <div className='menu-control'>
                    <ColorPicker
                        defaultValue={grayColor}
                        hideTextfield
                        onChange={(value) => {
                            if (tappedNodeId !== '') {
                                if (!(tappedNodeId in styles.nodes)) {
                                    styles.nodes[tappedNodeId] = {};
                                }
                                
                                let newColor = value.css.backgroundColor.substring(0, 7);
                                let newOpacity = value.alpha;

                                // base on user`s input set background and opacity
                                // P.S. if newColor.length === 5 cause warnings, maybe should be fixed in future
                                styles.nodes[tappedNodeId].backgroundColor = (value.hasOwnProperty('error') ? 'transparent' : newColor);
                                styles.nodes[tappedNodeId].opacity = (value.hasOwnProperty('error') ? 0 : newOpacity);
                                
                                // need to set current color with opacity in ColorPicker
                                styles.nodes[tappedNodeId].backgroundColorAndOpacity = value;

                                let newElements = customDeepCopy(elements);
                                let tappedNode = newElements.nodes.find(node => node.data.id === tappedNodeId);

                                tappedNode.data.backgroundColor = newColor;
                                tappedNode.data.opacity = newOpacity;

                                setElements(newElements);
                                setStyles(styles);
                            }
                        }}
                        value={(tappedNodeId in styles.nodes) && (styles.nodes[tappedNodeId].hasOwnProperty('backgroundColorAndOpacity')) ? styles.nodes[tappedNodeId].backgroundColorAndOpacity : grayColor}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            marks
                            max={100}
                            min={50}
                            onChange={(event, value) => {
                                if (tappedNodeId !== '') {
                                    if (!(tappedNodeId in styles.nodes)) {
                                        styles.nodes[tappedNodeId] = {};
                                    }
                                    styles.nodes[tappedNodeId].size = value;
                                    
                                    let newElements = customDeepCopy(elements);
                                    newElements.nodes.find(x => x.data.id === tappedNodeId).data.size = value;

                                    setElements(newElements);
                                    setStyles(styles);
                                }
                            }}
                            step={10}
                            value={(tappedNodeId in styles.nodes) ? styles.nodes[tappedNodeId].size : 50} // set node`s size
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
                        defaultValue={grayColor}
                        disableAlpha
                        hideTextfield
                        onChange={(value) => {
                            if (tappedNodeId !== '') {
                                if (!(tappedNodeId in styles.nodes)) {
                                    styles.nodes[tappedNodeId] = {};
                                }
                                
                                let newColor = value.css.backgroundColor;
                                styles.nodes[tappedNodeId].color = (value.hasOwnProperty('error') ? 'black' : newColor);
                                //need to set text color in ColorPicker
                                styles.nodes[tappedNodeId].textColorPicker = value;

                                let newElements = customDeepCopy(elements);
                                let tappedNode = newElements.nodes.find(x => x.data.id === tappedNodeId);

                                tappedNode.data.color = newColor;

                                setElements(newElements);
                                setStyles(styles);
                            }
                        }}
                        value={(tappedNodeId in styles.nodes) && (styles.nodes[tappedNodeId].hasOwnProperty('textColorPicker')) ? styles.nodes[tappedNodeId].textColorPicker : blackColor}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            max={45}
                            min={15}
                            onChange={(event) => {
                                let newFontSize = Number(event.target.value);
                                if (tappedNodeId !== '') {
                                    if (!(tappedNodeId in styles.nodes)) {
                                        styles.nodes[tappedNodeId] = {};
                                    }
                                    
                                    styles.nodes[tappedNodeId].fontSize = newFontSize;

                                    let newElements = customDeepCopy(elements);
                                    let tappedNode = newElements.nodes.find(x => x.data.id === tappedNodeId);

                                    tappedNode.data.fontSize = newFontSize;

                                    setElements(newElements);
                                    setStyles(styles);
                                }
                            }}
                            step={5}
                            value={tappedNodeId in styles.nodes && styles.nodes[tappedNodeId].hasOwnProperty('fontSize') ? styles.nodes[tappedNodeId].fontSize : 18}
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
                        defaultValue={'black'}
                        disableAlpha
                        hideTextfield
                        onChange={(value) => {
                            if (tappedNodeId !== '') {
                                if (!(tappedNodeId in styles.nodes)) {
                                    styles.nodes[tappedNodeId] = {};
                                }
                                
                                let newColor = value.css.backgroundColor;
                                styles.nodes[tappedNodeId].borderColor = (value.hasOwnProperty('error') ? 'black' : newColor);
                                //need to set border color in ColorPicker
                                styles.nodes[tappedNodeId].borderColorPicker = value;

                                let newElements = customDeepCopy(elements);
                                let tappedNode = newElements.nodes.find(x => x.data.id === tappedNodeId);

                                tappedNode.data.borderColor = newColor;

                                setElements(newElements);
                                setStyles(styles);
                            }
                        }}
                        value={(tappedNodeId in styles.nodes) && (styles.nodes[tappedNodeId].hasOwnProperty('borderColorPicker')) ? styles.nodes[tappedNodeId].borderColorPicker : blackColor}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            marks
                            max={10}
                            min={0}
                            onChange={(event, value) => {
                                if (tappedNodeId !== '') {
                                    if (!(tappedNodeId in styles.nodes)) {
                                        styles.nodes[tappedNodeId] = {};
                                    }
                                    styles.nodes[tappedNodeId].borderWidth = value;
                                    
                                    let newElements = customDeepCopy(elements);
                                    newElements.nodes.find(x => x.data.id === tappedNodeId).data.borderWidth = value;

                                    setElements(newElements);
                                    setStyles(styles);
                                }
                            }}
                            step={1}
                            value={tappedNodeId in styles.nodes && styles.nodes[tappedNodeId].hasOwnProperty('borderWidth') ? styles.nodes[tappedNodeId].borderWidth : 1}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NodeEditor;