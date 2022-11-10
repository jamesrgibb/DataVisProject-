class Correlation {
    constructor(data) {
        this.data = data;
        this.svg = d3.select('#correlation');
        this.height = 500;
        this.width = 700;
        this.yAxisPadding = 80;
        this.xAxisPadding = 50;
        this.margin = {left: 50, bottom: 20, top: 20, right: 20};
        this.years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
        // console.log(this.data.teamMap.get('Alabama')['0']);

        this.colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain([...this.data.teamMap])
        this.yAxis = d3.scaleLinear()
            .domain([0, Math.max(this.data.teamMap.get('Alabama (SEC)')['0'][0]['Off.yards'])])
            .range(this.height - this.xAxisPadding, 10)
            .nice();
        this.horizontalScale = d3.scalePoint()
            .domain([0, 10])
            .range(this.margin.left, this.width - this.margin.right)

        d3.select('#Linechart-x-axis')
            .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(this.horizontalScale));

        d3.select('#Linechart-y-axis')
            .call(d3.axisLeft(this.yAxis))
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        const lineGenerator = d3.line()
            .x(d => this.horizontalScale(d))
            .y(d => this.yAxis(this.data.teamMap.get('Alabama (SEC)')[`${d}`][0]['Off.yards']))

        updateLineChart(lineGenerator)
    }

}