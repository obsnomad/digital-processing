import {getImageData, getMaxLuminosity} from '@/helpers'

export default {
    name: 'Гамма-коррекция',

    options: {
        multiplier: {
            name: 'Коэффициент <i>c</i>',
            type: 'slider',
            limits: [0, 10],
            step: 0.1,
            value: 1,
        },
        gamma: {
            name: 'Коэффициент <i>γ</i>',
            type: 'slider',
            limits: [0.1, 5],
            step: 0.1,
            value: 1,
        },
    },

    apply(context) {
        const data = getImageData(context)
        const maxLuminosity = getMaxLuminosity(data)
        const c = this.options.multiplier.value
        const gamma = this.options.gamma.value
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = c * Math.pow(data.data[i], gamma) / Math.pow(maxLuminosity, gamma - 1)
            data.data[i + 1] = c * Math.pow(data.data[i + 1], gamma) / Math.pow(maxLuminosity, gamma - 1)
            data.data[i + 2] = c * Math.pow(data.data[i + 2], gamma) / Math.pow(maxLuminosity, gamma - 1)
        }
        context.putImageData(data, 0, 0)
    },
}
