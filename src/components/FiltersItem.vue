<template>
    <article>
        <header>
            <h3>{{ filter.name }}</h3>
            <button type="button" @click="removeFilter(filter)"></button>
        </header>

    </article>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
    props: {
        filter: Object,
    },
    methods: mapMutations([
        'removeFilter',
    ]),
}
</script>

<style lang="scss" scoped>
header {
    display: flex;
    justify-content: space-between;
}

h3 {
    font-size: $font-size;
    line-height: $line-height;
}

button {
    position: relative;
    width: $line-height;
    height: $line-height;
    right: -5px;

    &:before, &:after {
        content: '';
        position: absolute;
        border: $border-default;
        width: $line-height-label / 2;
        left: 50%;
        top: 50%;
        margin: {
            left: - $line-height-label / 4 - 1px;
            top: -1px;
        }
    }

    &:before {
        transform: rotate(-45deg);
    }

    &:after {
        transform: rotate(45deg);
    }
}
</style>