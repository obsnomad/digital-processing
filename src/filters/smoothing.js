import {getImageData, getImageMatrix, getPixelValue, getSortedMatrix} from '@/helpers'

export default {
    name: 'Сглаживание',

    options: {
        method: {
            name: 'Метод',
            type: 'radio',
            values: {
                linearEven: 'Линейное однородное усреднение',
                linearOdd: 'Линейное неоднородное усреднение',
                median: 'Медиана',
                maximum: 'Максимум',
                minimum: 'Минимум',
                midPoint: 'Срединная точка',
            },
            value: 'linearEven',
        },
    },

    apply(context) {
        const data = getImageData(context)
        const matrix = getImageMatrix(data)
        for (let i = 0; i < data.data.length; i += 4) {
            for (let j = 0; j < 3; j++) {
                switch (this.options.method.value) {
                    case 'linearEven':
                        data.data[i + j] = Math.round(
                            getPixelValue(matrix, i, j, [1, 1, 1, 1, 1, 1, 1, 1, 1]) / 9
                        )
                        break
                    case 'linearOdd':
                        data.data[i + j] = Math.round(
                            getPixelValue(matrix, i, j, [1, 2, 1, 2, 4, 2, 1, 2, 1]) / 16
                        )
                        break
                    case 'median':
                        data.data[i + j] = getSortedMatrix(matrix, i, j)[4]
                        break
                    case 'maximum':
                        data.data[i + j] = getSortedMatrix(matrix, i, j)[8]
                        break
                    case 'minimum':
                        data.data[i + j] = getSortedMatrix(matrix, i, j)[0]
                        break
                    case 'midPoint': {
                        let sorted = getSortedMatrix(matrix, i, j)
                        data.data[i + j] = Math.round((sorted[0] + sorted[8]) / 2)
                        break
                    }
                }
            }
        }
        context.putImageData(data, 0, 0)
    },
}
