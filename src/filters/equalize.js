import {getImageData, getHistogrammData} from '@/helpers'

export default {
    name: 'Эквализация гистограммы',

    apply(context) {
        const data = getImageData(context)
        const pixelAmount = data.data.length / 4
        const histogramm = getHistogrammData(context)
        let equalizedHistogramm = new Array(256)
        let accumulator = [0, 0, 0]
        for (let i = 0; i < 256; i++) {
            for (let j = 0; j < 3; j++) {
                accumulator[j] += (histogramm[i] ? histogramm[i][j] : 0) / pixelAmount
            }
            equalizedHistogramm[i] = [...accumulator]
        }
        for (let i = 0; i < data.data.length; i += 4) {
            for (let j = 0; j < 3; j++) {
                data.data[i + j] = Math.round(255 * equalizedHistogramm[data.data[i + j]][j])
            }
        }
        context.putImageData(data, 0, 0)
    },
}
