class Correlation {
    constructor(globalState) {
        //Create a new Correlation with the given data
        this.state = globalState;
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
        this.xAxis = null;
        this.yAxis = null;
        // set up svg element
        let currentTeam = 'Akron';
        let currentStat = 'wins';
        const teams = Object.keys(this.data)
        const stats = Object.keys(this.data.Akron)
        //set up width and height
        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)

        d3.select('#selectTeam')
            .selectAll('myOptions')
            .data(teams)
            .enter()
            .append('option')
            .text(function (d) {
                return d;
            })
            .attr('value', function (d) {
                return d;
            })
        d3.select('#Y-Statistic')
            .selectAll('myOptions')
            .data(stats)
            .enter()
            .append('option')
            .text(function (d) {
                return d.replaceAll('_', ' ');
            })
            .attr('value', function (d) {
                return d;
            })
        //set up xAxis
        this.xAxis = d3.scaleTime()
            .domain(d3.extent(this.years))
            .range([this.xAxisPadding, this.width])

        this.svg.append('g')
            .attr('transform', 'translate(0,' + 375 + ')')
            .attr('id', 'xAxis')
            .call(d3.axisBottom(this.xAxis))
            .attr('height', 30)
        //set up the y axis
        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(this.data[currentTeam][currentStat])])
            .range([this.height - 25, this.yAxisPadding])

        this.svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + this.yAxisPadding + ',0)')
            .attr('width', 100)
            .call(d3.axisLeft(this.yAxis))
        this.svg.select('#y-axis')
            .append('text')
            .text('Statistic')
            .attr('x', -200)
            .attr('y', -40)
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('transform', 'rotate(-90)');
        d3.select('#display-graph')
            .on('click', function (d) {
                d3.select('#line').remove();
                d3.select('#y-axis').remove();
                return globalApplicationState.correlation.chartSetup(d3.select('#selectTeam').property('value'),d3.select('#Y-Statistic').property('value'))
            })

    }

    chartSetup(currentTeam,currentStat) {
        //get stats and team values
        this.svg
            .select('#xAxis')
            .append('text')
            .attr('x', 150)
            .attr('y', 30)
            .text('Years')
            .style('font-size', '14px')
            .attr('fill', 'black')
        const teams = Object.keys(this.data)
        const stats = Object.keys(this.data.Akron)
        // load values into the dropdown menus
        const xax = this.xAxis
        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(this.data[currentTeam][currentStat])])
            .range([this.height - 25, this.yAxisPadding])
        //set tick interval
        this.svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + this.yAxisPadding + ',0)')
            .attr('width', 100)
            .call(d3.axisLeft(this.yAxis))
        this.svg.select('#y-axis')
            .append('text')
            .text('Statistic')
            .attr('x', -200)
            .attr('y', -40)
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('transform', 'rotate(-90)');
        let teamColor = d3.scaleOrdinal(d3.schemeTableau10).domain(teams);
        //set up the yAxis
        const yax = this.yAxis
        // create the line for the data
        const line = this.svg.append('g')
            .append('path')
            .attr('id', 'line')
            .datum(this.data[`${currentTeam}`][`${currentStat}`])
            .attr('fill', 'none')
            .attr('stroke', teamColor('Akron'))
            .attr('stroke-width', 1)
            .attr('d', d3.line()
                .x(function (d, i) {
                    return xax(globalApplicationState.years[i]);
                })
                .y(function (d) {
                    return yax(d)
                })
            )
    }
    adjust_YAxis(currentTeam, currentStat){
        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(this.data[currentTeam][currentStat])])
            .range([this.height - 25, this.yAxisPadding])
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data[`${currentTeam}`][`${currentStat}`])])
            .range([this.height - 25, this.yAxisPadding])


    }
}