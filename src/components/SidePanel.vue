<template>
    <div class="panel">
        <section>
            <h2>Загрузить изображение</h2>
            <FileInput/>
        </section>
        <section>
            <h2>Изображение</h2>
            <ImagePreview/>
        </section>
        <section v-if="file" class="lastSection">
            <h2>
                Фильтры
                <FiltersAdd/>
            </h2>
            <FiltersList/>
        </section>
    </div>
</template>

<script>
import {mapState} from 'vuex'

import FileInput from './FileInput.vue'
import ImagePreview from './ImagePreview.vue'
import FiltersList from './FiltersList.vue'
import FiltersAdd from './FiltersAdd.vue'

export default {
    components: {
        FileInput,
        ImagePreview,
        FiltersList,
        FiltersAdd,
    },
    computed: mapState([
        'file',
    ]),
}
</script>

<style lang="scss" scoped>
.panel {
    display: flex;
    flex-direction: column;
    width: $width-side-panel;
    height: 100%;
    padding: $padding-default;
    border-right: $border-default;

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
        margin-bottom: $padding-default;
        font-size: $font-size-label;
        line-height: $line-height-label;
        font-weight: bold;
    }
}
</style>
