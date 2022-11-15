class Table{

    constructor(globalState){

        // determines which season and values are drawn by the table
        this.state = globalState.tableState;
        this.sortState = {
            column: "",
            ascending: false
        }

        this.tableHeight = 500;
        this.tableWidth = 600;





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
        let data = this.state.drawData
        let columns = this.state.drawData.columns

        // set scales for all columns and map to col name
        // each scale will have constant domain, change range as needed
        let divScaleMap = new Map()
        columns.slice(1).forEach(element => {
            let scale = d3.scaleLinear().domain([
                d3.min(data, d=>parseFloat(d[element])),
                d3.mean(data, d=>parseFloat(d[element])),
                d3.max(data, d=>parseFloat(d[element]))
            ]).range(["#FF3131", "white", "#50C878"])
            divScaleMap.set(element, scale)
        });

        // set the table column vals
        this.setColumns(columns)

        let rowSelection = d3
            .select("#rankTableBody")
            .selectAll("tr")
            .data(data)
            .join("tr");


        let cells = rowSelection.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    return {column: column, value: row[column]};
                });
            })
            .join('td')
            .text(function (d) { return d.value; })
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

    changeSeason(year){
        let index = year -13;

        let seasonData = this.state.seasonalData
        this.state.tableData = seasonData[index]
        this.state.drawData = seasonData[index]

        this.drawTable()

    }

}