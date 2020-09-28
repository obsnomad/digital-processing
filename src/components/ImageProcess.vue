<template>
    <div>
        <canvas ref="canvas"/>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data: () => ({
        image: null,
        context: null,
    }),
    mounted() {
        this.context = this.$refs.canvas.getContext('2d')
    },
    computed: {
        ...mapState([
            'file',
            'filters',
        ]),
    },
    watch: {
        file(file) {
            if (file instanceof File) {
                const {context} = this;
                const image = new Image();
                image.src = URL.createObjectURL(file)
                image.onload = () => {
                    const {naturalWidth, naturalHeight} = image
                    context.canvas.width = naturalWidth
                    context.canvas.height = naturalHeight
                    context.drawImage(image, 0, 0, naturalWidth, naturalHeight)
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
div {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $padding-default;
    background: $color-background-dark;
}

canvas {
    max-width: 100%;
    max-height: 100%;
}
</style>
