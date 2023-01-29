import * as d3 from 'https://unpkg.com/d3?module';

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(response => response.json())
    .then(d => createGraph(d));

window.onload = () => {
    const rects = document.getElementsByTagName("rect");
    const div = document.createElement("div");
    div.id = "description";
    const p = document.createElement("p");
    p.id = "title";
    div.appendChild(p);
    div.classList.add("invisible");
    document.getElementsByTagName("body")[0].appendChild(div);
    for(let rect of rects){
        rect.onmouseover = () => {
            p.innerHTML = rect.getElementsByTagName("text")[0].textContent;
            p.innerText = p.innerHTML.substring(0, 10) + "\n" + p.innerHTML.substring(10);
            div.classList.add("visible");
            div.classList.remove("invisible");
            if(rect.x.baseVal.value > 200){
                div.style.left = rect.x.baseVal.value + 130 + "px";
            }
            else {
                div.style.left = 325 + "px";
            }
            if(rect.y.baseVal.value > 100){
                div.style.top = rect.y.baseVal.value + 120 + "px";
            }
            else {
                div.style.left = 963 + "px";
                div.style.top = 221 + "px";
            }
        }
        rect.onmouseleave = () => {
            div.classList.remove("visible");
            div.classList.add("invisible");
        }
    }
}

function createGraph(data){
    console.log(data);
    const width = 900;
    const height = 520;
    const margins = {top: 60, right: 40, bottom: 60, left: 40};
    const svg = d3.select("div.panel").append("svg").attr("width", width).attr("height", height);
    const xScale = d3.scaleTime()
                     .domain([new Date(data.from_date), new Date(data.to_date)])
                     .range([margins.left,width - margins.right]);
    const yScale = d3.scaleLinear()
                     .domain([d3.min(data.data, d => d[1]),d3.max(data.data, d => d[1])])
                     .range([height - margins.bottom - 10, margins.top + 10]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
    .attr("transform", "translate(0," + (height - margins.bottom) + ")")
    .call(xAxis);
    svg.append("g")
    .attr("transform", "translate(" + margins.left + ", 10)")
    .call(yAxis);

    svg.selectAll("rect").data(data.data).enter().append("rect")
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("width", 5)
    .attr("height", d => height - yScale(d[1]) - margins.bottom)
    .append("text")
    .attr("class", "data")
    .text(d => d[0] + " $" + d[1] + " billion");

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