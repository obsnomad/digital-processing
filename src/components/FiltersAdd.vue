<template>
    <div class="add">
        <button type="button" @click="toggle" :class="{
            activated: show,
        }"/>
        <transition name="fade">
            <div v-show="show" class="addPanel">
                <ul>
                    <li v-for="(filter, key) in filters" :key="key" @click="add(filter)">
                        {{ filter.name }}
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
import filters from '@/filters'

export default {
    data: () => ({
        show: false,
        filters,
    }),
    mounted() {
        document.body.addEventListener('click', this.clickOutside)
    },
    methods: {
        ...mapMutations([
            'addFilter',
        ]),
        toggle() {
            this.show = !this.show
        },
        clickOutside({target}) {
            if (!target.closest('.add')) {
                this.show = false;
            }
        },
        add(filter) {
            this.addFilter(filter)
            this.show = false;
        },
    },
    destroyed() {
        document.body.removeEventListener('click', this.clickOutside)
    },
}
</script>

<style lang="scss" scoped>
.add {
    position: relative;
    width: $line-height-label;
    height: $line-height-label;
    font-weight: normal;
    font-size: $font-size;
    line-height: $line-height;
}

.addPanel {
    position: absolute;
    z-index: 10;
    width: $width-side-panel - ($padding-default + $border-width) * 2 + 8px;
    top: $line-height-label + 8px;
    right: -4px;
    border: $border-default;
    background: $color-background;
    box-shadow: 0 0 8px rgba(0, 0, 0, .4);
}

button {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: $border-default;
    background: $color-background;
    transition: .2s all ease-in-out;

    &:hover, &.activated {
        background: lighten($color-background, 5);
    }

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

    &:after {
        transform: rotate(90deg);
    }
}

li {
    padding: 5px 10px;
    cursor: pointer;
    transition: .2s all ease-in-out;

    & + & {
        border-top: $border-default;
    }

    &:hover {
        background: lighten($color-background, 5);
    }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>