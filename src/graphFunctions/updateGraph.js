export function updateGraph(userInput, oldEdges, direction) {
    // console.log(oldEdges);
    let edges = {
        undirected: [],
        directed: []
    };

    if(direction === 'undirected')
        edges.directed = oldEdges.directed;
    else
        edges.undirected = oldEdges.undirected;

    userInput.split('\n').forEach(function(row) {
        let items = row.split(' ').filter(item => item.length > 0);
        switch(items.length) {
        case 0:
            break;
        case 1:
            edges[direction].push({ data: { id: items[0], label: items[0] } });
            break;
        case 2:
            edges[direction].push({ data: { id: items[0], label: items[0] } });
            edges[direction].push({ data: { id: items[1], label: items[1] } });
            if(direction === 'undirected')
            edges[direction].push({ data: { source: items[0], target: items[1] } });
            else
            edges[direction].push({ data: { source: items[0], target: items[1], arrow: "triangle" } });
            break;
        case 3:
            edges[direction].push({ data: { id: items[0], label: items[0] } });
            edges[direction].push({ data: { id: items[1], label: items[1] } });
            if(direction === 'undirected')
            edges[direction].push({ data: { source: items[0], target: items[1], label: items[2] } });
            else
            edges[direction].push({ data: { source: items[0], target: items[1], label: items[2], arrow: 'triangle' } });
            break;
        }
    });
    return edges;
}