export function debounce(fn, interval = 500, id = 'options') {
    if(!window.timeoutIds){
        window.timeoutIds = {};
    }
    if(window.timeoutIds[id]) {
        clearTimeout(window.timeoutIds[id]);
    }
    window.timeoutIds[id] = setTimeout(function() {
        fn();
    }, interval);
}

export function getImageData(context) {
    const {width, height} = context.canvas
    return context.getImageData(0, 0, width, height)
}

export function getMaxLuminosity(data) {
    let maxLuminosity = 0;
    for (let i = 0; i < data.data.length; i += 4) {
        maxLuminosity = Math.max(maxLuminosity, data.data[i], data.data[i + 1], data.data[i + 2])
    }
    return maxLuminosity
}
