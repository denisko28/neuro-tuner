import React from "react";
import * as d3 from "d3";

class NeuronsVisual extends React.Component {
    state = {
        data: this.props.data,
    }

    svgRef = React.createRef();
    svgWidth = this.props.dimensions.width;
    svgHeight = this.props.dimensions.height;
    nodeSize = 20;

    componentDidMount() {
        this.renderVisual();
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            this.setState({data: this.props.data}); 
        }
        this.renderVisual();
    }

    renderVisual() {
        var data = this.state.data;
        var {width, height} = this.props.dimensions;
        if (data && data.length) {
            const xScale = d3.scaleLinear()
                .domain([0, 50])
                .range([0, width]);
            const yScale = d3.scaleLinear()
                .domain([0, 50])
                .range([0, height]);

            const svgEl = d3.select(this.svgRef.current);
            svgEl.selectAll("*").remove(); // Clear svg content before adding new elements 
            var svg = svgEl
                .append("g");

            var nodes = []

            // get network size
            for (var i = 0; i < data.length; i++) {
                var nodesNum = data[i];
                for (var j = 0; j < nodesNum; j++) {
                    nodes.push({ "label": `${i}${j}`, "layer": i + 1, "lidx": j + 1 })
                }
            }

            // calc distances between nodes
            var largestLayerSize = 0;
            var largestLayerIndex = 0;
            data.map((value, index) => {
                if (largestLayerSize < value) {
                    largestLayerSize = value;
                    largestLayerIndex = index;
                }
            })

            var xdist = width / data.length,
                ydist = height / largestLayerSize;

            // create node locations
            nodes.map(function (d) {
                var test = d.lidx;
                if (d.layer != largestLayerIndex + 1)
                    test += (largestLayerSize - data[d.layer - 1]) / 2;
                d["x"] = (d.layer - 0.5) * xdist;
                d["y"] = (test - 0.5) * ydist;
            });

            // Add X grid lines with labels
            const xAxis = d3.axisBottom(xScale)
                .ticks(5)
                .tickSize(-height);
            const xAxisGroup = svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);
            xAxisGroup.select(".domain").remove();
            xAxisGroup.selectAll("line").attr("stroke", "#efeaea");
            xAxisGroup.selectAll("text")
                .attr("opacity", 0.5)
                .attr("color", "white")
                .attr("font-size", "0.75rem");
            // Add Y grid lines with labels
            const yAxis = d3.axisLeft(yScale)
                .ticks(5)
                .tickSize(-width)
                .tickFormat((val) => `${val}%`);
            const yAxisGroup = svg.append("g").call(yAxis);
            yAxisGroup.select(".domain").remove();
            yAxisGroup.selectAll("line").attr("stroke", "#efeaea");
            yAxisGroup.selectAll("text")
                .attr("opacity", 0.5)
                .attr("color", "white")
                .attr("font-size", "0.75rem");

            // autogenerate links
            var links = [];
            nodes.map(function (d, i) {
                for (var n in nodes) {
                    if (d.layer + 1 == nodes[n].layer) {
                        links.push({ "source": parseInt(i), "target": parseInt(n), "value": 1 })
                    }
                }
            }).filter(function (d) { return typeof d !== "undefined"; });

            // draw links
            var link = svg.selectAll(".link")
                .data(links)
                .enter().append("line")
                .attr("class", "link")
                .attr("x1", function (d) { return nodes[d.source].x; })
                .attr("y1", function (d) { return nodes[d.source].y; })
                .attr("x2", function (d) { return nodes[d.target].x; })
                .attr("y2", function (d) { return nodes[d.target].y; })
                .attr("stroke", "red")
                .style("stroke-width", function (d) { return Math.sqrt(d.value); });

            // draw nodes
            var node = svg.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                }
                );

            var circle = node.append("circle")
                .attr("class", "node")
                .attr("r", this.nodeSize)
                .style("fill", "#0d6efd");


            // node.append("text")
            //     .attr("dx", "-.5em")
            //     .attr("dy", ".5em")
            //     .text(function(d) { return d.label; });

        }
    }

    render() {
        return <svg ref={this.svgRef} width={this.svgWidth} height={this.svgHeight} />;
    }
}

export default NeuronsVisual;