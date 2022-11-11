/* DATA LOADING */
async function loadData () {

    const dataset_array = []
    for (let i = 13; i < 21; i++) {

        path = `data/TeamStats/cfb${i}.csv`
        let dataset = await d3.csv(path);

        // clean the imported csv data
        cleanDataFrame(dataset, i);

        // Index column in cfb21 needs to be removed
        if(i == 21){
          dataset.columns.splice(0,1);
        }

        // append dataset to collection 
        dataset_array.push(dataset);
      }

    console.log(dataset_array)

    // returns 9 len array, each element is full dataset from one season
    return dataset_array;
  }


  // may not be ultimately neccessary
  // keeping for now incase i find more uses 
  const tableState = {
    // data the table is drawing, could be filtered
    drawData: null, 
    // unfiltered current season dataset
    tableData: null,

    // unsure if these two are neccessary at the moment 
    seasonalData: null,
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


    globalApplicationState.data = loadedData

    // get team data across all 9 seasons into map 
    globalApplicationState.teamMap = groupByTeam(loadedData);

    // set default table state
    const defaultState = {
        drawData: globalApplicationState.data[loadedData.length - 1], 
        tableData: globalApplicationState.data[loadedData.length - 1],


        seasonalData: loadedData,
        //defaultTableData: null, 

    }
    // ... then 
    globalApplicationState.tableState = defaultState;

    // initialize table
    globalApplicationState.table = new Table(globalApplicationState)

    
    // add dropdown for switching data 
    let seasons = ["13", "14", "15", "16", "17", "18", "19", "20"]
    let tablediv = d3.select("#table-div")
    tablediv.insert("label", "table").attr("for", "season").text("Choose Season")
    tablediv.insert("select", "table").attr('name', "season").attr("id", "season").selectAll("option").data(seasons)
    .join("option").attr("value", d=>d).attr("selected", d=> d==="20" ? "selected": "").text(d=> "20" + d);

    // attach handler to select
    d3.select("#season").on("change", changeHandler)
    

  });

  function changeHandler(d){

    globalApplicationState.table.changeSeason(this.value)
  }

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

  function cleanDataFrame(data){

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
