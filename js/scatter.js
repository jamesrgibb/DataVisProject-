class Scatter {
    constructor(state) {
        this.state = state;
        this.data = state.chartData;
        this.svg = d3.select('#scatter-svg');
        this.height = 500;
        this.width = 500;
        this.yAxisPadding = 50;
        this.xAxisPadding = 50;
        this.margin = {left: 50, bottom: 50, top: 10, right: 20};
        this.yearsDisplayed = [2013,2014,2015,2016,2017,2018,2019,2020]
        this.years = {0: 2013,1:2014,2:2015,3:2016,4:2017,5:2018,6:2019,7:2020}
        this.yAxis = null;
        this.xAxis = null;
        this.teams = Object.keys(this.data)
        this.stats = Object.keys(this.data.Akron)
        this.teamColor = d3.scaleOrdinal(d3.schemeTableau10).domain(this.teams);
        this.columns = state.scatterState.drawData.columns
        let columns = state.scatterState.drawData.columns
        this.drawData = state.scatterState.drawData.filter(d => !state.missingTeamData.includes(d.Team))
        this.svg.style('margin-left', 'auto')
            .style('margin-right', 'auto')
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
            .text(d => d)
            .attr('value', function (d,i) {
                return i
            })

        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
        const button = d3.select('#display-graph').style('margin-left', this.width/2.5+'px')

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
            .domain([d3.min(xa), d3.max(xa)])
            .range([this.xAxisPadding, this.width])

        this.yAxis = d3.scaleLinear()
            .domain([d3.min(ya), d3.max(ya)])
            .range([this.height - 25, this.yAxisPadding])

        this.svg.append('g')
            .attr('transform', 'translate(0,' + (this.height-25) + ')')
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

        let div = d3.select(".tooltip")
            .style("opacity", 1e-6)

        this.svg.append('g')
            .selectAll('circle')
            .data(defaultTriple)
            .join(

                enter => enter
                    .append('circle')
                    .attr('id', d=>{
                        return `${d[0]}-dot`
                    })
                    .attr('cx', (d) => this.xAxis(d[1]))
                    .attr('cy', (d) => this.yAxis(d[2]))
                    .attr('r', 0)
                    .transition()
                    .duration(300)
                    .attr('r', 7)
                    .transition()
                    .delay(100)
                    .duration(300)
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
                    .duration(300)
                    .attr('r', 6)
                    .transition()
                    .delay(100)
                    .duration(300)
                    .attr('r', 0)
                    .remove()
            )
            .on('mouseover', function (d) {
                d3.select(this).attr('r', 10)
                    .transition()
                    .duration(500)
                let string = "<img SameSite=None src=" + globalApplicationState.logos[d.path[0].__data__[0]] + " style= width='100px' height='100px'>"
                div.html(string)
                    .transition()
                    .duration(500)
                    .style("opacity", 1)
                d3.select('#schoolLogo').append('text').text(function () {
                    function stringSetter(stat, clIndicator) {
                        let ys = stat
                        ys = ys.replaceAll("_", " ")
                        ys = ys.replaceAll("def", "Defensive")
                        ys = ys.replaceAll("off", "Offensive")
                        ys = ys.replaceAll("tds", "Touchdowns")
                        ys = ys.replaceAll("opp", "Opponent")
                        ys = ys.replaceAll("yds", "Yards")
                        ys = ys.replaceAll("win", "Win")
                        let indicator
                        if(clIndicator === 'x'){
                            indicator = d.path[0].__data__[1]
                        }
                        else{
                            indicator = d.path[0].__data__[2]
                        }
                        return ys + ': ' + indicator
                    }
                    let ystring = stringSetter(yStat,'y')
                    let xstring = stringSetter(xStat, 'x')
                    return `${xstring}  
                        ${ystring}`
                })
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('r', 6)
                    .transition()
                    .duration(200)
                div.transition()
                    .duration(500)
                    .style("opacity", 1e-6);
            });
    }


}