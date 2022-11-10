
class Table{

    constructor(globalState){

        // determines which season and values are drawn by the table 
        this.state = globalState.tableState;

        this.teams = Array.from(d3.group)
    }


    /** Called to update the columns when switching out table data  */
    setColumns (array) {
        let headers = d3.select("#columnHeaders");
        headers.selectAll('td').data(array).join('td').text(d=>d)
    
      }

}