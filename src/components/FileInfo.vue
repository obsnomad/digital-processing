<template>
    <div>
        <p>Исходный размер: {{ size }}</p>
        <p>Размер после сжатия RLE: {{ sizeRLE }}</p>
        <p>Размер после распаковки RLE: {{ sizeAfterRLE }}</p>
        <p>Размер после сжатия методом Хаффмана: {{ sizeHuffman }}</p>
        <p>Размер после распаковки методом Хаффмана: {{ sizeAfterHuffman }}</p>
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
        dataHuffman: null,
        treeHuffman: null,
        treeHuffmanSize: null,
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
        sizeHuffman() {
            return this.dataHuffman ? displaySize((this.dataHuffman.reduce(
                (accumulator, row) => accumulator + row.length, 0
            ) + this.treeHuffmanSize) / 8) : 'н/д'
        },
        sizeAfterHuffman() {
            if (!this.dataHuffman) {
                return 'н/д'
            }
            const uncompressedData = [];
            this.dataHuffman.forEach((value) => {
                uncompressedData.push(...this.findNodeValue(value))
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
        },
        encodeHuffman() {
            const data = Array.from(this.data)
            let frequencies = {}
            let {treeHuffman} = this
            treeHuffman = []
            for (let i = 0; i < data.length; i += 4) {
                let index = '';
                for (let j = 0; j < 4; j++) {
                    index += data[i + j].toString(16).padStart(2, '0')
                }
                if (!frequencies[index]) {
                    frequencies[index] = 0
                }
                frequencies[index]++
            }
            treeHuffman = this.getSortedEntries(frequencies)
            let nodesAmount = 1;
            while (treeHuffman.length > 2) {
                const first = treeHuffman.shift()
                const second = treeHuffman.shift()
                treeHuffman.unshift([[first, second], first[1] + second[1]]);
                treeHuffman.sort(([, a], [, b]) => a - b)
                nodesAmount++
            }
            let codes = {}
            this.treeHuffman = this.getCompressedTree(treeHuffman)
            this.treeHuffmanSize = 9 * 2 * 4 * nodesAmount
            this.getTreeCodes(this.treeHuffman, codes)
            this.dataHuffman = []
            for (let i = 0; i < data.length; i += 4) {
                let index = '';
                for (let j = 0; j < 4; j++) {
                    index += data[i + j].toString(16).padStart(2, '0')
                }
                this.dataHuffman.push(codes[index])
            }
        },
        getSortedEntries(obj) {
            return Object.entries(obj).sort(([, a], [, b]) => a - b)
        },
        getCompressedTree([[first], [second]]) {
            return [
                typeof first === 'object' ? this.getCompressedTree(first) : first,
                typeof second === 'object' ? this.getCompressedTree(second) : second,
            ]
        },
        getTreeCodes(data, codes, code = '') {
            for (let i in data) {
                const currentCode = code + i
                const value = data[i]
                if (typeof value === 'string') {
                    codes[value] = currentCode
                }
                else {
                    this.getTreeCodes(value, codes, currentCode)
                }
            }
        },
        findNodeValue(path) {
            let tree = {...this.treeHuffman}
            for (let dir of path) {
                if (!dir || typeof tree === 'string') {
                    break
                }
                tree = tree[dir]
            }
            return tree.match(/../g).map((value) => parseInt(value, 16))
        },
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
                    this.encodeHuffman()
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