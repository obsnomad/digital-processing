export default {
    name: 'Негатив',

    apply(context) {
        const {width, height} = context.canvas
        const data = context.getImageData(0, 0, width, height)
        let maxLuminosity = 0;
        // Получение максимального значения яркости во всех цветовых составляющих RGB
        for (let i = 0; i < data.data.length; i += 4) {
            maxLuminosity = Math.max(maxLuminosity, data.data[i], data.data[i + 1], data.data[i + 2])
        }
        // Преобразование в негатив
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = maxLuminosity - data.data[i]
            data.data[i + 1] = maxLuminosity - data.data[i + 1]
            data.data[i + 2] = maxLuminosity - data.data[i + 2]
        }
        context.putImageData(data, 0, 0)
    },
}
