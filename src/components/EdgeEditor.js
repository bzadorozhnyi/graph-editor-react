import CopyStyleButton from './CopyStyleButton';
import { ColorPicker, createColor } from "material-ui-color";
import { Slider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import customDeepCopy from '../customDeepCopy';

function EdgeEditor(props) {
    let {elements, setElements, setStyles, styles, tappedEdgeId} = props;
    let grayColor = createColor('#808080');
    let blackColor = createColor('black');

    return (
        <div className='style-editor panel'>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{flexGrow: '1'}}>
                    <h1>{ tappedEdgeId === '' ? 'Edge not selected' : tappedEdgeId }</h1>
                </div>
                <CopyStyleButton
                    elements={elements}
                    isActiveCopy={elements.isEdgeStyleCopyActive}
                    setElements={setElements}
                    type='edge'
                />
            </div>

            <div className='panel'>
                <h1>Edge</h1>
                <hr></hr>
                <div className='menu-control'>
                    <ColorPicker
                        defaultValue={grayColor}
                        hideTextfield
                        onChange={(value) => {
                            if(tappedEdgeId !== '') {
                                if(!(tappedEdgeId in styles.edges)) {
                                    styles.edges[tappedEdgeId] = {};
                                }

                                let newColor = value.css.backgroundColor.substring(0, 7);
                                let newOpacity = value.alpha;

                                // base on user`s input set background and opacity
                                // P.S. if newColor.length === 5 cause warnings, maybe should be fixed in future
                                styles.edges[tappedEdgeId].color = (value.hasOwnProperty('error') ? 'transparent' : newColor);
                                styles.edges[tappedEdgeId].opacity = (value.hasOwnProperty('error') ? 0 : newOpacity);

                                // need to set current color with opacity in ColorPicker
                                styles.edges[tappedEdgeId].colorAndOPacity = value;

                                let newElements = customDeepCopy(elements);
                                let tappedEdge = newElements.edges.find(edge => edge.data.id === tappedEdgeId);

                                tappedEdge.data.color = newColor;
                                tappedEdge.data.opacity = newOpacity;

                                setElements(newElements);
                                setStyles(styles);
                            }
                        }}
                        value={(tappedEdgeId in styles.edges) && (styles.edges[tappedEdgeId].hasOwnProperty('colorAndOPacity')) ? styles.edges[tappedEdgeId].colorAndOPacity : grayColor}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            marks
                            max={10}
                            min={1}
                            onChange={(event, value) => {
                                if (tappedEdgeId !== '') {
                                    if (!(tappedEdgeId in styles.edges)) {
                                        styles.edges[tappedEdgeId] = {};
                                    }
                                    styles.edges[tappedEdgeId].width = value;

                                    let newElements = customDeepCopy(elements);
                                    let tappedEdge = newElements.edges.find(edge => edge.data.id === tappedEdgeId);
                                    
                                    tappedEdge.data.width = value;

                                    setElements(newElements);
                                    setStyles(styles);
                                }
                            }}
                            step={1}
                            value={(tappedEdgeId in styles.edges) ? styles.edges[tappedEdgeId].width : 1}
                            valueLabelDisplay="auto"
                        />
                    </div>
                    <ToggleButtonGroup
                        color="primary"
                        defaultValue={'solid'}
                        value={tappedEdgeId in styles.edges && styles.edges[tappedEdgeId].hasOwnProperty('lineStyle') ? styles.edges[tappedEdgeId].lineStyle : 'solid'}
                        exclusive
                        onChange={(event, value) => {
                            if (tappedEdgeId !== '') {
                                if (!(tappedEdgeId in styles.edges)) {
                                    styles.edges[tappedEdgeId] = {};
                                }
                                styles.edges[tappedEdgeId].lineStyle = value;

                                let newElements = customDeepCopy(elements);
                                let tappedEdge = newElements.edges.find(edge => edge.data.id === tappedEdgeId);

                                tappedEdge.data.lineStyle = value;
                                
                                setElements(newElements);
                                setStyles(styles);
                            }
                        }}
                    >
                        <ToggleButton value="solid">Solid</ToggleButton>
                        <ToggleButton value="dotted">Dotted</ToggleButton>
                        <ToggleButton value="dashed">Dashed</ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            

            <div className='panel'>
                <h1>Label</h1>
                <hr></hr>
                <div className='menu-control'>
                    <ColorPicker
                        defaultValue={blackColor}
                        disableAlpha
                        hideTextfield
                        onChange={(value) => {
                            if (tappedEdgeId !== '') {
                                if (!(tappedEdgeId in styles.edges)) {
                                    styles.edges[tappedEdgeId] = {};
                                }
                                
                                let newColor = value.css.backgroundColor;
                                styles.edges[tappedEdgeId].labelColor = (value.hasOwnProperty('error') ? 'black' : newColor);
                                //need to set text color in ColorPicker
                                styles.edges[tappedEdgeId].textColorPicker = value;

                                let newElements = customDeepCopy(elements);
                                let tappedEdge = newElements.edges.find(edge => edge.data.id === tappedEdgeId);

                                tappedEdge.data.labelColor = newColor;

                                setElements(newElements);
                                setStyles(styles);
                            }
                        }}
                        value={(tappedEdgeId in styles.edges) && (styles.edges[tappedEdgeId].hasOwnProperty('textColorPicker')) ? styles.edges[tappedEdgeId].textColorPicker : blackColor}
                    />
                    <div className='slider-wrapper'>
                        <Slider
                            max={30}
                            min={10}
                            onChange={(event, value) => {
                                if (tappedEdgeId !== '') {
                                    if (!(tappedEdgeId in styles.edges)) {
                                        styles.edges[tappedEdgeId] = {};
                                    }
                                    
                                    styles.edges[tappedEdgeId].fontSize = value;

                                    let newElements = customDeepCopy(elements);
                                    let tappedEdge = newElements.edges.find(x => x.data.id === tappedEdgeId);

                                    tappedEdge.data.fontSize = value;

                                    setElements(newElements);
                                    setStyles(styles);
                                }
                            }}
                            step={5}
                            value={tappedEdgeId in styles.edges && styles.edges[tappedEdgeId].hasOwnProperty('fontSize') ? styles.edges[tappedEdgeId].fontSize : 18}
                            valueLabelDisplay="auto"
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
                                onChange={(event, value) => {
                                    if (tappedEdgeId !== '') {
                                        if (!(tappedEdgeId in styles.edges)) {
                                            styles.edges[tappedEdgeId] = {};
                                        }
                                        
                                        styles.edges[tappedEdgeId].marginX = value;

                                        let newElements = customDeepCopy(elements);
                                        let tappedEdge = newElements.edges.find(x => x.data.id === tappedEdgeId);

                                        tappedEdge.data.marginX = value;

                                        setElements(newElements);
                                        setStyles(styles);
                                    }
                                }}
                                step={1}
                                value={tappedEdgeId in styles.edges && styles.edges[tappedEdgeId].hasOwnProperty('marginX') ? styles.edges[tappedEdgeId].marginX : 0}
                                valueLabelDisplay="auto"
                            />
                        </div>
                    </div>     
                    <div className='row'>
                        <h2>Y</h2>
                        <div className='slider-wrapper'>
                            <Slider
                                max={20}
                                min={-20}
                                onChange={(event, value) => {
                                    if (tappedEdgeId !== '') {
                                        if (!(tappedEdgeId in styles.edges)) {
                                            styles.edges[tappedEdgeId] = {};
                                        }
                                        
                                        styles.edges[tappedEdgeId].marginY = value;

                                        let newElements = customDeepCopy(elements);
                                        let tappedEdge = newElements.edges.find(x => x.data.id === tappedEdgeId);

                                        tappedEdge.data.marginY = value;

                                        setElements(newElements);
                                        setStyles(styles);
                                    }
                                }}
                                step={1}
                                value={tappedEdgeId in styles.edges && styles.edges[tappedEdgeId].hasOwnProperty('marginY') ? styles.edges[tappedEdgeId].marginY : 0}
                                valueLabelDisplay="auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EdgeEditor;