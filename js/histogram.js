class Histogram{
    constructor(globalState) {
        this.globalState = globalState
        this.resolution = 5

        this.margin = {
            top: 10,
            bottom: 20,
            left: 15,
            right: 10
        }

        this.vizWidth = 200
        this.visHeight = 200
        d3.select("#hist-div").attr("height", this.visHeight + 30).attr("width", this.vizWidth + 30)

        this.currentTeam = "Alabama"
        this.currentStat = "Win"

        this.setupHist(this.currentTeam, this.currentStat)

    }

    setResolution(res){
        this.resolution = res
        this.setupHist(this.currentTeam, this.currentStat)
    }

    setupHist(team, column){

        this.currentTeam = team
        this.currentStat = column
        let res = this.resolution

        let data = this.globalState.tableState.tableData

        let statMax = d3.max(data, d => +d[this.currentStat])
        let statMin = d3.min(data, d => +d[this.currentStat])
        let binWidth = (statMax - statMin) / this.resolution

        // initialize array of empty arrays for bins 
        let bins = new Array(res)

        // find bin of selected team for highlight
        let highlightIdx
        data.forEach(function(d){
            // get the bin number of the object
            let binNumber = Math.floor((+d[column] - statMin) / binWidth)

            // round down if we find the max values
            if(binNumber === res){binNumber--}

            // create a bin if one doesnt exist
            if(typeof bins[binNumber] === "undefined"){ bins[binNumber] = []}

            // add element to bin 
            bins[binNumber].push(d)

            if(d.Team === team){highlightIdx = binNumber}
        })

        //sort each bin and set thresholds 
        let thresholds = []
        bins.forEach(function(bin){
            bin.sort((a,b)=>
                d3.ascending(+a[column], +b[column])
            )
            //min of each bin
            thresholds.push(bin[0][column])
        })

        let x = d3.scaleLinear().domain(
            [statMin, statMax]

        ).range(
            [this.margin.left, this.vizWidth - this.margin.right]
        )

        let y = d3.scaleLinear()
            .domain(
                [0, d3.max(bins, d=> d.length)]
            ).range(
                [this.margin.top, this.visHeight - this.margin.bottom]
            )

        let svg = d3.select("#hist-svg")

        svg.attr("height", this.visHeight)
        svg.attr("width", this.vizWidth)


        // if axis exists, needs removal
        svg.select("#hist-x-axis").remove()
        //svg.select("#hist-y-axis").remove()


        svg.append('g').call(d3.axisBottom(x).tickValues(thresholds))
            .attr("id", "hist-x-axis")
            .attr("transform", `translate(0, ${this.visHeight - this.margin.bottom})`)
        // svg.append('g').call(d3.axisLeft(y))
        // .attr("id", "hist-y-axis")
        // .attr("transform", `translate(${this.margin.left}, 0)`)

        let height = this.visHeight - this.margin.bottom
        let bottomAdjust = this.margin.top - this.margin.bottom
        svg.selectAll("rect").data(bins).join("rect")
            //.attr("x", 0)
            .attr("width", x(statMin + binWidth) - x(statMin))
            .attr("height", d => y(d.length))
            .attr("transform", (d,i) => `translate(${x(statMin + i * binWidth) }, ${height - y(d.length)})`)
            .style("fill", (d,i)=> i === highlightIdx ? "lightblue" : "#69b3a2")

    }
}