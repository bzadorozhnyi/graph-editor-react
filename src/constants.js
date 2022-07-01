import { createColor } from 'material-ui-color';

const GRAY = createColor('#808080');
const BLACK = createColor('black');

const DEFAULT_NODE_STYLE = {
    nodeColor: '#808080',
    nodeColorPicker: GRAY,
    nodeOpacity: 1,
    nodeSize: 48,
    borderColor: 'black',
    borderColorPicker: BLACK,
    borderWidth: 1,
    labelColor: 'black',
    labelColorPicker: BLACK,
    labelSize: 18
};

const DEFAULT_NODE = {
    data: {
        id: '',
        label: 'Node not selected',
        ...DEFAULT_NODE_STYLE
    }
}

const DEFAULT_EDGE_STYLE = {
    edgeColor: '#808080',
    edgeColorPicker: GRAY,
    edgeLineStyle: 'solid',
    edgeOpacity: 1,
    edgeWidth: 1,
    labelColor: 'black',
    labelColorPicker: BLACK,
    labelSize: 18,
    labelMarginX: 0,
    labelMarginY: 0
}

const DEFAULT_EDGE = {
    data: {
        arrow: 'none',
        id: 'Edge not selected',
        source: '',
        target: '',
        label: '',
        ...DEFAULT_EDGE_STYLE
    }
}

const EMPTY_FRAME = {
    elements: {
        numberOfNodes: {},
        nodes: [],
        edges: [],
        isActiveCopy: {
            edge: false,
            node: false
        },
        tappedNodeId: '',
        tappedEdgeId: ''
    },
    edgeInputs: []
}

export { BLACK, GRAY, DEFAULT_NODE_STYLE, DEFAULT_NODE, DEFAULT_EDGE_STYLE, DEFAULT_EDGE, EMPTY_FRAME };