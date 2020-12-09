<template>
    <div>
        <p>Исходный размер: {{ size }}</p>
    </div>
</template>

<script>
import {mapState} from 'vuex'

import {displaySize, getImageData} from '@/helpers'

const dim = 512,
    cutDim = dim - 1,
    groupDim = Math.floor(cutDim / 2)

export default {
    data: () => ({
        context: null,
        data: [],
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
    },
    mounted() {
        const canvas = document.createElement('canvas')
        this.context = canvas.getContext('2d')
    },
    methods: {
        encode() {
            let base;
            const data = this.data.map((data) => {
                if (!base) {
                    base = [...data]
                    return this.encodeBase(data)
                }
                let diff = data.filter((value, index) => value !== base[index])
                if (diff.length / base.length >= 0.1) {
                    base = [...data]
                    return this.encodeBase(data)
                }
                return diff
            })
            console.log(data)
        },
        encodeBase(data) {
            let splitData = [[], [], [], []]
            for (let row = 1; row < cutDim; row++) {
                for (let column = 1; column < cutDim; column++) {
                    const index = row * dim + column
                    const groupIndex = Math.round(row / dim) * 2 + Math.round(column / dim)
                    splitData[groupIndex].push(data[index])
                }
            }
            let encodedData = []
            splitData.forEach((group) => {
                for (let row = 0; row < groupDim; row++) {
                    let zeroes = 0
                    for (let column = 0; column < groupDim; column++) {
                        const index = row * groupDim + column
                        const value = group[index]
                        if (value === 0) {
                            zeroes++
                        }
                        else {
                            if (zeroes > 0) {
                                encodedData.push(0, zeroes)
                                zeroes = 0
                            }
                            encodedData.push(value)
                        }
                    }
                    if (zeroes > 0) {
                        encodedData.push(0, zeroes)
                    }
                }
            })
            return encodedData
        }
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