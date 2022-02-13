function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(i => i.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  // 3. Create a variable that holds the samples array. 
  var samplesArray = data.samples;

  // 4. Create a variable that filters the samples for the object with the desired sample number.
  var resultsArray = samplesArray.filter(i => i.id == sample);

  //  5. Create a variable that holds the first sample in the array.
  var results = resultsArray[0];
  
  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var ids = results.otu_ids;
  var labels = results.otu_labels.slice(0, 10).reverse();
  var values = results.sample_values.slice(0, 10).reverse();

  var bubbleLabels = results.otu_labels;
  var bubbleValues = results.sample_values;

  // 7. Create the yticks for the bar chart.
  // Hint: Get the the top 10 otu_ids and map them in descending order  
  //  so the otu_ids with the most bacteria are last. 

  var yticks = ids.map(i => "OTU" + i).slice(0, 10).reverse();

  // 8. Create the trace for the bar chart. 
  var barData = [{
    x: values,
    y: yticks,
    type: "bar",
    orientation: "h",
    text: labels
  }];

  // 9. Create the layout for the bar chart. 
  var barLayout = {
    title: "Top 10 Bateria Cultures Found"
    };

  // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

  // Bubble Chart
  // 1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: ids,
    y: bubbleValues,
    text: bubbleLabels,
    mode: 'markers',
    marker: {
      size: bubbleValues,
      color: ids,
      colorscale: 'Earth'
    }
  }];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

  // Gauge Chart
  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
  var metadata = data.metadata;
  var metaArray  = metadata.filter(i => i.id == sample);
  // console.log(metadata)
  // console.log(metaArray)

  // 2. Create a variable that holds the first sample in the metadata array.
  var metaResults = metaArray[0]
  // console.log(metaResults)
  // console.log(metaResults.wfreq)

  // 3. Create a variable that holds the washing frequency.
   var washfreq = parseFloat(metaResults.wfreq)
   console.log(washfreq)

  // 4. Create the trace for the gauge chart.
  var gaugeData = [{
    value: washfreq,
    title: "Navel Wash Frequency",
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: {range: [0, 10]},
      bar: {color: "black"},
      steps: [
        {range: [0, 2], color: "red"},
        {range: [2, 4], color: "orange"},
        {range: [4, 6], color: "yellow"},
        {range: [6, 8], color: "lightgreen"},
        {range: [8, 10], color: "green"},
      ],
      // threshold: {
      //   line: {color: "red", width: 4},
      //   thickness:0.75, 
      //   value: 10}
    }
  }];
    
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    font: {color: "black"}
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}

