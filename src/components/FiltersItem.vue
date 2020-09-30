<template>
    <article :class="{
        hidden: filter.hidden,
    }">
        <header>
            <h3>{{ filter.name }}</h3>
            <button class="hideButton" type="button"
                    @click="setFilter({filter, fields: {hidden: !filter.hidden}})"></button>
            <button class="removeButton" type="button" @click="removeFilter(filter)"></button>
        </header>
        <ul v-if="filter.options" class="options">
            <li v-for="(option, key) in filter.options" class="option" :key="key">
                <span v-html="option.name"/>
                <VueRangeSlider v-if="option.type === 'slider'"
                                :value="option.value"
                                @input="changeValue($event, option)"
                                :min="option.limits[0]"
                                :max="option.limits[1]"
                                :step="option.step"
                                tooltip="hover"/>
                <div v-else-if="option.type === 'radio'">
                    <label v-for="(value, valueKey, index) in option.values" :key="valueKey">
                        <input type="radio"
                               :name="`radio_${filterKey}_${key}`"
                               :checked="option.value && option.value === valueKey || !option.value && index === 0"
                               @change="changeValue(valueKey, option)"/>
                        <span>{{ value }}</span>
                    </label>
                </div>
            </li>
        </ul>
    </article>
</template>

<script>
import {mapMutations} from 'vuex'
import VueRangeSlider from 'vue-range-component'
import 'vue-range-component/dist/vue-range-slider.css'
import {debounce} from '@/helpers'

export default {
    components: {
        VueRangeSlider,
    },
    props: {
        filter: Object,
        filterKey: [String, Number],
    },
    methods: {
        ...mapMutations([
            'setFilter',
            'removeFilter',
        ]),
        changeValue(value, option) {
            debounce(() => {
                option.value = value
            })
        },
    },
}
</script>

<style lang="scss" scoped>
article {
    &.hidden {
        opacity: .5;
    }
}

header {
    display: flex;
}

h3 {
    font-size: $font-size;
    line-height: $line-height;
    flex-grow: 1;
}

button {
    position: relative;
    width: $line-height;
    height: $line-height;
    right: -5px;
    margin-left: 4px;

    &.hideButton {
        overflow: hidden;
        background: radial-gradient(circle at center center, transparent 2px, $color-border 3px, transparent 4px);

        $width-eye: $line-height-label * 1;

        &:before, &:after {
            content: '';
            position: absolute;
            width: $width-eye;
            height: $line-height-label;
            border-radius: 100%;
            border: $border-default;
            left: 50%;
            margin-left: -$width-eye / 2 - 1px;
        }

        &:before {
            top: 50%;
            margin-top: -4px;
        }

        &:after {
            bottom: 50%;
            margin-bottom: -4px;
        }
    }

    &.removeButton {
        &:before, &:after {
            content: '';
            position: absolute;
            border: $border-default;
            width: $line-height-label / 2;
            left: 50%;
            top: 50%;
            margin: {
                left: -$line-height-label / 4 - 1px;
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
}

.option {
    margin-top: $padding-default / 2;
}

label {
    display: flex;
    align-items: center;
}

input[type="radio"] {
    margin: 0 5px 0 0;
}
</style>