<template>
    <div>
        <img v-if="image" :src="image" alt=""/>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data: () => ({
        image: null,
    }),
    computed: mapState([
        'file',
    ]),
    watch: {
        file(file) {
            if (file instanceof File) {
                this.image = URL.createObjectURL(file)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background: $color-background-dark;
    border: $border-default;
}

img {
    max-width: 100%;
    max-height: 100%;
}
</style>