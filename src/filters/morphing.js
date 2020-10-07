import {getImageData, getImageMatrix, getPixelMatrix} from '@/helpers'

export default {
    name: 'Морфологический фильтр',

    options: {
        method: {
            name: 'Метод',
            type: 'radio',
            values: {
                dilatation: 'Дилатация',
                erosion: 'Эрозия',
                disclosure: 'Размыкание',
                closure: 'Замыкание',
                borders: 'Выделение границ',
                skeleton: 'Остов',
            },
            value: 'dilatation',
        },
    },

    apply(context) {
        let data = getImageData(context)
        switch (this.options.method.value) {
            case 'dilatation':
                this.dilatation(data)
                break
            case 'erosion':
                this.erosion(data)
                break
            case 'disclosure':
                this.erosion(data)
                this.dilatation(data)
                break
            case 'closure':
                this.dilatation(data)
                this.erosion(data)
                break
            case 'borders': {
                const originalData = [...data.data]
                this.erosion(data)
                for (let i = 0; i < data.data.length; i += 4) {
                    for (let j = 0; j < 3; j++) {
                        data.data[i + j] = originalData[i + j] - data.data[i + j]
                    }
                }
                break
            }
            case 'skeleton': {
                let next = true
                let originalData = []
                while (next) {
                    let result = this.erosion(data, true)
                    if (result) {
                        originalData = result
                    }
                    else {
                        next = false
                    }
                }
                data = new ImageData(new Uint8ClampedArray(originalData), data.width, data.height)
                break
            }
        }
        context.putImageData(data, 0, 0)
    },

    dilatation(data) {
        const originalData = [...data.data]
        const matrix = getImageMatrix(data)
        for (let i = 0; i < data.data.length; i += 4) {
            let {positions} = getPixelMatrix(matrix, i)
            if (originalData[positions[4]] !== 0) {
                positions.forEach((i) => {
                    for (let j = 0; j < 3; j++) {
                        data.data[i + j] = originalData[i] || 255
                    }
                })
            }
        }
    },

    erosion(data) {
        const originalData = [...data.data]
        const matrix = getImageMatrix(data)
        let processed = false
        for (let i = 0; i < data.data.length; i += 4) {
            let {positions} = getPixelMatrix(matrix, i)
            const value = positions.every((i) => {
                return originalData[i] !== 0
            }) ? 255 : 0
            if (data.data[i] !== value) {
                processed = true
            }
            for (let j = 0; j < 3; j++) {
                data.data[i + j] = value
            }
        }
        return processed ? originalData : null
    },
}
