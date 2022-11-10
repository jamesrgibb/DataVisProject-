class Correlation {
    constructor(data) {
        //Create a new Correlation with the given data
        this.data = data;
        this.svg = d3.select('#correlation');
        this.height = 500;
        this.width = 700;
        this.yAxisPadding = 80;
        this.xAxisPadding = 50;
        this.margin = {left: 50, bottom: 20, top: 20, right: 20};
        this.years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
        console.log(this.data.teamMap.get('Alabama')['0']);
        // create colorscale object
        this.colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain([...this.data.teamMap])
        // create yAxis scale
        this.yAxis = d3.scaleLinear()
            .domain([0, Math.max(this.data.teamMap.get('Alabama (SEC)')['0'][0]['Off.yards'])])
            .range(this.height - this.xAxisPadding, 10)
            .nice();
        // create xAxis scale
        this.xAxis = d3.scaleLinear()
            .domain([0, 10])
            .range(this.margin.left, this.width - this.margin.right)
        // append this to the lineChart in the html
        d3.select('#Linechart-x-axis')
            .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(this.horizontalScale));

        // transfrom the y-axis for the lineChart
        d3.select('#Linechart-y-axis')
            .call(d3.axisLeft(this.yAxis))
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        //create the line for the chart with lineGenerator
        const lineGenerator = d3.line()
            .x(d => this.horizontalScale(d))
            .y(d => this.yAxis(this.data.teamMap.get('Alabama (SEC)')[`${d}`][0]['Off.yards']))

        updateLineChart(lineGenerator)
    }

}