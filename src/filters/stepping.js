import {getImageData} from '@/helpers'

export default {
    name: 'Пороговый фильтр',

    options: {
        range: {
            name: 'Диапазон яркости',
            type: 'slider',
            limits: [0, 255],
            step: 1,
            value: [127, 255],
        },
        useLuminosity: {
            name: 'Яркость вне диапазона',
            type: 'checkbox',
            value: false,
        },
    },

    apply(context) {
        const data = getImageData(context)
        const [min, max] = this.options.range.value
        const useLuminosity = this.options.useLuminosity.value
        for (let i = 0; i < data.data.length; i += 4) {
            for (let j = 0; j < 3; j++) {
                if (data.data[i + j] >= min && data.data[i + j] <= max) {
                    data.data[i + j] = 255
                }
                else {
                    data.data[i + j] = useLuminosity ? data.data[i + j] : 0
                }
            }
        }
        context.putImageData(data, 0, 0)
    },
}
