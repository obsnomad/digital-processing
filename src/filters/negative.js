import {getImageData, getMaxLuminosity} from '@/helpers'

export default {
    name: 'Негатив',

    apply(context) {
        const data = getImageData(context)
        const maxLuminosity = getMaxLuminosity(data)
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = maxLuminosity - data.data[i]
            data.data[i + 1] = maxLuminosity - data.data[i + 1]
            data.data[i + 2] = maxLuminosity - data.data[i + 2]
        }
        context.putImageData(data, 0, 0)
    },
}
