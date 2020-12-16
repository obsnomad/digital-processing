<template>
    <div>
        <p>Исходный размер: {{ size }}</p>
        <p>Размер после сжатия: {{ sizeHuffman }}</p>
        <p>Размер после распаковки: {{ sizeAfterHuffman }}</p>
    </div>
</template>

<script>
import {mapState} from 'vuex'

import {displaySize, getImageData} from '@/helpers'

const dim = 512,
    cutDim = dim - 2,
    groupDim = cutDim / 2,
    treshold = 0.1

export default {
    data: () => ({
        context: null,
        data: [],
        dataRLE: null,
        dataHuffman: null,
        treeHuffman: null,
        treeHuffmanSize: null,
        uncompressedSize: null
    }),
    computed: {
        ...mapState([
            'files',
        ]),
        size() {
            return this.data.length ? displaySize(this.data.reduce(
                (accumulator, row) => accumulator + row.length, 0
            )) : 'н/д'
        },
        sizeHuffman() {
            return this.dataHuffman ? displaySize((this.dataHuffman.reduce(
                (accumulator, row) => accumulator + row.code.length + (row.pos ? 17 : 1), 0
            ) + this.treeHuffmanSize) / 8) : 'н/д'
        },
        sizeAfterHuffman() {
            return this.uncompressedSize ? displaySize(this.uncompressedSize) : 'н/д'
        },
    },
    mounted() {
        const canvas = document.createElement('canvas')
        this.context = canvas.getContext('2d')
    },
    methods: {
        encode() {
            this.encodeRLE()
            this.encodeHuffman()
            this.decodeHuffman()
        },
        encodeRLE() {
            let base;
            this.dataRLE = this.data.map((data) => {
                if (!base) {
                    base = [...data]
                    return this.encodeBase(data)
                }
                let diff = data.map((value, pos) => ({
                    pos,
                    value: base[pos] - value
                })).filter((value) => value.value !== 0)
                if (diff.length / base.length >= treshold) {
                    base = [...data]
                    return this.encodeBase(data)
                }
                return diff
            })
        },
        encodeBase(data) {
            let splitData = [[], [], [], []]
            for (let row = 1; row <= cutDim; row++) {
                for (let column = 1; column <= cutDim; column++) {
                    const index = row * dim + column
                    const groupIndex = Math.round(row / dim) * 2 + Math.round(column / dim)
                    splitData[groupIndex].push(data[index])
                }
            }
            splitData = splitData.map((group) => {
                let encodedData = []
                for (let row = 0; row < groupDim; row++) {
                    encodedData[row] = []
                    let zeroes = 0
                    for (let column = 0; column < groupDim; column++) {
                        const index = row * groupDim + column
                        const value = group[index]
                        if (value === 0) {
                            zeroes++
                        } else {
                            if (zeroes > 0) {
                                encodedData[row].push(0, zeroes)
                                zeroes = 0
                            }
                            encodedData[row].push(value)
                        }
                    }
                    if (zeroes > 0) {
                        encodedData[row].push(0, zeroes)
                    }
                }
                return encodedData
            })
            let result = []
            for (let row = 0; row < groupDim; row++) {
                result.push(...splitData[0][row], ...splitData[1][row])
            }
            for (let row = 0; row < groupDim; row++) {
                result.push(...splitData[2][row], ...splitData[3][row])
            }
            return result
        },
        encodeHuffman() {
            let frequencies = {}
            let {treeHuffman} = this
            treeHuffman = []
            this.dataRLE.forEach((item) => {
                item.forEach((val) => {
                    const value = typeof val === 'number' ? val : val.value
                    if (!frequencies[value]) {
                        frequencies[value] = 0
                    }
                    frequencies[value]++
                })
            })
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
            this.treeHuffmanSize = 9 * 2 * nodesAmount
            this.getTreeCodes(this.treeHuffman, codes)
            this.dataHuffman = []
            this.dataRLE.forEach((item, index) => {
                item.forEach((val) => {
                    const data = { index }
                    if (typeof val === 'number') {
                        data.code = codes[val]
                    }
                    else {
                        data.code = codes[val.value]
                        data.pos = val.pos
                    }
                    this.dataHuffman.push(data)
                })
            })
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
                } else {
                    this.getTreeCodes(value, codes, currentCode)
                }
            }
        },
        decodeHuffman() {
            let uncompressedData = [];
            this.dataHuffman.forEach(({index, pos, code}) => {
                if (!uncompressedData[index]) {
                    uncompressedData[index] = []
                }
                const value = this.findNodeValue(code)
                uncompressedData[index].push(pos ? {pos, value} : value)
            })
            let base
            uncompressedData = uncompressedData.map((data) => {
                if (typeof data[0] === 'number') {
                    base = this.decodeBase(data)
                    return base
                }
                let result = [...base]
                data.forEach(({value, pos}) => {
                    result[pos] -= value
                })
                return result
            })
            this.uncompressedSize = uncompressedData.reduce(
                (accumulator, row) => accumulator + row.length, 0
            )
        },
        findNodeValue(path) {
            let tree = {...this.treeHuffman}
            for (let dir of path) {
                if (!dir || typeof tree === 'string') {
                    break
                }
                tree = tree[dir]
            }
            return parseInt(tree)
        },
        decodeBase(data) {
            let rawData = []
            for (let i = 0; i < data.length; i++) {
                if (data[i] === 0) {
                    rawData.push(...(new Array(data[++i]).fill(0)))
                }
                else {
                    rawData.push(data[i])
                }
            }
            let result = []
            for (let row = 0; row < dim; row++) {
                for (let column = 0; column < dim; column++) {
                    const index = row * dim + column
                    if (row === 0 || column === 0 || row === dim - 1 || column === dim - 1) {
                        result[index] = 0
                    }
                    else {
                        const rawIndex = (row - 1) * cutDim + column - 1
                        result[index] = rawData[rawIndex]
                    }
                }
            }
            return result
        },
    },
    watch: {
        files(files) {
            const {context} = this
            this.data = []
            let promises = [];
            files.forEach((file) => {
                promises.push(new Promise((resolve) => {
                    const image = new Image
                    image.src = URL.createObjectURL(file)
                    image.onload = () => resolve({file, image})
                }))
            })
            Promise.all(promises).then((images) => {
                images.forEach(({file, image}) => {
                    if (image.naturalWidth !== dim || image.naturalHeight !== dim) {
                        throw new Error(`Разрешение изображения ${file.name} не ${dim}x${dim}`)
                    }
                    context.canvas.width = image.naturalWidth
                    context.canvas.height = image.naturalHeight
                    context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)
                    const {data} = getImageData(this.context)
                    let resultData = []
                    for (let i = 0; i < data.length; i += 4) {
                        resultData.push(data[i])
                    }
                    this.data.push(resultData)
                })
                this.encode()
            }).catch((error) => {
                alert(error)
                this.data = []
            })
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