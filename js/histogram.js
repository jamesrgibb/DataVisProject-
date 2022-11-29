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

        let data = this.globalState.tableState.tableData

        let x = d3.scaleLinear().domain(
            [0, d3.max(data, d => +d[this.currentStat])]
            
        ).range(
            [this.margin.left, this.vizWidth - this.margin.left]
        )

        let histogram = d3.histogram()
                            .value(d => +d[this.currentStat])
                            .domain(x.domain())
                            .thresholds(x.ticks(this.resolution))

        let bins = histogram(data)

        let y = d3.scaleLinear()
        .domain(
            [0, d3.max(bins, function(d) { return +d.length; })]
        ).range(
            [this.visHeight - this.margin.bottom, this.margin.top]
        )

        let svg = d3.select("#hist-svg")

        svg.attr("height", this.visHeight)
        svg.attr("width", this.vizWidth)

        svg.append('g').call(d3.axisBottom(x).ticks(this.resolution)).attr("transform", `translate(0, ${this.visHeight - this.margin.bottom})`)
        //svg.append('g').call(d3.axisLeft(y)).attr("transform", `translate(${this.margin.left}, 0)`)

        let height = this.visHeight - this.margin.top - this.margin.bottom
        let bottomAdjust = this.margin.top - this.margin.bottom 
        svg.selectAll("rect").data(bins).join("rect")
            .attr("x", 1)
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .attr("transform", function(d) { return `translate(${x(d.x0)}, ${y(d.length) - bottomAdjust})`; })
            .style("fill", "#69b3a2")
    }
}
