class Correlation {
    constructor(state) {

        //Create a new Correlation with the given data
        this.state = state;
        this.svg = d3.select('#chart-svg');
        this.height = 400;
        this.width = 300;
        this.yAxisPadding = 50;
        this.xAxisPadding = 50;
        this.margin = {left: 50, bottom: 20, top: 10, right: 20};
        this.years = this.state.years
        this.animationDuration = 250;
        this.columns = this.state.table.state.drawData.columns
        this.data = this.state.chartData
        this.Team = this.state.table.state.drawData
        this.allSelected = [];
        this.yScale = null;
        this.xScale = null;
        this.yAxis = null;
        // set up svg element
        let currentTeam = 'Akron';
        let currentStat = 'win';
        const teams = Object.keys(this.data)
        const stats = Object.keys(this.data.Akron)
        //set up width and height
        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)

        //set up xAxis
        this.xAxis = d3.scaleTime()
            .domain(d3.extent(this.years))
            .range([this.xAxisPadding, this.width])

        this.svg.append('g')
            .attr('transform', 'translate(0,' + 375 + ')')
            .attr('id', 'xAxis')
            .call(d3.axisBottom(this.xAxis))
            .attr('height', 30)

        this.svg
            .select('#xAxis')
            .append('text')
            .attr('x', 150)
            .attr('y', 30)
            .text('Years')
            .style('text-anchor', "middle")
            .style('font-size', '14px')
            .attr('fill', 'black')

        //set up the y axis
        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(this.data[currentTeam][currentStat])])
            .range([this.height - 25, this.yAxisPadding])

        //set place holder value for the y axis
        this.svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + this.yAxisPadding + ',0)')
            .attr('width', 100)
            .call(d3.axisLeft(this.yAxis))
        //set placeholder value for the y-axis label
        this.svg.select('#y-axis')
            .append('text')
            .attr('x', -200)
            .attr('y', -40)
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('transform', 'rotate(-90)');
        // set event listener for the display graph variable
        d3.select('#display-graph')
            .on('click', function (d) {
                d3.select('#line').remove();
                d3.select('#y-axis').remove();
                return globalApplicationState.correlation.chartSetup(d3.select('#selectTeam').property('value'),d3.select('#Y-Statistic').property('value'))
            })

    }

    chartSetup(currentTeam,corrStat) {
        if(!globalApplicationState.selectedTeams.includes(currentTeam) && globalApplicationState.selectedStat === corrStat){
            globalApplicationState.selectedTeams.push(currentTeam)
        }
        else{
            globalApplicationState.selectedStat =  corrStat
            globalApplicationState.selectedTeams = []
            globalApplicationState.selectedTeams.push(currentTeam)
        }
        const teams = Object.keys(this.data)
        const stats = Object.keys(this.data.Akron)
        const xax = this.xAxis
        let maxValue = []
        globalApplicationState.selectedTeams.forEach(function(d){
            let locMax = d3.max(globalApplicationState.correlation.data[d][corrStat])
            maxValue.push(locMax)
        })
        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(maxValue)])
            .range([this.height - 25, this.yAxisPadding])

        //set tick interval
        this.svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + this.yAxisPadding + ',0)')
            .attr('width', 100)
            .call(d3.axisLeft(this.yAxis))

        //set y-axis label
        let yLabel = this.svg.select('#y-axis')
            .append('text')
            .text(function () {
                let yTitle = corrStat.replaceAll('_', ' ')
                yTitle = yTitle.toUpperCase()
                return yTitle
            })
            .attr('y', -40)
            .attr('x', -200)
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', "middle");

        let teamColor = d3.scaleOrdinal(d3.schemeTableau10).domain(teams);

        //set up the yAxis
        const yax = this.yAxis

        // create the line for the data
        const line = this.svg.append('g')
            .append('path')
            .attr('id', 'line')
            .datum(this.data[`${currentTeam}`][`${corrStat}`])
            .attr('fill', 'none')
            .attr('stroke', teamColor(currentTeam))
            .attr('stroke-width', 1)
            .attr('d', (list) => {
                    return d3.line()
                        .x(function (d, i, c) {
                            return xax(globalApplicationState.years[i]);
                        })
                        .y(function (d, i, c) {
                            return yax(d)
                        })

                (list)
                })
            .text(function (d, i, c) {
                return d
            })

        this.svg.selectAll("line")
            .data(this.data[`${currentTeam}`][`${corrStat}`])
            .enter()
            .append("text")


    }
}