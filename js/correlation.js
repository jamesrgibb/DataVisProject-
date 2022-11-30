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
        this.years = this.state.years;
        this.animationDuration = 250;
        this.columns = this.state.table.state.drawData.columns;
        this.data = this.state.chartData;
        this.Team = this.state.table.state.drawData;
        this.selectTeam = state.correlationState.selectedTeams;
        this.selectStat = state.correlationState.selectedStat;
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
            .attr('id', 'x-axis')
            .call(d3.axisBottom(this.xAxis))
            .attr('height', 30)

        this.svg
            .select('#x-axis')
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
    }

    chartSetup(currentTeam,corrStat) {

        if(globalApplicationState.correlationState.selectedStat === corrStat){
            document.querySelectorAll('.teamline').forEach(function(d){ return d.remove();});
            d3.select('#y-axis').remove();
            d3.select('#x-axis').remove();
            d3.select('#y-axis').text('');
            this.selectTeam.add(currentTeam);
        }
        else{
            document.querySelectorAll('.teamline').forEach(function(d){ return d.remove();});
            d3.select('#y-axis').remove();
            d3.select('#x-axis').remove();
            d3.select('#y-axis').text('');
            globalApplicationState.correlationState.selectedStat = corrStat
            this.selectTeam = new Set()
            this.selectTeam.add(currentTeam);
        }
        console.log(this.selectTeam)
        const teams = Object.keys(this.data)
        const stats = Object.keys(this.data.Akron)
        const xax = this.xAxis
        let maxValue = []
        this.selectTeam.forEach(function(d){
            let locMax = d3.max(globalApplicationState.correlation.data[d][corrStat])
            maxValue.push(locMax)
        })
        //set up xAxis
        this.xAxis = d3.scaleTime()
            .domain(d3.extent(this.years))
            .range([this.xAxisPadding, this.width])

        this.svg.append('g')
            .attr('transform', 'translate(0,' + 375 + ')')
            .attr('id', 'x-axis')
            .call(d3.axisBottom(this.xAxis))
            .attr('height', 30)

        this.svg
            .select('#x-axis')
            .append('text')
            .attr('x', 150)
            .attr('y', 30)
            .text('Years')
            .style('text-anchor', "middle")
            .style('font-size', '14px')
            .attr('fill', 'black')

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
                let ys = corrStat.replaceAll('_', ' ')
                ys = ys.replaceAll("def", "Defensive")
                ys = ys.replaceAll("off", "Offensive")
                ys = ys.replaceAll("tds", "Touchdowns")
                ys = ys.replaceAll("opp", "Opponent")
                ys = ys.replaceAll("yds", "Yards")
                ys = ys.toUpperCase()

                return ys
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

        // create the lines for the data
        for(let k of this.selectTeam) {
            this.svg.append('g')
                .append('path')
                .attr('id', `line-${k}`)
                .attr('class', 'teamline')
                .datum(this.data[k][corrStat])
                .attr('fill', 'none')
                .attr('stroke', teamColor(k))
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
                .data(this.data[k][corrStat])
                .enter()
                .append("text")
        }

    }
}