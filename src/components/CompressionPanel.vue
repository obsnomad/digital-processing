<template>
    <div class="panel">
        <section>
            <h2>Информация о файле</h2>
            <p class="hint">C пересчётом на 32-битный цвет</p>
            <FileInfo/>
        </section>
    </div>
</template>

<script>
import FileInfo from './FileInfo.vue'

export default {
    components: {
        FileInfo,
    },
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
.panel {
    display: flex;
    flex-direction: column;
    width: $width-side-panel;
    height: 100%;
    padding: $padding-default;
    border-left: $border-default;

    section {
        display: flex;
        flex-direction: column;

        & + section {
            margin-top: $padding-default + 10px;
        }

        &.lastSection {
            flex-grow: 1;
        }
    }

    h2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $padding-default / 2;
        font-size: $font-size-label;
        line-height: $line-height-label;
        font-weight: bold;
    }

    .hint {
        font-size: 12px;
        opacity: 0.6;
        margin: -#{$padding-default / 2} 0 #{$padding-default / 2};
    }
}
</style>
