import { createColor } from 'material-ui-color';

const GRAY = createColor('#808080');
const BLACK = createColor('black');

const DEFAULT_NODE_STYLE = {
    nodeColor: "#808080",
    nodeColorPicker: GRAY,
    nodeOpacity: 1,
    nodeSize: 48,
    borderColor: "black",
    borderColorPicker: BLACK,
    borderWidth: 1,
    labelColor: "black",
    labelColorPicker: BLACK,
    labelSize: 18
};

const EMPTY_NODE = {
    data: {
        id: '',
        label: 'Node not selected',
        ...DEFAULT_NODE_STYLE
    }
}

const DEFAULT_EDGE_STYLE = {
    color: "black"
}

export { BLACK, GRAY, DEFAULT_NODE_STYLE, EMPTY_NODE, DEFAULT_EDGE_STYLE };