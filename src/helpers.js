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

export function getImageMatrix({data, width, height}) {
    let matrix = []
    for (let row = 0; row < height; row++) {
        matrix[row] = []
        for (let column = 0; column < width; column++) {
            const index = (row * width + column) * 4
            matrix[row][column] = [
                data[index],
                data[index + 1],
                data[index + 2],
            ]
        }
    }
    return matrix
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

export function getPixelMatrix(matrix, i, j, defaultValue = 0) {
    const row = Math.floor(i / 4 / matrix[0].length)
    const column = (i / 4) % matrix[0].length
    return [
        matrix[row - 1] && matrix[row - 1][column - 1] ? matrix[row - 1][column - 1][j] : defaultValue,
        matrix[row - 1] && matrix[row - 1][column] ? matrix[row - 1][column][j] : defaultValue,
        matrix[row - 1] && matrix[row - 1][column + 1] ? matrix[row - 1][column + 1][j] : defaultValue,
        matrix[row] && matrix[row][column - 1] ? matrix[row][column - 1][j] : defaultValue,
        matrix[row][column][j],
        matrix[row] && matrix[row][column + 1] ? matrix[row][column + 1][j] : defaultValue,
        matrix[row + 1] && matrix[row + 1][column - 1] ? matrix[row + 1][column - 1][j] : defaultValue,
        matrix[row + 1] && matrix[row + 1][column] ? matrix[row + 1][column][j] : defaultValue,
        matrix[row + 1] && matrix[row + 1][column + 1] ? matrix[row + 1][column + 1][j] : defaultValue,
    ]
}

export function getPixelValue(dataMatrix, i, j, resolveMatrix, defaultValue = 0) {
    return getPixelMatrix(dataMatrix, i, j, defaultValue).reduce((previousValue, currentValue, index) => {
        return previousValue + currentValue * resolveMatrix[index]
    }, 0)
}

export function getSortedMatrix(dataMatrix, i, j, defaultValue = 0) {
    return getPixelMatrix(dataMatrix, i, j, defaultValue).sort((a, b) => {
        return (+a) - (+b);
    })
}
