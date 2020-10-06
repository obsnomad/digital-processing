export function debounce(fn, interval = 500, id = 'options') {
    if (!window.timeoutIds) {
        window.timeoutIds = {};
    }
    if (window.timeoutIds[id]) {
        clearTimeout(window.timeoutIds[id]);
    }
    window.timeoutIds[id] = setTimeout(function () {
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

export function getHistogrammData(context, percent = false) {
    const {data} = getImageData(context)
    const getValue = (value) => percent ? Math.round(value / maxValue * 100) : value

    const histogrammData = new Array(256)
    let maxValue = 0

    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            if (!histogrammData[data[i + j]]) {
                histogrammData[data[i + j]] = [0, 0, 0]
            }
            histogrammData[data[i + j]][j]++
            maxValue = Math.max(maxValue, histogrammData[data[i + j]][j])
        }
    }

    return histogrammData.map((pixel) => {
        return [getValue(pixel[0]), getValue(pixel[1]), getValue(pixel[2])]
    })
}
