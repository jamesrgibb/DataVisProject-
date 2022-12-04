class Scatter {
    constructor(state) {
        this.state = state;
        this.data = state.chartData;
        this.svg = d3.select('#scatter-svg');
        this.height = 400;
        this.width = 400;
        this.yAxisPadding = 50;
        this.xAxisPadding = 50;
        this.margin = {left: 50, bottom: 50, top: 10, right: 20};
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
                ys = ys.replaceAll("def", "Defensive")
                ys = ys.replaceAll("off", "Offensive")
                ys = ys.replaceAll("tds", "Touchdowns")
                ys = ys.replaceAll("opp", "Opponent")
                ys = ys.replaceAll("yds", "Yards")
                ys = ys.replaceAll("win", "Win")
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
            .attr('x', (this.width/1.75))
            .attr('y', 35)
            .text(function () {
                let xs = xStat
                xs = xs.replaceAll("_", " ")
                xs = xs.replaceAll("def", "Defensive")
                xs = xs.replaceAll("off", "Offensive")
                xs = xs.replaceAll("tds", "Touchdowns")
                xs = xs.replaceAll("opp", "Opponent")
                xs = xs.replaceAll("yds", "Yards")
                xs = xs.replaceAll("rank", "Rank")
                xs = xs.replaceAll("win", "Win")
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
            .attr('x', -(this.height / 2))
            .attr('y', -30)
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('transform', 'rotate(-90)')
            .text(function () {
                let ys = yStat
                ys = ys.replaceAll("_", " ")
                ys = ys.replaceAll("def", "Defensive")
                ys = ys.replaceAll("off", "Offensive")
                ys = ys.replaceAll("tds", "Touchdowns")
                ys = ys.replaceAll("opp", "Opponent")
                ys = ys.replaceAll("yds", "Yards")
                ys = ys.replaceAll("win", "Win")
                return ys
            })
            .style('text-anchor', "middle");
        let hoverbx = d3.select('#scatter-svg').append('div').attr('class', 'tooltip')
            .style('opacity',0)

        this.svg.append('g')
            .selectAll('circle')
            .data(defaultTriple)
            .join(
                enter => enter
                    .append('circle')
                    .attr('id', d=>`${d[0]}-dot`)
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
            .on('mouseover', function (d) {
                console.log(d)
                d3.select(this).attr('r', 10)
                    .append('text')
                    .transition()
                    .duration(200)
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.85');
                hoverbx.transition()
                    .duration(50)
                    .style("opacity", 1);
                hoverbx.html(d.srcElement.__data__[0])
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
                // hoverbx.transition().duration(200)
                //     .style('opacity',1)
                // hoverbx.html(d.srcElement.__data__[0])
                //     .style("left",(d.screenX+10)+"px")
                //     .style("top",(d.screenY-15)+ "px")
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('r', 6)
                    .transition()
                    .duration(200)
                // hoverbx.transition().duration(200)
                //     .style('opacity', 0 )
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                hoverbx.transition()
                    .duration('50')
                    .style("opacity", 0);
            });

        // this.svg.selectAll('circle')
        //     .on('mouseover', function (d,i,cir) {
        //         console.log(d)
        //         console.log(i[0])
        //         let xSelect =globalApplicationState.correlation.xAxis(d.clientX + 10)
        //         let ySelect =globalApplicationState.correlation.yAxis(d.clientY+ 10)
        //         d3.select(`#${i[0]}-dot`).attr('transform', 'translate('+xSelect+', '+ySelect+') scale(1,1)')
        //         d3.select(`#hoverbx rect`).attr('fill','white')
        //             .attr('opacity',0.75)
        //         d3.select('#teambx').text(i[0])
        //         d3.select('#hoverbx').text(i[1],i[2])
        //     })
        //     .on('mouseout', function (d,i,cir) {
        //         d3.selectAll('#hoverbx text').text('')
        //         d3.selectAll('#hoverbx rect').attr('opacity', 0)
        //     })
        // let logo = this.svg.append('g').attr('id','hoverbx')
        //     logo.append('rect')
        //         .attr('width',50)
        //         .attr('height',50)
        //         .attr('rx','25')
        //         .attr('fill', 'none')
        //
        // logo.append('text')
        //     .attr('id','teambx')
        //     .attr('x', '25')
        //     .attr('y', '25')
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', '30')
        //
        // logo.append('text')
        //     .attr('id', 'hoverbx')
        //     .attr('x', 25)
        //     .attr('y', 15)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', '20')
    }


}