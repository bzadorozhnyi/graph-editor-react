export function updateInputData(undirectedValue, directedValue, styles) {
    let annotations = [];
    let elements = {
        nodes: [],
        edges: {
            directed: [],
            undirected: []
        }
    };
    let setNodes = new Set();

    function addNode(name) {
        if (!(setNodes.has(name))) {
            setNodes.add(name);
            if(name in styles.nodes) {
                elements.nodes.push({ data: { id: name, label: name, ...styles.nodes[name] } });
            }
            else {
                elements.nodes.push({ data: { id: name, label: name } });
            }
        }
    }

    let index = 0;
    undirectedValue.split('\n').forEach(function (row) {
        let userNodes = row.split(' ').filter(item => item.length > 0);
        switch (userNodes.length) {
            case 0:
                break;
            case 1:
                addNode(userNodes[0]);
                break;
            case 2:
                addNode(userNodes[0]);
                addNode(userNodes[1]);
                elements.edges.undirected.push({ data: { source: userNodes[0], target: userNodes[1] } });
                break;
            case 3:
                addNode(userNodes[0]);
                addNode(userNodes[1]);
                elements.edges.undirected.push({ data: { source: userNodes[0], target: userNodes[1], label: userNodes[2] } });
                break;
            default:
                annotations.push({
                    row: index,
                    type: 'error',
                    text: 'No more than 3 elements allowed.'
                })
                break;
        }

        index++;
    });

    index = 0;
    directedValue.split('\n').forEach(function (row) {
        let userNodes = row.split(' ').filter(item => item.length > 0);
        switch (userNodes.length) {
            case 0:
                break;
            case 1:
                addNode(userNodes[0]);
                break;
            case 2:
                addNode(userNodes[0]);
                addNode(userNodes[1]);
                elements.edges.directed.push({ data: { source: userNodes[0], target: userNodes[1], arrow: "triangle" } });
                break;
            case 3:
                addNode(userNodes[0]);
                addNode(userNodes[1]);
                elements.edges.directed.push({ data: { source: userNodes[0], target: userNodes[1], label: userNodes[2], arrow: "triangle" } });
                break;
            default:
                annotations.push({
                    row: index,
                    type: 'error',
                    text: 'No more than 3 elements allowed.'
                })
                break;
        }

        index++;
    });

    return {
        newAnnotations: annotations,
        newElements: elements
    };
}