import * as d3 from 'https://unpkg.com/d3?module';

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(response => response.json())
    .then(d => createGraph(d));


window.onload = () => {
    const rects = document.getElementsByTagName("rect");
    document.getElementById("tooltip")
    for(let rect of rects){
        rect.onmouseover = () => {
            document.getElementById("tooltip").setAttribute("data-date", rect.attributes.getNamedItem("data-date").value);
            document.getElementById("info").innerText = rect.attributes.getNamedItem("data-date").value + "\n$" + rect.attributes.getNamedItem("data-gdp").value + " billion";
            document.getElementById("tooltip").classList.add("visible");
            document.getElementById("tooltip").classList.remove("invisible");
            if(rect.x.baseVal.value > 240){
                document.getElementById("tooltip").style.left = rect.x.baseVal.value - 170 + "px";
            }
            else {
                document.getElementById("tooltip").style.left = 70 + "px";
            }
            if(rect.y.baseVal.value > 105){
                document.getElementById("tooltip").style.top = rect.y.baseVal.value - 10 + "px";
            }
            else {
                document.getElementById("tooltip").style.left = 639.47 + "px";
                document.getElementById("tooltip").style.top = 96 + "px";
            }
        }
        rect.onmouseleave = () => {
            document.getElementById("tooltip").classList.remove("visible");
            document.getElementById("tooltip").classList.add("invisible");
        }
    }
}

function createGraph(data){
    console.log(data);
    const width = 900;
    const height = 520;
    const margins = {top: 60, right: 50, bottom: 60, left: 50};
    const svg = d3.select("div.panel").append("svg").attr("width", width).attr("height", height);
    const xScale = d3.scaleTime()
                     .domain([new Date(data.from_date), new Date(data.to_date)])
                     .range([margins.left,width - margins.right]);
    const yScale = d3.scaleLinear()
                     .domain([d3.min(data.data, d => d[1]),d3.max(data.data, d => d[1])])
                     .range([height - margins.bottom - 10, margins.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - margins.bottom) + ")")
    .call(xAxis);
    svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + margins.left + ", 10)")
    .call(yAxis);

    svg.selectAll("rect").data(data.data).enter().append("rect")
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp" , d => d[1])
    .attr("width", 5)
    .attr("height", d => height - yScale(d[1]) - margins.bottom);

    svg.append("text")
    .attr("x", margins.left + 20)
    .attr("y", height/2)
    .text(data.description.substring(7, 26))
    .style("transform-origin", margins.left+20 + "px " + height/2 + "px")
    .style("transform", "rotate(-90deg)");

    svg.append("text")
    .attr("x", width - 300)
    .attr("y", height - 10)
    .attr("margin", "10px")
    .text("Source: " + data.source_name);

}
