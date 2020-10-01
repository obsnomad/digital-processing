import {getImageData} from '@/helpers'

export default {
    name: 'Повышение резкости',

    options: {
        method: {
            name: 'Метод',
            type: 'radio',
            values: {
                roberts: 'Оператор Робертса',
                sobel: 'Оператор Собела',
                laplacian: 'Лапласиан',
                laplacianOrigin: 'Лапласиан + Оригинал',
            },
            value: 'roberts',
        },
    },

    apply(context) {
        const data = getImageData(context)
        const originalData = [...data.data]
        for (let i = 0; i < data.data.length; i += 4) {
            for (let j = 0; j < 3; j++) {
                const {value} = this.options.method
                if (value === 'roberts') {
                    data.data[i + j] = Math.abs((originalData[i + j + 12] || 0) - originalData[i + j])
                        + Math.abs((originalData[i + j + 8] || 0) - (originalData[i + j + 4] || 0))
                } else if (value === 'sobel') {
                    data.data[i + j] = Math.abs(
                        ((originalData[i + j + 8] || 0) + 2 * (originalData[i + j + 12] || 0) + (originalData[i + j + 16] || 0))
                        - ((originalData[i + j - 16] || 0) + 2 * (originalData[i + j - 12] || 0) + (originalData[i + j - 8] || 0))
                        )
                        + Math.abs(
                            ((originalData[i + j - 8] || 0) + 2 * (originalData[i + j + 4] || 0) + (originalData[i + j + 16] || 0))
                            - ((originalData[i + j - 16] || 0) + 2 * (originalData[i + j - 4] || 0) + (originalData[i + j + 8] || 0))
                        )
                } else {
                    data.data[i + j] = 4 * originalData[i + j]
                        - (originalData[i + j - 12] || 0) - (originalData[i + j - 4] || 0)
                        - (originalData[i + j + 4] || 0) - (originalData[i + j + 12] || 0)
                    if (value === 'laplacianOrigin') {
                        data.data[i + j] += originalData[i + j]
                    }
                }
            }
        }
        context.putImageData(data, 0, 0)
    },
}
