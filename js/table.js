class Table{

    constructor(data){
        this.data = data;
        this.columns = [];
        this.rows = [];
        this.columnWidths = [];
        this.rowHeights = [];
        this.columnMaxWidths = [];
        this.rowMaxHeights = [];
       this.headerData = [
           {
               sorted: false,
               ascending: false,
               key: 'rank'
           },
           {
               sorted: false,
               ascending: false,
               key: 'Win',
               alterFunc: d => Math.abs(+d)
           },
           {
               sorted: false,
               ascending: false,
               key: 'Loss',
               alterFunc: d => +d
           },

       ]
    }
}