async function loadData () {

    const dataset_array = []
    for (let i = 13; i < 22; i++) {
        path = `data/TeamStats/ cfb${i}.csv`
        let dataset = await d3.csv(path);
        dataset_array.push(dataset);
    }

    console.log(dataset_array)
    return dataset_array;
}

loadData().then((loadedData) => {

    console.log(loadedData)

    // globalApplicationState.wordData = loadedData;
    // globalApplicationState.tableData = loadedData;

    // globalApplicationState.beeswarm = new Beeswarm(globalApplicationState);
    // globalApplicationState.table = new Table(globalApplicationState);


});
const globalApplicationState = {
    tableData: null,
    wordData: null,
    separated: false,
    beeswarm: null,
    table: null,
};