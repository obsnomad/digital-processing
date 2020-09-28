export default {
    setFile: (state, file) => state.file = file,
    addFilter: (state, filter) => state.filters.push({...filter}),
    removeFilter: (state, filter) => state.filters.splice(state.filters.indexOf(filter), 1),
}
