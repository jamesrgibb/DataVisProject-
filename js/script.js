const dataset_array = []
let teamKeys;
let teams;
let teamData = {};
for (let i = 13; i < 22; i++) {
    path = `data/TeamStats/cfb${i}.csv`
    let dataset = d3.csv(path).then(function (data) {
        teams = d3.groups(data, d => d.Team)
        teamKeys = teams.map((t, i) => {
            // console.log(t[0])
            // console.log(i)
            return {key: t[0], pos: i};
        })
        // console.log(teamKeys)

        teamKeys.forEach(team => {
            teamData[team.key] = data.filter(
                d => d.Team === team.key)
        })
    })
    dataset_array.push(teamData)
    // console.log(Object.keys(dataset_array))
}

t = new Table(dataset_array)

// loadData().then((loadedData) => {
//
//
//     // globalApplicationState.wordData = loadedData;
//     // globalApplicationState.tableData = loadedData;
//
//     // globalApplicationState.beeswarm = new Beeswarm(globalApplicationState);
//     // globalApplicationState.table = new Table(globalApplicationState);
//
//
// });
const globalApplicationState = {
    tableData: null,
    wordData: null,
    separated: false,
    beeswarm: null,
    table: null,
};