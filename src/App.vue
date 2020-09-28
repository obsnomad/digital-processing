<template>
    <div id="app">
        <SidePanel/>
        <ImageProcess/>
    </div>
</template>

<script>
import SidePanel from './components/SidePanel.vue'
import ImageProcess from './components/ImageProcess.vue'

export default {
    components: {
        SidePanel,
        ImageProcess,
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
