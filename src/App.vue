<template>
    <div id="app">
        <SidePanel/>
        <ImageProcess/>
        <CompressionPanel/>
    </div>
</template>

<script>
import SidePanel from './components/SidePanel.vue'
import ImageProcess from './components/ImageProcess.vue'
import CompressionPanel from './components/CompressionPanel.vue'

export default {
    components: {
        SidePanel,
        ImageProcess,
        CompressionPanel,
    }
}
</script>

<style lang="scss">
#app {
    display: flex;
    width: 100%;
    height: 100%;
}
</style>
