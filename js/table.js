class Table{
//
//     constructor(globalState){
//
//         // determines which season and values are drawn by the table
//         this.state = globalState.tableState;
//
//         this.tableHeight = 500;
//         this.tableWidth = 600;
//
//
//
//         // scales
//         // TODO ...............
//         //''''''''''''''''''
//
//
//         this.drawTable();
//     }
//
//
//     /** Called to update the columns when switching out table data  */
//     setColumns (array) {
//         let headers = d3.select("#columnHeaders");
//         headers.selectAll('td').data(array).join('td').text(d=>d)
//
//     }
//
//     drawTable() {
//
//         let data = this.state.drawData
//         let columns = this.state.drawData.columns
//
//
//         this.setColumns(columns)
//
//         let rowSelection = d3
//             .select("#rankTableBody")
//             .selectAll("tr")
//             .data(data)
//             .join("tr");
//
//         // let forecastSelection = rowSelection
//         // .selectAll("td")
//         // .data(d => d)
//         // .join("td").text(d=>d.value);
//
//         var cells = rowSelection.selectAll('td')
//             .data(function (row) {
//                 return columns.map(function (column) {
//                     return {column: column, value: row[column]};
//                 });
//             })
//             .join('td')
//             .text(function (d) { return d.value; });
//
//     }
//
}