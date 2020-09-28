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
    computed: mapState([
        'file',
        'filters',
    ]),
    watch: {
        file(file) {
            if (file instanceof File) {
                const {context} = this
                this.image = new Image
                this.image.src = URL.createObjectURL(file)
                this.image.onload = () => {
                    context.canvas.width = this.image.naturalWidth
                    context.canvas.height = this.image.naturalHeight
                    this.redrawImage()
                    this.applyFilters()
                }
            }
        },
        filters: {
            handler: function () {
                this.applyFilters()
            },
            deep: true,
        },
    },
    methods: {
        redrawImage() {
            this.context.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight)
        },
        applyFilters() {
            this.redrawImage()
            this.filters.forEach((filter) => {
                filter.apply(this.context)
            })
        },
    },
}
</script>

<style lang="scss" scoped>
div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - #{$width-side-panel});
    padding: $padding-default;
    background: $color-background-dark;
}

canvas {
    max-width: 100%;
    max-height: 100%;
}
</style>
