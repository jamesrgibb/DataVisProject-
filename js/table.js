class Table {
    constructor(globalState) {

        // determines which season and values are drawn by the table
        this.state = globalState.tableState;
        this.sortState = {
            column: "",
            ascending: false
        }
        this.state.tableData.selectedStat = ''

        this.tableHeight = 500;
        this.tableWidth = 600;


        let offCol = this.state.tableData.columns.filter((item) => item.startsWith("Off") || item.match(/Pass.Yards/))
        let defCol = this.state.tableData.columns.filter((item) => item.startsWith("Def") || item.match(/Allowed/))
        defCol.splice(7, 1)
        defCol.splice(7, 1)
        defCol.splice(13, 1)
        defCol.splice(13, 1)
        defCol.splice(20, 1)
        defCol.splice(13, 1)
        defCol.splice(13, 1)
        defCol.splice(13, 1)
        defCol.splice(19, 1)
        this.descendingOff = ['Loss', 'Off.Rank', 'Def.Rank', 'Pass.Yards.Per.Game.Allowed', 'Def.Rank', 'Def.Plays', 'Yards.Allowed', 'Yards.Play.Allowed',
            'Off.TDs.Allowed', 'Total.TDs.Allowed', 'Yards.Per.Game.Allowed', 'Opp.Completions.Allowed', 'Opp.Pass.Yds.Allowed', 'Opp.Pass.TDs.Allowed', 'Yards.Attempt.Allowed',
            'Yards.Completion.Allowed', 'Pass.Yards.Per.Game.Allowed', 'Yds.Rush.Allowed', 'Opp.Rush.Touchdowns.Allowed', 'Rush.Yards.Per.Game.Allowed', 'Touchdowns.Allowed',
            'Points.Allowed', 'Avg.Points.per.Game.Allowed']
        this.columnGroups = {
            offense: ["Team", "Win", "Loss", ...offCol],
            defense: ["Team", "Win", "Loss", ...defCol]
        }


        // scales
        // TODO ...............
        //''''''''''''''''''


        this.drawTable();
    }


    /** Called to update the columns when switching out table data  */
    setColumns(array) {
        let headers = d3.select("#columnHeaders");
        headers.selectAll('td')
            .data(array)
            .join('td').text(d => {
            return d.replaceAll('.', ' ')
        })
        headers.selectAll('td').style('font-size', '11px')
        headers.selectAll('td').style('text-align', 'center')
        headers.attr('width', 50)
    }

    drawTable() {

        // get the data and columns to draw
        // let data = this.state.drawData
        // let columns = this.state.drawData.columns

        /** TRY ROLLUP FOR SELECTED COLUMNS ONLY */
        let columns
        if (this.state.currentGrouping === "offense") {
            columns = this.columnGroups.offense
        } else if (this.state.currentGrouping === "defense") {
            columns = this.columnGroups.defense
        }

        let data = d3.rollup(this.state.drawData, function (v) {
                let reducedMap = new Map()
                columns.forEach(function (col) {
                    reducedMap.set(col, v[0][col])
                })

                return Object.fromEntries(reducedMap)
            },
            d => d.Team
        )
        data = [...data.values()]
        data = data.filter(d => !globalApplicationState.missingTeamData.includes(d.Team))

        /** ******************************** */

        let divScaleMap = new Map();
        // set scales for all columns and map to col name
        // each scale will have constant domain, change range as needed\

        columns.forEach(element => {
            if (!this.descendingOff.includes(element)) {
                let scale = d3.scaleLinear().domain([
                    d3.min(data, d => parseFloat(d[element])),
                    d3.mean(data, d => parseFloat(d[element])),
                    d3.max(data, d => parseFloat(d[element]))
                ]).range(["#ff1c1c", "white", "#58c850"])
                divScaleMap.set(element, scale)
            } else {
                let scale = d3.scaleLinear().domain([
                    d3.min(data, d => parseFloat(d[element])),
                    d3.mean(data, d => parseFloat(d[element])),
                    d3.max(data, d => parseFloat(d[element]))
                ]).range(["#58c850", "white", "#ff1c1c"])
                divScaleMap.set(element, scale)
            }
        })

        // set the table column vals
        this.setColumns(columns)

        let rowSelection = d3
            .select("#rankTableBody")
            .selectAll("tr")
            .data(data) // changed for new rollup method
            .join("tr")


        let cells = rowSelection.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    return {column: column, value: row[column], team: row.Team};
                });
            })
            .join('td')
            .text(function (d) {
                return d.value;
            })
            .attr('id', function (d) {
                if (d.column === "Team") {
                    return d.team
                } else {
                    return d.team + " " + d.column
                }
            })
            //TODO: move the defensive and offense selection out of the chart scrolling
            //TODO: make the lines update dynamically when a new selection is made
            .on('click', function (d) {
                let col = d['path'][0].__data__.column
                let team = d['path'][0].__data__.team

                // hist needs the names unchanged 
                globalApplicationState.histogram.setupHist(team, col)

                console.log(d['path'])

                d3.select('#line').remove();
                d3.select('#y-axis').remove();
                d3.select('#y-axis').text('');
                globalApplicationState.correlation = new Correlation(globalApplicationState)
                d3.select('#line').remove();
                d3.select('#y-axis').text('');
                d3.select('#y-axis').remove();
                let newCol = col.toLowerCase()
                col = newCol.replaceAll(".", "_")
                globalApplicationState.correlation.chartSetup(team, col)

            })
            .style('background-color', function (d) {
                if (d.column === "Team") {
                    return "white"
                } else {
                    let scale = divScaleMap.get(d.column)
                    let color = scale(parseFloat(d.value))
                    return color
                }
            });

    }

    sortTable(colName) {
        // clicking on already sorted column
        if (this.sortState.column === colName) {

            if (this.sortState.ascending === true) {

                this.sortState.ascending = false;
                this.state.drawData.sort((a, b) =>
                    d3.descending(+a[colName], +b[colName])
                );
            } else {
                this.sortState.ascending = true
                this.state.drawData.sort((a, b) =>
                    d3.ascending(+a[colName], +b[colName])
                );
            }
        } else {
            this.sortState.column = colName
            this.sortState.ascending = false;
            this.state.drawData.sort((a, b) =>
                d3.descending(+a[colName], +b[colName])
            );
        }

        this.drawTable();
    }

    changeGrouping(groupName) {
        this.state.currentGrouping = groupName
        this.drawTable()
    }

    changeSeason(year) {
        let index = year - 13;

        let seasonData = this.state.seasonalData
        this.state.tableData = seasonData[index]
        this.state.drawData = seasonData[index]

        this.drawTable()

    }


}