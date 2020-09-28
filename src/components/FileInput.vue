<template>
    <input type="file" @change="change" accept="image/*"/>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
    methods: {
        ...mapMutations([
            'setFile'
        ]),
        change({target}) {
            this.setFile(target.files[0]);
        },
    },
}
</script>
