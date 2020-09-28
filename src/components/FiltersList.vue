<template>
    <div class="list">
        <FiltersItem class="listItem" v-for="(filter, key) in filters" :key="key" :filter="filter"/>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import FiltersItem from './FiltersItem.vue'

export default {
    components: {
        FiltersItem,
    },
    computed: {
        ...mapState([
            'filters',
        ]),
    },
}
</script>

<style lang="scss" scoped>
.list {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: $color-background-dark;
    border: $border-default;
    padding: 5px;
}

.listItem {
    padding: 5px 10px;
    border: $border-default;
    background: lighten($color-background-dark, 5);

    & + & {
       margin-top: 5px;
    }
}
</style>