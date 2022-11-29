class Scatter {
    constructor(state) {
        this.data = state.chartData;
        this.svg = d3.select('#scatter-svg');
        this.height = 400
        this.height = 400;
        this.width = 300;
        this.yAxisPadding = 50;
        this.xAxisPadding = 50;
        this.margin = {left: 50, bottom: 20, top: 10, right: 20};
        this.years = state.years
        this.yAxis = null;
        this.xAxis = null;
        this.teams = Object.keys(this.data)
        this.stats = Object.keys(this.data.Akron)

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
                return d.replaceAll(".", " ");
            })
            .attr('value', function (d) {
                return d
            })
        d3.select('#selectX-axis')
            .selectAll('myOptions')
            .data(this.columns)
            .enter()
            .append('option')cccc
            .text(function (d) {
                return d.replaceAll(".", " ");
            })
            .attr('value', function (d) {
                return d
            })
        d3.select('#select-Year')
            .selectAll('myOptions')
            .data(this.years)
            .enter()
            .append('option')
            .text(d => d.getFullYear())
            .attr('value', function (d) {
                return d
            })
        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)

        this.drawDefaultScatter()

        d3.select('#display-graph')
            .on('click', function (d) {
                d3.select('dot').exit().remove();
                d3.select('#scatterY').remove()
                d3.select('#scatterX').remove()
                d3.select('#scatterY').text('');
                d3.select('#scatterX').text('');
                return globalApplicationState.scatter.updateScatter(d3.select('#selectY-axis').property('value'),
                    d3.select('#selectX-axis').property('value'),
                    d3.select('#select-Year').property('value'))
            })

    }

    drawDefaultScatter() {
        let ya = []
        let xa = []
        this.scatterData.forEach(function (d) {
            ya.push(parseInt(d.Win))
        })

        this.scatterData.forEach(function (d) {
            xa.push(d['Def.Rank'])
        })

        let defaultTuple = []
        xa.forEach(function (d, i) {
            defaultTuple.push([xa[i], ya[i]])
        })

        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(ya)])
            .range([this.height - 25, this.yAxisPadding])

        this.xAxis = d3.scaleLinear()
            .domain([0, d3.max(xa)])
            .range([this.xAxisPadding, this.width])

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
            .text('Wins');

        this.svg.append('g')
            .attr('transform', 'translate(0,' + 375 + ')')
            .attr('id', 'scatterX')
            .call(d3.axisBottom(this.xAxis))
            .attr('height', 30)

        this.svg
            .select('#scatterX')
            .append('text')
            .attr('x', 150)
            .attr('y', 30)
            .text('Defensive Ranking')
            .style('font-size', '14px')
            .attr('fill', 'black')

        this.svg.append('g')
            .selectAll('circle')
            .data(defaultTuple)
            .enter()
            .append('circle')
            .attr('cx', d => this.xAxis(d[0]))
            .attr('cy', d => this.yAxis(d[1]))
            .attr('r', 2)
            .style('fill', 'black')
        this.attachHover()
    }

    updateScatter(yVal, xVal, yearVal) {
        let ya = []
        let xa = []
        this.scatterData.forEach(function (d) {
            ya.push(parseInt(d[yVal]))
        })

        this.scatterData.forEach(function (d) {
            xa.push(d[xVal])
        })
        let updatedTuple = []
        xa.forEach(function (d, i) {
            updatedTuple.push([xa[i], ya[i]])
        })
        this.yAxis = d3.scaleLinear()
            .domain([0, d3.max(ya)])
            .range([this.height - 25, this.yAxisPadding])

        this.xAxis = d3.scaleLinear()
            .domain([0, d3.max(xa)])
            .range([this.xAxisPadding, this.width])

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
            .text(yVal);

        this.svg.append('g')
            .attr('transform', 'translate(0,' + 375 + ')')
            .attr('id', 'scatterX')
            .call(d3.axisBottom(this.xAxis))
            .attr('height', 30)

        this.svg
            .select('#scatterX')
            .append('text')
            .attr('x', 150)
            .attr('y', 30)
            .text(xVal)
            .style('font-size', '14px')
            .attr('fill', 'black')

        this.svg.append('g')
            .selectAll('circle')
            .data(updatedTuple)
            .enter()
            .append('circle')
            .attr('cx', d => this.xAxis(d[0]))
            .attr('cy', d => this.yAxis(d[1]))
            .attr('r', 2)
            .style('fill', 'black')
        d3.selectAll('circle')
            .on('hover', function (d){
                console.log(d)
            })

    }

    attachHover() {


    }

}