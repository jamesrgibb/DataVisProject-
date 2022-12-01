class Scatter {
    constructor(state) {
        this.state = state;
        this.data = state.chartData;
        this.svg = d3.select('#scatter-svg');
        this.height = 400;
        this.width = 300;
        this.yAxisPadding = 50;
        this.xAxisPadding = 50;
        this.margin = {left: 50, bottom: 20, top: 10, right: 20};
        this.yearsDisplayed = state.years
        this.years = {0: 2012,1:2013,2:2014,3:2015,4:2016,5:2017,6:2018,7:2019}
        this.yAxis = null;
        this.xAxis = null;
        this.teams = Object.keys(this.data)
        this.stats = Object.keys(this.data.Akron)
        this.teamColor = d3.scaleOrdinal(d3.schemeTableau10).domain(this.teams);
        this.columns = state.scatterState.drawData.columns
        let columns = state.scatterState.drawData.columns
        this.drawData = state.scatterState.drawData.filter(d => !state.missingTeamData.includes(d.Team))
        this.scatterData = d3.rollup(this.drawData, function (v) {
                let reducedMap = new Map()
                columns.forEach(function (col) {
                    reducedMap.set(col, v[0][col])
                })
                return Object.fromEntries(reducedMap)
            },
            d => d.Team
        )
        d3.select('#selectY-axis')
            .selectAll('myOptions')
            .data(this.columns)
            .enter()
            .append('option')
            .text(function (d) {
                let ys = d
                ys = ys.replaceAll(".", " ")
                ys = ys.replaceAll("Def", "Defensive")
                ys = ys.replaceAll("Off", "Offensive")
                ys = ys.replaceAll("TDs", "Touchdowns")
                ys = ys.replaceAll("Opp", "Opponent")
                ys = ys.replaceAll("Yds", "Yards")
                return ys
            })
            .attr('value', function (d) {
                return d
            })
        //TODO: edit list showing to only show the stats on the table
        d3.select('#selectX-axis')
            .selectAll('myOptions')
            .data(this.columns)
            .enter()
            .append('option')
            .text(function (d) {
                let ys = d
                ys = ys.replaceAll(".", " ")
                ys = ys.replaceAll("Def", "Defensive")
                ys = ys.replaceAll("Off", "Offensive")
                ys = ys.replaceAll("TDs", "Touchdowns")
                ys = ys.replaceAll("Opp", "Opponent")
                ys = ys.replaceAll("Yds", "Yards")
                return ys
            })
            .attr('value', function (d) {
                return d
            })
        d3.select('#select-Year')
            .selectAll('myOptions')
            .data(this.yearsDisplayed)
            .enter()
            .append('option')
            .text(d => d.getFullYear())
            .attr('value', function (d,i) {
                return i
            })

        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
        const button = d3.select('#display-graph')

        button.on('click', function (d) {
            d3.select('dot').exit().remove();
            d3.select('#scatterY').remove()
            d3.select('#scatterX').remove()
            d3.select('#scatterY').text('');
            d3.select('#scatterX').text('');
            let yr = d3.select('#select-Year').property('value')
            return globalApplicationState.scatter.updateScatter(d3.select('#selectY-axis').property('value'),
                d3.select('#selectX-axis').property('value'),
                yr)
        });

        this.updateScatter('Def.Rank', 'Win', 7)

    }

    updateScatter(xStat, yStat, yearStat) {
        document.querySelectorAll('circle').forEach(function(d){ return d.remove();})
        let defaultTriple = []
        let xa = []
        let ya = []
        xStat = xStat.replaceAll(".", "_").toLowerCase()
        yStat = yStat.replaceAll(".", "_").toLowerCase()
        for (let d in this.data) {
            xa.push(this.data[d][xStat][yearStat])
            ya.push(this.data[d][yStat][yearStat])
            defaultTriple.push([d,this.data[d][xStat][yearStat], this.data[d][yStat][yearStat]])
        }
        this.xAxis = d3.scaleLinear()
            .domain([0, d3.max(xa)])
            .range([this.xAxisPadding, this.width])

        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(ya)])
            .range([this.height - 25, this.yAxisPadding])

        this.svg.append('g')
            .attr('transform', 'translate(0,' + 375 + ')')
            .attr('id', 'scatterX')
            .call(d3.axisBottom(this.xAxis))
        this.svg
            .select('#scatterX')
            .append('text')
            .attr('x', 150)
            .attr('y', 30)
            .text(function () {
                let xs = xStat
                xs = xs.replaceAll(".", " ")
                xs = xs.replaceAll("Def", "Defensive")
                xs = xs.replaceAll("Off", "Offensive")
                xs = xs.replaceAll("TDs", "Touchdowns")
                xs = xs.replaceAll("Opp", "Opponent")
                xs = xs.replaceAll("Yds", "Yards")
                return xs

            })
            .attr('fill', 'black')
            .style('font-size', '14px')
            .style('text-anchor', "middle");


        this.svg.append('g')
            .attr('id', 'scatterY')
            .attr('transform', 'translate(' + this.yAxisPadding + ',0)')
            .attr('width', 100)
            .call(d3.axisLeft(this.yAxis))

        this.svg.select('#scatterY')
            .append('text')
            .attr('x', -200)
            .attr('y', -40)
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('transform', 'rotate(-90)')
            .text(function () {
                let ys = yStat
                ys = ys.replaceAll(".", " ")
                ys = ys.replaceAll("Def", "Defensive")
                ys = ys.replaceAll("Off", "Offensive")
                ys = ys.replaceAll("TDs", "Touchdowns")
                ys = ys.replaceAll("Opp", "Opponent")
                ys = ys.replaceAll("Yds", "Yards")
                return ys
            })
            .style('text-anchor', "middle");


        this.svg.append('g')
            .selectAll('circle')
            .data(defaultTriple)
            .join(
                enter => enter
                    .append('circle')
                    .attr('cx', (d) => this.xAxis(d[1]))
                    .attr('cy', (d) => this.yAxis(d[2]))
                    .attr('r', 0)
                    .transition()
                    .duration(200)
                    .attr('r', 7)
                    .transition()
                    .delay(200)
                    .duration(200)
                    .attr('r', 6)
                    .style('fill', d => this.teamColor(d[0]))
                    .style("stroke", "black"),

                update => update
                    .transition()
                    .duration(200)
                    .attr('transform', `translate(0,20)`)
                    .attr('cx', (d) => this.xAxis(d[1]))
                    .attr('cy', (d) => this.yAxis(d[2])),

                exit => exit
                    .transition()
                    .duration(200)
                    .attr('r', 6)
                    .transition()
                    .delay(200)
                    .duration(200)
                    .attr('r', 0)
                    .remove()
            )
            .on('mouseenter', function (d) {
                d3.select(this).attr('r', 10)
                    .append('text')
                    .text('hello')
                    .transition()
                    .duration(200)

            })
            .on('mouseleave', function (d) {
                d3.select(this).attr('r', 6)
                    .transition()
                    .duration(200)
                    .text('')
            });
    }


}