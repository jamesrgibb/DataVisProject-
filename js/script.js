/* DATA LOADING */
async function loadData () {

    const dataset_array = []
    for (let i = 13; i < 22; i++) {
        path = `data/TeamStats/cfb${i}.csv`
        let dataset = await d3.csv(path);
        dataset_array.push(dataset);
      }

    console.log(dataset_array)
    // returns 9 len array, each element is full dataset from one season
    return dataset_array;
  }


  const tableState = {
    // data the table is drawing, could be filtered
    drawData: null, 
    // unfiltered current season dataset
    tableData: null,

    // unsure if these two are neccessary at the moment 
    // seasonalData: null,
    //defaultTableData: null, 
  }

  const globalApplicationState = {
    // current state of the table 
    tableState: null, 
    // full set of 9 seasons of data 
    data: null, 
    // map from team to all 9 seasons of teamdata 
    teamMap: null,

    // View objects held in global state
    histogram: null,
    table: null,
    correlation: null
  };
  
  loadData().then((loadedData) => {

    console.log(loadedData)

    // clean loaded data
    loadedData.forEach(function(dataFrame){
        formatTeamColumn(dataFrame)
    })

    globalApplicationState.data = loadedData

    // get team data across all 9 seasons into map 
    globalApplicationState.teamMap = groupByTeam(loadedData);

    // set default table state
    const defaultState = {
        drawData: globalApplicationState.data[loadedData.length - 1], 
        tableData: globalApplicationState.data[loadedData.length - 1],


        // seasonalData: null,
        //defaultTableData: null, 

    }
    // ... then 
    globalApplicationState.tableState = defaultState;

    // initialize table
    globalApplicationState.table = new Table(globalApplicationState)

    

    

  });


  function groupByTeam(array){

    
    const teamMap = new Map();

    for(let i =0; i < array.length - 1; i++){
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

  function formatTeamColumn(data){

    const regex = /\((.*?)\)/
    data.forEach(function(d){

        // get the team conference and append it to the object
        let conference = d.Team.match(regex) // returns arr 
        
        d.conference = conference[1]

        // remove conf string from team column 
        d.Team = d.Team.replace(conference[0], "") // replace not inplace
        
        
        delete d[""]

    })
  }
