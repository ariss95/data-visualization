var queryResults = {};
var maxColumn = 2;

function getIndicName(s){
	indicators ={"AG.LND.FRST.ZS": "Forest area %", "SH.XPD.CHEX.GD.ZS": "Current health expenditure %", "EG.ELC.ACCS.ZS": "Access to electricity %", "SE.PRM.UNER.MA.ZS": "Children out of school male %",
	 "SE.PRM.UNER.FE.ZS": "Children out of school female %", "TM.VAL.FUEL.ZS.UN": "Fuel imports %",
	 "TX.VAL.FUEL.ZS.UN": "Fuel exports %", "MS.MIL.XPND.GD.ZS": "Military expenditure %GDP",
	 "IP.JRN.ARTC.SC": "journal articles", "SL.UEM.1524.MA.NE.ZS": "Unemployement youth male % (15-24)",
	 "SL.UEM.1524.FE.NE.ZS": "Unemployement youth female % (15-24)", "ST.INT.ARVL": "International tourism arrivals (*10k)"}
	 countries = {"ALB": "Albania", "ARG": "Argentina", "AUS": "Australia","BGR": "Bulgaria","BRA": "Brazil", "CHL": "Chile", "CUB":"Cuba", "CYP":"Cyprus","CZE": "Czech Republic", "DNK":"Denmark", "FRA": "France", "GRC": "Greece"}
	 for (i in indicators){
		if ( i === s){
			return indicators[i]; 
		}
	 }
	 for (c in countries){
		if ( c === s){
			return countries[c]; 
		}
	 }
}

function getData() {
	fetch('/getData', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
	}
	}).then(data => {
		return data.json()
	}).then(res => {queryResults = res;
		return queryResults;
	}).then(res => {draw();})
	.catch(error => console.error('Error:', error));

    console.log("after fetch");
	//setTimeout(function(){ }, 2000);
}	

