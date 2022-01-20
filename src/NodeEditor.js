import './App.css';
import { ColorPicker, createColor } from 'material-ui-color';
import IntegerInput from './IntegerInput.js';
import { Slider } from '@mui/material';

function NodeEditor(props) {
    let { elements, tappedNodeId, setElements, setStyles, styles } = props;
    let defaultColor = createColor('#808080');

    return (
        <div className="node-editor">
            <h1>{ tappedNodeId === '' ? 'Node not selected' : tappedNodeId }</h1>
            <hr></hr>
            <div className='row'>
                <h2>Size of node: </h2>
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
                                
                                let newElements = JSON.parse(JSON.stringify(elements));
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
            <hr></hr>
            <div className='row'>
                <h2>Background color: </h2>
                <ColorPicker
                    defaultValue={defaultColor}
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

                            let newElements = JSON.parse(JSON.stringify(elements));
                            let tappedNode = newElements.nodes.find(x => x.data.id === tappedNodeId);

                            tappedNode.data.backgroundColor = newColor;
                            tappedNode.data.opacity = newOpacity;

                            setElements(newElements);
                            setStyles(styles);
                        }
                    }}
                    value={(tappedNodeId in styles.nodes) && (styles.nodes[tappedNodeId].hasOwnProperty('backgroundColorAndOpacity')) ? styles.nodes[tappedNodeId].backgroundColorAndOpacity : defaultColor}
                />
            </div>
            <hr></hr>
            <div className='row'>
                <h2>Font color: </h2>
                <ColorPicker
                    defaultValue={defaultColor}
                    disableAlpha
                    hideTextfield
                    onChange={(value) => {
                        console.log('color ', tappedNodeId);
                        if (tappedNodeId !== '') {
                            if (!(tappedNodeId in styles.nodes)) {
                                styles.nodes[tappedNodeId] = {};
                            }
                            
                            let newColor = value.css.backgroundColor;
                            styles.nodes[tappedNodeId].color = (value.hasOwnProperty('error') ? 'black' : newColor);
                            //need to set text color in ColorPicker
                            styles.nodes[tappedNodeId].textColorPicker = value;

                            let newElements = JSON.parse(JSON.stringify(elements));
                            let tappedNode = newElements.nodes.find(x => x.data.id === tappedNodeId);

                            tappedNode.data.color = newColor;

                            setElements(newElements);
                            setStyles(styles);
                        }
                    }}
                    value={(tappedNodeId in styles.nodes) && (styles.nodes[tappedNodeId].hasOwnProperty('textColorPicker')) ? styles.nodes[tappedNodeId].textColorPicker : createColor('black')}
                />
            </div>
            <hr></hr>
            <IntegerInput
                handleChange={(event) => {
                    let newFontSize = Number(event.target.value);
                    console.log('font', elements);
                    if (tappedNodeId !== '') {
                        if (!(tappedNodeId in styles.nodes)) {
                            styles.nodes[tappedNodeId] = {};
                        }
                        
                        styles.nodes[tappedNodeId].fontSize = newFontSize;

                        let newElements = JSON.parse(JSON.stringify(elements));
                        let tappedNode = newElements.nodes.find(x => x.data.id === tappedNodeId);

                        tappedNode.data.fontSize = newFontSize;

                        setElements(newElements);
                        setStyles(styles);
                    }
                }}
                minValue={0}
                maxValue={64}
                placeholder='Font size'
                value={(tappedNodeId !== '' ? (tappedNodeId in styles.nodes ? styles.nodes[tappedNodeId].fontSize : 18) : '')}
            />
        </div>
    );
}

export default NodeEditor;