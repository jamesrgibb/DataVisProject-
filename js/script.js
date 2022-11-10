/* DATA LOADING */
async function loadData () {

    const dataset_array = []
    for (let i = 13; i < 22; i++) {
        path = `data/TeamStats/cfb${i}.csv`
        let dataset = await d3.csv(path);
        dataset_array.push(dataset);
      }

    console.log(dataset_array)
    return dataset_array;
  }
  
  loadData().then((loadedData) => {

    console.log(loadedData)

    globalApplicationState.data = loadedData

    // set default table state
    const defaultState = {

    }
    
    // ... then 
    globalApplicationState.tableState = defaultState;

    // initialize table
    globalApplicationState.table = new Table(globalApplicationState)


    let teamMap = groupByTeam(loadedData);

    

  });


  function groupByTeam(array){

    
    const teamMap = new Map();

    for(let i =0; i < 9; i++){
        let yearData = array[i]
        let teamGrouping = d3.group(yearData, d=>d.Team);

        // In this format, key is the value we want and value is the key
        teamGrouping.forEach(function (value, key) {
            // check if map has key then append teamdata to map 
            if(teamMap.has(key)){
                let teamdata = teamMap.get(key)
                teamdata.push(value)
                teamMap.set(key, teamdata)
            } else {
                teamMap.set(key, [value])
            }
        });
    }

    return teamMap
  }

  const tableState = {
    drawData: null, 
    tableData: null,
    seasonalData: null,
    defaultTableData: null, 
  }

  const globalApplicationState = {
    tableState: null, 
    data: null,
    histogram: null,
    table: null,
    correlation: null
  };