function draw(){	
	var svg = d3.select("svg"),
	  margin = {top: 20, right: 20, bottom: 30, left: 100},
	  width = +svg.attr("width")  - margin.left - margin.right,
	  height = +svg.attr("height") - margin.top  - margin.bottom,
	  x0 = d3.scaleBand().rangeRound([0, width]).padding(.1),
	  x1 = d3.scaleBand(),
	  y = d3.scaleLinear().rangeRound([height, 0]),
	  g = svg.append("g")
		           .attr("transform", `translate(${margin.left},${margin.top})`);
	var legend = document.getElementById("legend");
	legend.style.overflow = "hidden";
	d3.json("/getData", function(error, data) {
		
		data1 = [];
		data2 = [];
		data3 = [];
		biggerData = data; //added for one counrty case!!!!!!!!!

		countOfBars = Math.max(data.length/60, Object.keys(queryResults[1]).length - 2);
		
		bandwidthFlag = 1;
		if (countOfBars === 1)
			bandwidthFlag = 0;
		for (var i = 0; i < data.length; i++){
			if (i < 60){
				data1.push(data[i]);
			}
			else if (i < 120){
				data2.push(data[i]);
			}
			else{
				data3.push(data[i]);
			}
		}
		//console.log(data3);
		x0.domain(data.map(d => d.year));
		//x1.domain(data2.map(d => d.year));
		x1.domain(['year', 'year']).range([0, x0.bandwidth()]);
		
		if(data.length > 60){ //added for one counrty case!!!!!!!!!
			tempMax = d3.max(data1, d => d[Object.keys(queryResults[1])[2]]);
			currentMax = d3.max(data2, d => d[Object.keys(queryResults[1])[2]]);

			if(tempMax > currentMax){
				biggerData = data1; 
			}
			else{
				biggerData = data2;
			}
		}
		//console.log("<");
		//console.log(biggerData);
		if(data.length > 120){ //added for one counrty case!!!!!!!!!
			tempMax = d3.max(biggerData, d => d[Object.keys(queryResults[1])[2]]);
			currentMax = d3.max(data3, d => d[Object.keys(queryResults[1])[2]]);
			if(currentMax > tempMax){
				console.log("data2 smaller");
				biggerData = data3; 
			}
		}

		if(Object.keys(queryResults[1]).length - 2 > 1){
			maxColumnValue = d3.max(biggerData, d => d[Object.keys(queryResults[1])[2]]) 
			for(i = 3; i < Object.keys(queryResults[1]).length; i++){
				console.log(biggerData[Object.keys(queryResults[1])[3]]);
				//first = d3.max(biggerData, d => d[Object.keys(queryResults[1])[i-1]])
				second = d3.max(biggerData, d => d[Object.keys(queryResults[1])[i]])
				if(maxColumnValue < second){
					console.log("XRONIA POLL KYR NIKO");
					maxColumn = i;
					maxColumnValue = second
				}
			}
			
		}
		y.domain([0, d3.max(biggerData, d => d[Object.keys(queryResults[1])[maxColumn]])]); 
		 
		g.append("g") 
		.attr("class", "axis axis-x") 
		.attr("transform", `translate(0,${height})`) 
		.call(d3.axisBottom(x0).tickSizeOuter(0))
		.selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
		
		var yAxisText = "Indicators" + '"' + Object.keys(queryResults[1])[maxColumn] + '"'; 

		g.append("g") 
		.attr("class", "axis axis-y") 
		.call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
		.append("text") 
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(yAxisText)
		.attr("fill", "black");
	
		
		//TODO check for the case of two indicators so we can add to legend
		// the indicator name and no the country_code
		g.selectAll(".bar.country1") 
		.data(data1) 
		.enter().append("rect") 
		.attr("class", "bar country1") 
		.attr("x", d => x0(d.year) + bandwidthFlag * (x0.bandwidth() / countOfBars)) 
		.attr("y", d => y(d[Object.keys(queryResults[1])[2]])) 
		.attr("data-legend", function(d) {return d.country_code})
		.attr("width", x0.bandwidth() / countOfBars)	
		.attr("fill", "yellowGreen") 
		.attr("height", d => height - y(d[Object.keys(queryResults[1])[2]])); 
		
		var country1color = document.createElement("P");
		country1color.style.float = "center";
		country1color.innerText = " " + getIndicName(data1[0].country_code) + " " + getIndicName(Object.keys(queryResults[1])[2]);
		var ydot = document.createElement("P");
		ydot.innerText = "\u220E";
		ydot.style.float = "left";
		ydot.style.color = "yellowGreen";
		document.getElementById("legend").appendChild(ydot);
		document.getElementById("legend").appendChild(country1color);
		
		
		if(data.length > 60){ //added for one counrty case!!!!!!!!!
		g.selectAll(".bar.country2") 
		.data(data2) 
		.enter().append("rect") 
		.attr("class", "bar country2") 
		.attr("x", d => x0(d.year)) 
		.attr("y", d => y(d[Object.keys(queryResults[1])[2]])) 
		.attr("data-legend", function(d) {return d.country_code})
		.attr("width", x0.bandwidth() / countOfBars)
		.attr("fill", "steelblue") 
		.attr("height", d => height - y(d[Object.keys(queryResults[1])[2]]));
		
		var country2color = document.createElement("P");
		country2color.style.float = "center";
		country2color.innerText = " " + getIndicName(data2[0].country_code) + " " + getIndicName(Object.keys(queryResults[1])[2]);
		var bdot = document.createElement("P");
		bdot.innerText = "\u220E";
		bdot.style.float = "left";
		bdot.style.color = "steelblue";
		document.getElementById("legend").appendChild(bdot);
		document.getElementById("legend").appendChild(country2color);
		}
		if(data.length > 120){ //added for one counrty case!!!!!!!!!
			g.selectAll(".bar.country3") 
			.data(data3) 
			.enter().append("rect") 
			.attr("class", "bar country3") 
			.attr("x", d => x0(d.year) + (bandwidthFlag + 1) * (x0.bandwidth() / countOfBars)) 
			.attr("y", d => y(d[Object.keys(queryResults[1])[2]])) 
			.attr("width", x0.bandwidth() / countOfBars)
			.attr("fill", "red") 
			.attr("height", d => height - y(d[Object.keys(queryResults[1])[2]]));
		
		var country3color = document.createElement("P");
		country3color.style.float = "center";
		country3color.innerText = " " + getIndicName(data3[0].country_code) + " " + getIndicName(Object.keys(queryResults[1])[2]);
		var mdot = document.createElement("P");
		mdot.innerText = "\u220E";
		mdot.style.float = "left";
		mdot.style.color = "red";
		document.getElementById("legend").appendChild(mdot);
		document.getElementById("legend").appendChild(country3color);
		}
		
		if(Object.keys(queryResults[1]).length > 3){ //added for one counrty case!!!!!!!!!
		g.selectAll(".bar.indicator2") 
		.data(data1) 
		.enter().append("rect") 
		.attr("class", "bar indicator2") 
		.attr("x", d => x0(d.year)) 
		.attr("y", d => y(d[Object.keys(queryResults[1])[3]])) //for second indicator!!! 
		.attr("width", x0.bandwidth() / countOfBars)
		.attr("fill", "steelblue") 
		.attr("height", d => height - y(d[Object.keys(queryResults[1])[3]]));
		
		var indicator2Color = document.createElement("P");
		indicator2Color.style.float = "center";
		indicator2Color.innerText = " " + getIndicName(data1[0].country_code) + " " + getIndicName(Object.keys(queryResults[1])[3]);
		var bdot = document.createElement("P");
		bdot.innerText = "\u220E";
		bdot.style.float = "left";
		bdot.style.color = "steelblue";
		document.getElementById("legend").appendChild(bdot);
		document.getElementById("legend").appendChild(indicator2Color);
		}

		if(Object.keys(queryResults[1]).length > 4){ //added for one counrty case!!!!!!!!!
			g.selectAll(".bar.indicator3") 
			.data(data1) 
			.enter().append("rect") 
			.attr("class", "bar indicator3") 
			.attr("x", d => x0(d.year) + (bandwidthFlag + 1) * (x0.bandwidth() / countOfBars)) 
			.attr("y", d => y(d[Object.keys(queryResults[1])[4]])) //for third indicator!!! 
			.attr("width", x0.bandwidth() / countOfBars)
			.attr("fill", "black") 
			.attr("height", d => height - y(d[Object.keys(queryResults[1])[4]]));
			
			var indicator3Color = document.createElement("P");
			indicator3Color.style.float = "center";
			indicator3Color.innerText = " " + getIndicName(data1[0].country_code) + " " + getIndicName(Object.keys(queryResults[1])[4]);
			var bDot = document.createElement("P");
			bDot.innerText = "\u220E";
			bDot.style.float = "left";
			bDot.style.color = "black";
			document.getElementById("legend").appendChild(bDot);
			document.getElementById("legend").appendChild(indicator3Color);
			}
		});

		

	/*
		const lineSvg = d3.select("#svg2"),
		lineMargin = {top: 20, right: 20, bottom: 30, left: 100},
		lineWidth = +lineSvg.attr("width")  - lineMargin.left - lineMargin.right,
		lineHeight = +lineSvg.attr("height") - lineMargin.top  - lineMargin.bottom,
		x2 = d3.scaleBand().rangeRound([0, lineWidth]).padding(.2),
		x3 = d3.scaleBand(),
		y1 = d3.scaleLinear().rangeRound([lineHeight, 0]),
		g1 = lineSvg.append("g")	
					 .attr("transform", `translate(100, 700)`);
		g1.append("g1");
	//	.append("circle")
	//	.attr("cx", lineWidth)
	//	.attr("cy", lineWidth)
	//	.attr("r", 25)
	//	.style("fill", "purple");
		console.log(lineHeight);
	*/
}