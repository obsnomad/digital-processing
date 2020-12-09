export default {
    setFile: (state, file) => state.file = file,
    setFiles: (state, files) => state.files = Array.from(files),
    addFilter: (state, filter) => state.filters.push({...filter}),
    setFilter: (state, {filter, fields}) => {
        const index = state.filters.indexOf(filter)
        state.filters.splice(index, 1, {...state.filters[index], ...fields})
    },
    removeFilter: (state, filter) => state.filters.splice(state.filters.indexOf(filter), 1),
    setHistogramm: (state, data) => state.histogramm = data,
}
