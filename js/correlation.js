class Correlation {
    constructor(state) {
        //Create a new Correlation with the given data
        this.state = state;
        this.svg = d3.select('#chart-svg');
        this.height = 400;
        this.width = 400;
        this.yAxisPadding = 50;
        this.xAxisPadding = 50;
        this.margin = {left: 50, bottom: 50, top: 10, right: 20};
        this.years = this.state.years;
        this.animationDuration = 250;
        this.columns = this.state.table.state.drawData.columns;
        this.data = this.state.chartData;
        this.Team = this.state.table.state.drawData;
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
            .attr('transform', 'translate(0,' + (this.height-this.margin.right) + ')')
            .attr('id', 'x-axis')
            .call(d3.axisBottom(this.xAxis))
            .attr('height', 30)

        this.svg
            .select('#x-axis')
            .append('text')
            .attr('x', (this.width+this.xAxisPadding)/2)
            .attr('y', 30)
            .text('Years')
            .style('text-anchor', "middle")
            .style('font-size', '14px')
            .attr('fill', 'black')

        //set up the y axis
        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(this.data[currentTeam][currentStat])])
            .range([this.height - 20, this.yAxisPadding])

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


        this.svg.append('rect')
            .attr('id', 'clear')
            .attr('x',(this.width-this.xAxisPadding)/2)
            .attr('y',this.height+25)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('width',100)
            .attr('height',30)
            .style('fill', 'mediumaquamarine')
            .style('cursor', 'pointer')
            .style('stroke','black')
            .style('stroke-width','.5px')
            .on('click', function(){
                document.querySelectorAll('.teamline').forEach(function(d){ return d.remove();});
            })
            .on('mouseenter', function(){
                d3.select(this)
                    .transition()
                    .duration(400)
                    .style('fill', 'white')
                    .style('stroke','mediumaquamarine')
                    .style('stroke-width','1px')
                d3.select('#clearText').style('fill','mediumaquamarine')
            })
            .on('mouseleave', function(){
                d3.select(this)
                    .transition()
                    .duration(400)
                    .style('fill', 'mediumaquamarine')
                    .style('stroke','black')
                    .style('stroke-width','.5px')

                d3.select('#clearText').style('fill','white')
            })

        this.svg.append('text')
            .attr('id','clearText')
            .text('Clear Selection')
            .style('text-anchor', "middle")
            .style('font-size', '12px')
            .attr('fill', 'white')
            .style('text-shadow', '1px')
            .attr('x',(this.width/2)+25)
            .attr('y',this.height+43)
            .on('click', function(){
                document.querySelectorAll('.teamline').forEach(function(d){ return d.remove();});
            })
            .on('mouseenter', function(d){
                d3.select('#clear')
                    .transition()
                    .duration(400)
                    .style('fill', 'white')
                    .style('stroke', 'mediumaquamarine')
                    .style('stroke-width','1px')
                d3.select(this)
                    .transition()
                    .duration(400)
                    .style('fill','mediumaquamarine')
            })
            .on('mouseleave', function(){

                d3.select('#clear')
                    .transition()
                    .duration(400)
                    .style('fill', 'mediumaquamarine')
                    .style('stroke','black')
                    .style('stroke-width','.5px')

                d3.select(this)
                    .transition()
                    .duration(400)
                    .style('fill','white')
            })
            .style('cursor', 'pointer')
    }

    chartSetup(currentTeam,corrStat) {
        if(globalApplicationState.correlationState.selectedStat === corrStat){
            document.querySelectorAll('.teamline').forEach(function(d){ return d.remove();});
            d3.select('#y-axis').remove();
            d3.select('#x-axis').remove();
            d3.select('#y-axis').text('');
            globalApplicationState.correlationState.selectedTeams.add(currentTeam);
        }
        else{
            document.querySelectorAll('.teamline').forEach(function(d){ return d.remove();});
            d3.select('#y-axis').remove();
            d3.select('#x-axis').remove();
            d3.select('#y-axis').text('');
            globalApplicationState.correlationState.selectedStat = corrStat
            globalApplicationState.correlationState.selectedTeams = new Set()
            globalApplicationState.correlationState.selectedTeams.add(currentTeam);
        }
        const teams = Object.keys(this.data)
        const stats = Object.keys(this.data.Akron)
        const xax = this.xAxis
        let maxValue = []
        globalApplicationState.correlationState.selectedTeams.forEach(function(d){
            let locMax = d3.max(globalApplicationState.correlation.data[d][corrStat])
            maxValue.push(locMax)
        })
        //set up xAxis
        //set up xAxis
        this.xAxis = d3.scaleTime()
            .domain(d3.extent(this.years))
            .range([this.xAxisPadding, this.width])

        this.svg.append('g')
            .attr('transform', 'translate(0,' + (this.height-this.margin.right) + ')')
            .attr('id', 'x-axis')
            .call(d3.axisBottom(this.xAxis))
            .attr('height', 30)

        this.svg
            .select('#x-axis')
            .append('text')
            .attr('x', (this.width+this.xAxisPadding)/2)
            .attr('y', 30)
            .text('Years')
            .style('text-anchor', "middle")
            .style('font-size', '14px')
            .attr('fill', 'black')

        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(maxValue)])
            .range([this.height - 20, this.yAxisPadding])

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
        for(let k of globalApplicationState.correlationState.selectedTeams) {
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
                .enter()
                .append("text")
                .text(k)
        }

    }
}