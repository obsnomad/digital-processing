<template>
    <div class="histogrammContainer">
        <canvas :width="width" :height="height" ref="canvas"/>
        <div class="gradient"/>
        <div class="scale">
            <span v-for="n in 9" :key="n" :data-value="(n - 1) * 32"/>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data: () => ({
        context: null,
        width: 256,
        height: 100,
    }),
    mounted() {
        this.context = this.$refs.canvas.getContext('2d')
    },
    computed: mapState([
        'file',
        'histogramm',
    ]),
    watch: {
        histogramm(data) {
            const {context, width, height} = this
            let pixelData = new Uint8ClampedArray(4 * width * height)
            for (let luminosity = 0; luminosity < width; luminosity++) {
                for (let pixel = 0; pixel < height; pixel++) {
                    const pixelPosition = ((height - 1 - pixel) * width + luminosity) * 4
                    for (let color = 0; color < 3; color++) {
                        pixelData[pixelPosition + color] = data[luminosity] && data[luminosity][color] >= pixel ? 255 : 42;
                    }
                    pixelData[pixelPosition + 3] = 255
                }
            }
            context.putImageData(new ImageData(pixelData, width, height), 0, 0)
        },
    },
}
</script>

<style lang="scss" scoped>
.histogrammContainer {
    display: flex;
    flex-direction: column;
}

canvas {
    min-width: 100%;
    height: 150px;
    border: $border-default;
    background: $color-background-dark;
}

.gradient {
    margin-top: 3px;
    width: 100%;
    height: 16px;
    border: $border-default;
    background: linear-gradient(to right, #000, #fff);
}

.scale {
    display: flex;
    justify-content: space-between;
    height: 16px;
    font-size: 9px;
    line-height: 16px;

    span {
        position: relative;

        &:after {
            content: attr(data-value);
            position: absolute;
            transform: translateX(-50%);
        }
    }
}
</style>