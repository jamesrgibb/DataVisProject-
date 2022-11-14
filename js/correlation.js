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
        this.years = [new Date('2013'), new Date('2014'), new Date('2015'), new Date('2016'), new Date('2017'), new Date('2018'), new Date('2019'), new Date('2020'), new Date('2021')]
        this.animationDuration = 250;
        this.columns = this.state.table.state.drawData.columns
        this.data = this.state.chartData
        this.Team = this.state.table.state.drawData
        this.chartSetup()


        // this.yAxis = d3.scaleLinear()
        //     .domain([Math.min(), Math.max()])
        //     .range(this.height - this.xAxisPadding, 10)
        //     .nice();
        // // create xAxis scale
        // this.xAxis = d3.scaleLinear()
        //     .domain([0, 10])
        //     .range(this.margin.left, this.width - this.margin.right)
        // this.xScale = d3.scaleLinear()
        //     .domain([0, 100])
        //     .range(this.margin.left, this.margin.right)
        //
        // this.svg.append('text')
        //     .attr('x', this.width / 2 + 100)
        //     .attr('y', 100)
        //     .attr('text-anchor', 'middle')
        //     .style('font-family', 'Helvetica')
        //     .text(this.state.teamMap.get('Alabama')[0][0])
        //     .style('font-size', '16px')
        //
        // this.svg.append('text')
        //     .attr('x', this.width / 2 + 100)
        //     .attr('y', this.height - 50 + 15)
        //     .attr('text-anchor', 'middle')
        //     .style('font-family', 'Helvetica')
        //     .style('font-size', '16px')
        //     .text('Alabama')
        //
        // this.svg.append('text')
        //     .attr('text-anchor', 'middle')
        //     .attr('transform', 'translate(60' + this.height / 2 + ')rotate(-90)')
        //     .style('font-family', 'Helvetica')
        //     .style('font-size', '16px')
        //     .text('Yards')
        // this.svg.append('g')
        //     .attr('transform', 'translate(0' + this.height + ')')
        //     .call(this.xAxis)
        //
        // this.svg.append('g')
        //     .call(d3.axisLeft(yAxis))
        // // let off_yards = d3.group(Object.keys(this.data.teamMap), this.data.teamMap.Team.)
        // this.svg.append('g')
        //     .call('dot')
        //     .data(this.state)
        //
        // d3.select('#Linechart-x-axis')
        //     .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
        //     .call(d3.axisBottom(this.xAxis));
        //
        // // transfrom the y-axis for the lineChart
        // d3.select('#Linechart-y-axis')
        //     .call(d3.axisLeft(this.yAxis))
        //     .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        // //create the line for the chart with lineGenerator
        // const lineGenerator = d3.line()
        //     .x(d => this.xAxis(d))
        //     .y(d => this.yAxis(this.state.teamMap.get('Alabama (SEC)')[`${d}`][0]['Off.yards']))
        //
        // this.updateLineChart(lineGenerator)
        // this.groupBy()
    }

    // updateLineChart(lineGenerator) {
    //     const lineChart = d3.select('#Linechart')
    //         .select('path')
    //         .data(this.state.teamMap)
    //         .attr('d', lineGenerator)
    //
    //     const pathLength = lineChart.node().getTotalLength();
    //     lineChart.select('stroke-offset', pathLength)
    //         .transition()
    //         .duration(this.animationDuration)
    //         .attr('stroke-offset', 0)
    //
    //
    // }

    chartSetup() {
        // set up svg element
        const currentTeam = null;
        const currentStat = null;
        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        //get stats and team values
        const teams = Object.keys(this.data)
        const stats = Object.keys(this.data.Akron)
        // load values into the dropdown menus
        d3.select('#selectTeam')
            .selectAll('myOptions')
                .data(teams)
            .enter()
                .append('option')
            .text(function (d){ return d;})
            .attr('value',function (d){ return d;})

        d3.select('#Y-Statistic')
            .selectAll('myOptions')
            .data(stats)
            .enter()
            .append('option')
            .text(function (d){ return d.replaceAll('_', ' ');})
            .attr('value',function (d){ return d;})
        //set up the xAxis
        this.xAxis = d3.scaleTime()
            .domain([new Date('2012'),new Date('2022')])
            .range([0,this.width])

        this.svg.append('g')
            .attr('transform', 'translate('+this.xAxisPadding+','+ 375+ ')')
            .attr('id','xAxis')
            .call(d3.axisBottom(this.xAxis))
            .attr('height',30)

        this.svg
            .select('#xAxis')
            .append('text')
            .attr('x', 150)
            .attr('y',30)
            .text('Years')
            .style('font-size','14px')
            .attr('fill','black')

        // const selectedTeam = d3.select('#selectedTeam')
        //     .on('change', function (d){
        //         let selectedTm = d3.selected(this).property('value')
        //     })
        //
        // const selectedStats =  d3.select('#selectedStatistic')
        //     .on('change', function (d){
        //         let selectedSt = d3.selected(this).property('value')
        //     })
        //set up the color ranges
        let teamColor = d3.scaleOrdinal(d3.schemeTableau10).domain(teams);
        //set up the yAxis
        this.yAxis = d3.scaleLinear()
            .domain([0,d3.max(this.data.Alabama.wins)])
            .range([this.height-25,this.yAxisPadding])

        this.svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate('+this.yAxisPadding+',0)')
            .attr('width', 100)
            .call(d3.axisLeft(this.yAxis))

        this.svg.select('#y-axis')
            .append('text')
            .text('Statistic')
            .attr('x', -200)
            .attr('y', -20)
            .attr('fill', 'black')
            .attr('font-size','14px')
            .attr('transform', 'rotate(-90)');

        // create the line for the data
        const line = this.svg.append('g')
            .append('path')
            .datum(this.data.Alabama)
            .attr('d', d3.line()
                .x(function(d) {
                    console.log(d)
                    return this.years[d]})
                .y(function(d) {return this.yAxis(d.wins)})
            )
            .attr('fill', teamColor('Alabama'))
            .attr('stroke-width', 4)

        function updateTeam(selectedTeam,selectedStat){
            line
                .datum(globalApplicationState.correlation.data[`${selectedTeam}`][`${selectedStat}`])
                .attr('d',(c,v)=> {
                    return d3.line()
                        .x(function (d, i) {
                            console.log(i)
                            return globalApplicationState.correlation.xAxis(globalApplicationState.correlation.years[i]);
                        })
                        .y(function (d) {
                            return globalApplicationState.correlation.yAxis(d.wins);
                        })
                        (v)
                })
                .attr(function(d) {return teamColor(selectedTeam)})
        }
        d3.select('#selectTeam')
            .on('change', function (d){
                let selectedTeam = d3.select(this).property('value')
                let selectedStat = d3.select('#Y-Statistic').property('value')

                if(selectedStat === 'none'){
                    updateTeam(selectedTeam,'wins')
                }
                else {
                    updateTeam(selectedTeam, selectedStat)
                }
            })
        // d3.select('#Y-Statistic')
        //     .on('change', function (d){
        //         console.log(d3.select('#selectedTeam').property('value'))
        //         let selectedTeam = d3.select('#selectedTeam').property('value')
        //         let selectedStat = d3.selected(this).property('value')
        //         updateTeam(selectedTeam,selectedStat)
        //     })


    }

}