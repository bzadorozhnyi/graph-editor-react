import { ColorPicker, createColor } from "material-ui-color";
import { Slider, ToggleButton, ToggleButtonGroup } from '@mui/material';

function EdgeEditor(props) {
    let {elements, setElements, setStyles, styles, tappedEdgeId} = props;
    let defaultColor = createColor('#808080');

    return (
        <div className='style-editor'>
            <h1>{ tappedEdgeId === '' ? 'Edge not selected' : tappedEdgeId }</h1>
            <hr></hr>
            <div className='row'>
                <h2>Color: </h2>
                <ColorPicker
                    defaultValue={defaultColor}
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

                            // neew to set current colot with opacity in ColorPicker
                            styles.edges[tappedEdgeId].colorAndOPacity = value;

                            let newElements = JSON.parse(JSON.stringify(elements));
                            let tappedEdge = newElements.edges.find(edge => edge.data.id === tappedEdgeId);

                            tappedEdge.data.color = newColor;
                            tappedEdge.data.opacity = newOpacity;

                            setElements(newElements);
                            setStyles(styles);
                        }
                    }}
                    value={(tappedEdgeId in styles.edges) && (styles.edges[tappedEdgeId].hasOwnProperty('colorAndOPacity')) ? styles.edges[tappedEdgeId].colorAndOPacity : defaultColor}
                />
            </div>
            <hr></hr>
            <div className='row'>
                <h2>Width of edge: </h2>
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

                                let newElements = JSON.parse(JSON.stringify(elements));
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
            </div>
            <hr></hr>
            <ToggleButtonGroup
                color="primary"
                defaultValue={'solid'}
                value={(tappedEdgeId in styles.edges) ? styles.edges[tappedEdgeId].lineStyle : 'solid'}
                exclusive
                onChange={(event, value) => {
                    if (tappedEdgeId !== '') {
                        if (!(tappedEdgeId in styles.edges)) {
                            styles.edges[tappedEdgeId] = {};
                        }
                        styles.edges[tappedEdgeId].lineStyle = value;

                        let newElements = JSON.parse(JSON.stringify(elements));
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
            <hr></hr>
            <div className='row'>
                <h2>Font color: </h2>
                <ColorPicker
                    defaultValue={createColor('black')}
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

                            let newElements = JSON.parse(JSON.stringify(elements));
                            let tappedEdge = newElements.edges.find(edge => edge.data.id === tappedEdgeId);

                            tappedEdge.data.labelColor = newColor;

                            setElements(newElements);
                            setStyles(styles);
                        }
                    }}
                    value={(tappedEdgeId in styles.edges) && (styles.edges[tappedEdgeId].hasOwnProperty('textColorPicker')) ? styles.edges[tappedEdgeId].textColorPicker : createColor('black')}
                />
            </div>
            <hr></hr>
            <div className='row'>
                <h2>Font size: </h2>
                <div className='slider-wrapper'>
                    <Slider
                        max={100}
                        min={1}
                        onChange={(event, value) => {
                            // let newFontSize = Number(event.target.value);
                            if (tappedEdgeId !== '') {
                                if (!(tappedEdgeId in styles.edges)) {
                                    styles.edges[tappedEdgeId] = {};
                                }
                                
                                styles.edges[tappedEdgeId].fontSize = value;

                                let newElements = JSON.parse(JSON.stringify(elements));
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
        </div>
    );
}

export default EdgeEditor;