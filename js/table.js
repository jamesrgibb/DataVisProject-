class Table{


    // const defaultState = {
    //     drawData: globalApplicationState.data[loadedData.length - 1],
    //     tableData: globalApplicationState.data[loadedData.length - 1],
    //     currentGrouping: "offense",
    //     seasonalData: loadedData,

    // }
    constructor(globalState){

        // determines which season and values are drawn by the table
        this.state = globalState.tableState;
        this.sortState = {
            column: "",
            ascending: false
        }

        this.tableHeight = 500;
        this.tableWidth = 600;



        let offCol = this.state.tableData.columns.filter((item)=> item.startsWith("Off") || item.match(/Pass.Yards/))
        let defCol = this.state.tableData.columns.filter((item)=> item.startsWith("Def") || item.match(/Allowed/))
        this.columnGroups = {
            offense: ["Team", "Win", "Loss", ...offCol],
            defense: ["Team","Win", "Loss", ...defCol]
        }



        // scales
        // TODO ...............
        //''''''''''''''''''



        this.drawTable();
    }


    /** Called to update the columns when switching out table data  */
    setColumns (array) {
        let headers = d3.select("#columnHeaders");
        headers.selectAll('td').data(array).join('td').text(d=>d)

    }

    drawTable() {

        // get the data and columns to draw
        // let data = this.state.drawData
        // let columns = this.state.drawData.columns

        /** TRY ROLLUP FOR SELECTED COLUMNS ONLY */
        let columns
        if(this.state.currentGrouping === "offense"){
            columns = this.columnGroups.offense
        } else if(this.state.currentGrouping === "defense"){
            columns = this.columnGroups.defense
        }

        let data = d3.rollup(this.state.drawData, function(v){
                let reducedMap = new Map()
                columns.forEach(function(col){
                    reducedMap.set(col, v[0][col])
                })

                return Object.fromEntries(reducedMap)
            },
                d => d.Team
            )
        data = [...data.values()]
        data = data.filter(d=>!globalApplicationState.missingTeamData.includes(d.Team))
        console.log(data.length)
        /** ******************************** */


            // set scales for all columns and map to col name
            // each scale will have constant domain, change range as needed
        let divScaleMap = new Map()
        columns.forEach(element => {
            let scale = d3.scaleLinear().domain([
                d3.min(data, d=>parseFloat(d[element])),
                d3.mean(data, d=>parseFloat(d[element])),
                d3.max(data, d=>parseFloat(d[element]))
            ]).range(["#ff1c1c", "white", "#58c850"])
            divScaleMap.set(element, scale)
        });

        // set the table column vals
        this.setColumns(columns)

        let rowSelection = d3
            .select("#rankTableBody")
            .selectAll("tr")
            .data(data) // changed for new rollup method
            .join("tr");


        let cells = rowSelection.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                        return {column: column, value: row[column], team: row.Team};
                });
            })
            .join('td')
            .text(function (d) { return d.value; })
            .attr('id', function (d) {
                if(d.column === "Team"){
                    return d.team
                }
                else{
                    return d.team + " " + d.column
                }
            })
            .on('click', function(d){
                let col = d['path'][0].__data__.column
                let team = d['path'][0].__data__.team
                console.log(d['path'])

                d3.select('#line').remove();
                d3.select('#y-axis').remove();
                globalApplicationState.correlation = new Correlation(globalApplicationState)
                d3.select('#line').remove();
                d3.select('#y-axis').remove();
                let newCol = col.toLowerCase()
                col = newCol.replace(".","_")
                globalApplicationState.correlation.chartSetup(team,col)
            })
            .style('background-color', function(d){
                if(d.column === "Team"){
                    return "white"
                } else {
                    let scale = divScaleMap.get(d.column)
                    let color = scale(parseFloat(d.value))
                    return color
                }
            });


    }

    sortTable(colName){
        // clicking on already sorted column
        if(this.sortState.column === colName){

            if(this.sortState.ascending === true){

                this.sortState.ascending = false;
                this.state.drawData.sort((a,b)=>
                    d3.descending(+a[colName], +b[colName])
                );
            }
            else {
                this.sortState.ascending = true
                this.state.drawData.sort((a,b)=>
                    d3.ascending(+a[colName], +b[colName])
                );
            }
        }
        else {
            this.sortState.column = colName
            this.sortState.ascending = false;
            this.state.drawData.sort((a,b)=>
                d3.descending(+a[colName], +b[colName])
            );
        }

        this.drawTable();
    }

    changeGrouping(groupName){
        this.state.currentGrouping = groupName
        this.drawTable()
    }

    changeSeason(year){
        let index = year -13;

        let seasonData = this.state.seasonalData
        this.state.tableData = seasonData[index]
        this.state.drawData = seasonData[index]

        this.drawTable()

    }



}