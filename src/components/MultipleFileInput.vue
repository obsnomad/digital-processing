<template>
    <input type="file" multiple @change="change" accept="image/*"/>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
    methods: {
        ...mapMutations([
            'setFiles'
        ]),
        change({target}) {
            this.setFiles(target.files);
        },
    },
}
</script>
