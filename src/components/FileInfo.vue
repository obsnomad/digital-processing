<template>
    <div>
        <p>Исходный размер: {{ size }}</p>
        <p>Размер после сжатия RLE: {{ sizeRLE }}</p>
        <p>Размер после распаковки RLE: {{ sizeAfterRLE }}</p>
    </div>
</template>

<script>
import {mapState} from 'vuex'

import {displaySize, getImageData} from '@/helpers'

export default {
    data: () => ({
        context: null,
        data: null,
        dataRLE: null,
        counterSize: 4,
    }),
    computed: {
        ...mapState([
            'file',
        ]),
        size() {
            return this.data ? displaySize(this.data.length) : 'н/д'
        },
        sizeRLE() {
            return this.dataRLE ? displaySize(this.dataRLE.reduce(
                (accumulator, row) => accumulator + row.length * (4 + this.counterSize), 0
            )) : 'н/д'
        },
        sizeAfterRLE() {
            if (!this.dataRLE) {
                return 'н/д'
            }
            const uncompressedData = [];
            this.dataRLE.forEach((row) => {
                row.forEach(({color, amount}) => {
                    for (let i = 0; i < amount; i++) {
                        uncompressedData.push(...color)
                    }
                })
            })
            return displaySize(uncompressedData.length)
        },
    },
    mounted() {
        const canvas = document.createElement('canvas')
        this.context = canvas.getContext('2d')
    },
    methods: {
        encodeRLE() {
            const {width, height} = this.context.canvas
            const data = Array.from(this.data)
            const dataRLE = new Array(height)
            for (let i = 0; i < height; i++) {
                const rowData = data.splice(0, width * 4)
                dataRLE[i] = [
                    {
                        color: rowData.splice(0, 4),
                        amount: 1,
                    }
                ]
                for (let j = 1; j < width; j++) {
                    const color = rowData.splice(0, 4)
                    const lastItem = dataRLE[i][dataRLE[i].length - 1]
                    if (lastItem.color.join(',') === color.join(',')) {
                        lastItem.amount++
                    } else {
                        dataRLE[i].push({
                            color,
                            amount: 1,
                        })
                    }
                }
            }
            this.dataRLE = dataRLE
        }
    },
    watch: {
        file(file) {
            if (file instanceof File) {
                const {context} = this
                const image = new Image
                image.src = URL.createObjectURL(file)
                image.onload = () => {
                    context.canvas.width = image.naturalWidth
                    context.canvas.height = image.naturalHeight
                    context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)
                    this.data = getImageData(this.context).data
                    this.encodeRLE()
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
p {
    margin: 0;

    & + & {
        margin-top: 8px;
    }
}
</style>