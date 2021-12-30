import React from 'react';
import Plot from 'react-plotly.js';
import {CustomAutocomplete, CustomPaper, CustomCircularProgress, CustomCard, CustomAccordion} from './themes.js';
import {TextField, Grid} from '@material-ui/core';
import {Box} from '@mui/material';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ConstructionOutlined } from '@mui/icons-material';

const http = require('http')

class Compare extends React.Component 
{
    constructor(props) {
        super(props);

        this.state = {
            algorithmList : [],
            datasetList: [],

            boxValueList: [],
            boxPlotData: [],
            boxPlotLayout: [],
            boxLoadingData: "flex",
            boxEvaluationMeasure: "accuracy example-based",
            boxValidationFold: false,

            violinValueList: [],
            violinPlotData: [],
            violinPlotLayout: [],
            violinLoadingData: "flex",
            violinEvaluationMeasure: "accuracy example-based",
            violinValidationFold: false,

            heatmapValueList: [],
            heatmapPlotData: [],
            heatmapPlotLayout: [],
            heatmapRanks: {},
            heatmapLoadingData: "flex",
            heatmapEvaluationMeasure: "accuracy example-based",
            heatmapValidationFold: false,

            radarDataset: "ABPM",
            radarMeasure: ['accuracy example-based'],
            radarValidationFold: false,

            mountPlots: true,

            radarValueList: [],
            radarChartData: [],
            radarChartLayout: [],
            radarLoadingData: "flex",

            rankingValueList: [],
            rankingPlotData: [],
            rankingPlotLayout: [],
            rankingLoadingData: "flex",
            rankingMeasure: 'accuracy example-based',
            rankingValidationFold: false,

            reqURL: "http://semanticannotations.ijs.si:8890/sparql?default-graph-uri=http%3A%2F%2Flocalhost%3A8890%2FMLC&&Content-Type='application/json'&query=",
            evaluationMeasures: ['accuracy example-based', 'AUPRC', 'AUROC', 'average precision', 'coverage', 'F1-score example-based', 'hamming loss example-based', 'macro F1-score', 'macro precision', 'macro recall', 'micro F1-score', 'micro precision', 'micro recall', 'one error', 'precision example-based', 'ranking loss', 'recall example-based', 'subset accuracy', 'testing time', 'training time'],
            currentTheme: props.currentTheme,
            darkThemeColors: ['#082032', '#2C394B', '#7c848f', '#FB9300', '#fff', '#ff6666'],
            lightThemeColors: ['#343F56', '#F5E6CA', '#f9f0df','#FB9300' , '#000', '#ff0000'],
        };
    }

	componentDidMount(){
		this.setUpQuery('accuracy example-based', 'box');
        this.setUpQuery('accuracy example-based', 'violin');
        this.setUpQuery(['accuracy example-based'], 'radar');
	}

    componentDidUpdate(prevProps){
		if (prevProps !== this.props)
		{
			this.setState({
                currentTheme: this.props.currentTheme,
                boxLoadingData: "flex",
                violinLoadingData: "flex",
            }, ()=>{this.setUpBoxPlotData();
                this.setUpViolinPlotData();
                this.setUpHeatmapPlotData();
                this.setUpRadarChartData();
            })
		}
	}

    // gets the names of the algorithms/methods
	setUpQuery=(selectedMeasure, typeOfPlot, foldValidation)=>{
        var orderString = "";
        var filterString = ""; // for radar
        var newMeasures = ``;

        if (typeOfPlot === "heatmap")
        {
            orderString = "ucase(?datasetLabel) ?Algorithm"
            newMeasures = `"${selectedMeasure}"`
        }
        else if (typeOfPlot === "radar")
        {
            orderString = '?Algorithm ucase(?datasetLabel)'
            filterString = `Filter(?datasetLabel in ("${this.state.radarDataset}"))`
            newMeasures = `"${selectedMeasure[0]}"`;
            for (let i = 1; i < selectedMeasure.length; i++)
            { 
                newMeasures += `, "${selectedMeasure[i]}"`
            }
        }
        else 
        {
            orderString = '?Algorithm ucase(?datasetLabel)'
            newMeasures = `"${selectedMeasure}"`

            if (typeOfPlot === "rankingPt2")
            {
                orderString = 'ucase(?datasetLabel) ?Algorithm'
            }
        }

        if (!foldValidation)
        {
            var query = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                    
            SELECT  ?Algorithm ?datasetLabel ?value ?evaluationMeasureClassLabel 
            WHERE {
            ?trainTestDatasetAssignment <http://purl.obolibrary.org/obo/OBI_0000293> ?dataset.
            ?trainTestDatasetAssignment ?precedes ?predictiveModelTrainTestEvaluationWorkflowExecution .
            ?predictiveModelTrainTestEvaluationWorkflowExecution <http://purl.obolibrary.org/obo/BFO_0000051> ?predictiveModelTestSetEvaluationCalculation.
            ?dataset rdfs:label ?datasetLabelArff .
            ?predictiveModelTrainTestEvaluationWorkflowExecution <http://purl.obolibrary.org/obo/BFO_0000051> ?predictiveModelingAlgorithmExecution.
            ?predictiveModelingAlgorithmExecution <http://www.ontodm.com/OntoDM-core/ontoexp_0074> ?Algorithm .
            ?predictiveModelTestSetEvaluationCalculation rdf:type <http://www.ontodm.com/OntoDM-core/ontoexp_0064>.
            ?predictiveModelTestSetEvaluationCalculation <http://purl.obolibrary.org/obo/BFO_0000051> ?evaluationMeasuresCalculation.
            ?evaluationMeasuresCalculation ?realizes ?predictiveModelingEvaluationCalculationImplementation.
            ?predictiveModelingEvaluationCalculationImplementation ?isConcretizationOf ?evaluationMeasure.
            ?evaluationMeasure <http://www.ontodm.com/OntoDT#OntoDT_0000240>  ?value.
            ?evaluationMeasure rdfs:label ?evaluationMeasure_label.
            ?evaluationMeasure rdf:type ?evaluationMeasureClass .
            ?evaluationMeasureClass rdfs:label ?evaluationMeasureClassLabel .

            MINUS {
                ?oneFoldTestTwoFoldTrainDatasetAssigment ?precedes2 ?predictiveModelTrainTestEvaluationWorkflowExecution. 
                ?oneFoldTestTwoFoldTrainDatasetAssigment rdf:type <http://www.ontodm.com/OntoDM-core/ontoexp_0068>.
                }

            BIND(REPLACE(?datasetLabelArff , ".arff", "")  AS ?datasetLabel ).
            Filter(?evaluationMeasureClassLabel in (${newMeasures}))
            ${filterString}
            }
            ORDER BY ${orderString}
            `
        }
        else
        {
            var query = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
					
			SELECT ?Algorithm ?datasetLabel ?value ?NFoldEvaluationMeasureLabel 
			WHERE {

			?trainTestDatasetAssignment <http://purl.obolibrary.org/obo/OBI_0000293> ?dataset.
			?trainTestDatasetAssignment ?precedes ?predictiveModelTrainTestEvaluationWorkflowExecution .
			?predictiveModelTrainTestEvaluationWorkflowExecution <http://purl.obolibrary.org/obo/BFO_0000051> ?predictiveModelTestSetEvaluationCalculation.
			?dataset rdfs:label ?datasetLabelArff .
			?predictiveModelTrainTestEvaluationWorkflowExecution <http://purl.obolibrary.org/obo/BFO_0000051> ?predictiveModelingAlgorithmExecution.
			?predictiveModelingAlgorithmExecution <http://www.ontodm.com/OntoDM-core/ontoexp_0074> ?Algorithm .
			?predictiveModelTestSetEvaluationCalculation rdf:type <http://www.ontodm.com/OntoDM-core/ontoexp_0064>.
			?predictiveModelTestSetEvaluationCalculation <http://purl.obolibrary.org/obo/BFO_0000051> ?evaluationMeasuresCalculation.
			?evaluationMeasuresCalculation ?realizes ?predictiveModelingEvaluationCalculationImplementation.
			?predictiveModelingEvaluationCalculationImplementation ?isConcretizationOf ?evaluationMeasure.
			?evaluationMeasure <http://www.ontodm.com/OntoDM-core/ontoexp#has_input> ?NFoldEvaluationMeasure.

			?evaluationMeasure rdfs:label ?evaluationMeasure_label.
            ?evaluationMeasure rdf:type ?evaluationMeasureClass .

			?evaluationMeasure rdfs:label ?evaluationMeasure_label.
			?evaluationMeasure rdf:type ?evaluationMeasureClass .
			?evaluationMeasureClass rdfs:label ?evaluationMeasureClassLabel .
			BIND(REPLACE(?datasetLabelArff , ".arff", "")  AS ?datasetLabel ).


            ?NFoldEvaluationMeasure rdf:type <http://www.ontodm.com/OntoDM-core/ontoexp#N_fold_evaluation_measure>.
            ?NFoldEvaluationMeasure rdfs:label ?NFoldEvaluationMeasureLabel.
            ?NFoldEvaluationMeasure <http://www.ontodm.com/OntoDT#OntoDT_0000240> ?value.
            Filter(?evaluationMeasureClassLabel in (${newMeasures}))
            ${filterString}

		    } GROUP BY ?NFoldEvaluationMeasureLabel
            ORDER BY ${orderString}`
        }
        this.getData(query, typeOfPlot)
	}

    getData = (query, typeOfPlot) =>
	{
		var algorithms = [];
        var datasets = [];
        var values = [];
        var subValues = [];

        if (typeOfPlot === 'heatmap' || typeOfPlot === 'ranking' || typeOfPlot === 'rankingPt2') // create a map of zeros
        {
            var maping = {};
            var ranks = {};
            for (let i = 0; i < this.state.algorithmList.length; i++)
            {
                if (typeOfPlot !== 'rankingPt2')
                {
                    if (typeOfPlot === 'heatmap' && this.state.heatmapValidationFold)
                    {
                        ranks[this.state.algorithmList[i]] = new Array(159).fill(0);
                    }
                    else
                        ranks[this.state.algorithmList[i]] = new Array(28).fill(0);
                }
                else
                    ranks[this.state.algorithmList[i]] = new Array(40).fill(0);
            }

            var mean = 0;
            var median = []
        }

		// post request
        var req = this.state.reqURL+encodeURIComponent(query)
		http.get(req, (resp) => {
			let data = '';
			
			// A chunk of data has been received.
			resp.on('data', (chunk) => {
				data += chunk;
			});
			
			// The whole response has been received. Print out the result.
			resp
			.on('end', () => {
				// extract the dataset names from html
					for (let i = 1; i < data.split('<result>').length; i++)
					{
                        var result = data.split('<result>')[i].split('<literal>');

                        if (typeOfPlot === 'heatmap') // handle heatmap data
                        {   
                            if (result[2].split('</literal>')[0] !== datasets[datasets.length-1])
                            {
                                datasets.push(result[2].split('</literal>')[0]);
                                if (["hamming loss example-based", "ranking loss", "one error", "training time", "testing time"].includes(result[4].split('</literal>')[0])) 
                                {subValues = subValues.sort()} // lowest value is best
                                else{subValues = subValues.sort(function(a, b){return b-a});} // highest value is best

                                for (let j = 0; j < this.state.algorithmList.length; j++)
                                {
                                    var index = subValues.indexOf(maping[this.state.algorithmList[j]]);
                                    ranks[this.state.algorithmList[j]][index] += 1;
                                }
                                
                                subValues = [];
                            }

                            maping[result[1].split('</literal>')[0]] = result[3].split('</literal>')[0]
                            subValues.push(result[3].split('</literal>')[0])
                        }
                        else if (typeOfPlot === 'ranking')
                        {
                            if (result[1].split('</literal>')[0] !== algorithms[algorithms.length-1])
                            {
                                // mean then rank
                                for (let j = 0; j < subValues.length; j++)
                                {
                                    mean += parseFloat(subValues[j]);
                                }
                                
                                mean /= subValues.length;
                                values.push(mean);
                                mean = 0;

                                // median then rank
                                if (["hamming loss example-based", "ranking loss", "one error", "training time", "testing time"].includes(result[4].split('</literal>')[0])) 
                                {subValues = subValues.sort()}
                                else{subValues = subValues.sort(function(a, b){return b-a});}
                                var half = Math.floor(subValues.length / 2);
                                if (values.length % 2 === 0)
                                    {median.push(parseFloat(subValues[half]));}
                                else {median.push((parseFloat(subValues[half - 1]) + parseFloat(subValues[half])) / 2.0);}

                                console.log(subValues.length)
                                subValues = [];

                                algorithms.push(result[1].split('</literal>')[0]);
                            }

                            subValues.push(result[3].split('</literal>')[0])
                        }
                        else if (typeOfPlot === 'rankingPt2') // for rank then mean / median
                        {
                            if (result[2].split('</literal>')[0] !== datasets[datasets.length-1])
                            {
                                datasets.push(result[2].split('</literal>')[0]);
                                if (["hamming loss example-based", "ranking loss", "one error", "training time", "testing time"].includes(result[4].split('</literal>')[0])) 
                                {subValues = subValues.sort()} // lowest value is best
                                else{subValues = subValues.sort(function(a, b){return b-a});} // highest value is best

                                for (let j = 0; j < this.state.algorithmList.length; j++)
                                {
                                    var index = subValues.indexOf(maping[this.state.algorithmList[j]]);
                                    ranks[this.state.algorithmList[j]][datasets.length-1] = index + 1;
                                }
                                
                                subValues = [];
                            }

                            maping[result[1].split('</literal>')[0]] = result[3].split('</literal>')[0]
                            subValues.push(result[3].split('</literal>')[0])
                        }
                        else // handle the other plots
                        {
                            if (result[1].split('</literal>')[0] !== algorithms[algorithms.length-1])
                            {
                                algorithms.push(result[1].split('</literal>')[0]);
                                values.push(subValues);
                                subValues = [];
                            }

                            subValues.push(result[3].split('</literal>')[0])	
                            
                            if (algorithms.length === 1)
                            {
                                datasets.push(result[2].split('</literal>')[0])
                            }
                        }
					}

                    switch (typeOfPlot)
                    {   case 'box':
                            values.shift();
                            values.push(subValues);
                            this.setState({
                                algorithmList: algorithms,
                                boxValueList: values,
                                datasetList: datasets
                            }, () => {this.setUpBoxPlotData()});
                            break;

                        case 'violin':
                            values.shift();
                            values.push(subValues);
                            this.setState({
                                algorithmList: algorithms,
                                violinValueList: values,
                            })
                            this.setUpViolinPlotData();
                            break;

                        case 'heatmap':
                            if (["hamming loss example-based", "ranking loss", "one error", "training time", "testing time"].includes(result[4].split('</literal>')[0])) 
                                {subValues = subValues.sort()} // lowest value is best
                            else {subValues = subValues.sort(function(a, b){return b-a});} // highest value is best

                            for (let j = 0; j < this.state.algorithmList.length; j++)
                                {
                                    
                                    var index = subValues.indexOf(maping[this.state.algorithmList[j]]);
                                    ranks[this.state.algorithmList[j]][index] += 1;        
                                }
                        
                            this.setState({
                                heatmapRanks: ranks
                            },()=> {this.setUpHeatmapPlotData()});
                            return

                        case 'radar':
                            values.shift();
                            values.push(subValues);
                            this.setState({
                                algorithmList: algorithms,
                                radarValueList: values,
                            })
                            this.setUpRadarChartData();
                            break;
                        
                        case 'ranking':
                            //mean then rank
                            for (let j = 0; j < subValues.length; j++)
                            {
                                mean += parseFloat(subValues[j]);
                            }
                            mean /= subValues.length;
                            values.push(mean);
                            values.shift();

                            // median then rank
                            if (["hamming loss example-based", "ranking loss", "one error", "training time", "testing time"].includes(result[4].split('</literal>')[0])) 
                            {subValues = subValues.sort()}
                            else{subValues = subValues.sort(function(a, b){return b-a});}
                            var half = Math.floor(subValues.length / 2);
                            if (subValues.length % 2 === 0)
                                {median.push(parseFloat(subValues[half]));}
                            else {median.push((parseFloat(subValues[half - 1]) + parseFloat(subValues[half])) / 2.0);}

                            median.shift();
                            var medianMaping = [];
                            for (let i = 0; i < this.state.algorithmList.length; i++)
                            {
                                maping[this.state.algorithmList[i]] = values[i];
                                medianMaping[this.state.algorithmList[i]] = median[i];
                            }

                            var allValues = new Array(28).fill(0);
                            if (["hamming loss example-based", "ranking loss", "one error", "training time", "testing time"].includes(result[4].split('</literal>')[0])) 
                            {values = values.sort();
                                median = median.sort()}
                            else{values = values.sort(function(a, b){return b-a});
                                median = median.sort(function(a, b){return b-a});}


                            for (let j = 0; j < this.state.algorithmList.length; j++)
                            {
                                var index = values.indexOf(maping[this.state.algorithmList[j]]);
                                allValues[j] = [index + 1];
                                index = median.indexOf(medianMaping[this.state.algorithmList[j]]);
                                allValues[j].push(index + 1) 
                            }

                            this.setState({
                                rankingValueList: allValues,
                            })
                            this.setUpQuery(this.state.rankingMeasure, "rankingPt2")
                            break;

                        case "rankingPt2":
                            datasets.push(result[2].split('</literal>')[0]);
                            if (["hamming loss example-based", "ranking loss", "one error", "training time", "testing time"].includes(result[4].split('</literal>')[0])) 
                                {subValues = subValues.sort()} // lowest value is best
                            else{subValues = subValues.sort(function(a, b){return b-a});} // highest value is best

                            var allValues = this.state.rankingValueList;
                                for (let j = 0; j < this.state.algorithmList.length; j++)
                                {
                                    var index = subValues.indexOf(maping[this.state.algorithmList[j]]);
                                    ranks[this.state.algorithmList[j]][datasets.length-1] = index + 1;
                                    ranks[this.state.algorithmList[j]].shift();


                                    // median
                                    var half = Math.floor(ranks[this.state.algorithmList[j]].length / 2);
                                    if (ranks[this.state.algorithmList[j]].length % 2 === 0)
                                        {median.push(parseFloat(ranks[this.state.algorithmList[j]][half]));}
                                    else {median.push((parseFloat(ranks[this.state.algorithmList[j]][half - 1]) + parseFloat(ranks[this.state.algorithmList[j]][half])) / 2.0);}

                                    allValues[j].push(median[j])

                                    // mean
                                    mean = 0;
                                    for (let k = 0; k < ranks[this.state.algorithmList[j]].length; k++)
                                    {
                                        mean += ranks[this.state.algorithmList[j]][k];
                                    }
                                    mean /= ranks[this.state.algorithmList[j]].length;
                                    mean = Math.ceil(mean) 
                                    allValues[j].push(mean)
                                }

                            this.setState({rankingValueList: allValues})
                            this.setUpRankingPlotData();
                            break;
                    }
				});
			})
			.on("error", (err) => {
				console.log(err)
			});
    }

    setUpBoxPlotData=()=>{
        var thisData = [];
        for ( var i = 0; i < this.state.algorithmList.length; i ++ ) {
            
            var result = {
                type: 'box',
                y: this.state.boxValueList[i],
                name: this.state.algorithmList[i],
                boxpoints: 'all',
                jitter: 0.5,
                whiskerwidth: 0.2,
                fillcolor: 'cls',
                text: this.state.datasetList,

                marker: {
                    size: 2
                },
                line: {
                    width: 1
                }
            };
            thisData.push(result);
        };

        const thisLayout =  {
        autosize: true,
        width: 1000,
        height: 600,
        pad: "center",
        margin: {
            l: 40,
            r: 30,
            b: 80,
            t: 100
        },
        paper_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[2] : this.state.lightThemeColors[2],
        plot_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[1] : this.state.lightThemeColors[1],
        font: {
            color: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[4] : this.state.lightThemeColors[4],
        },
        }

        if (this.state.mountPlots === true)
            {this.setUpQuery('accuracy example-based', 'heatmap');
            this.setUpQuery('accuracy example-based', 'ranking');}

        this.setState({
            boxPlotData: thisData,
            boxPlotLayout: thisLayout,
            boxLoadingData: "none",
            mountPlots: false,
        })

        this.render();
    }

    setUpViolinPlotData=()=>{
        var thisData = [];
        for ( var i = 0; i < this.state.algorithmList.length; i ++ ) {
            var result = {
                type: 'violin',
                y: this.state.violinValueList[i],
                name: this.state.algorithmList[i],
                boxpoints: 'all',
                jitter: 0.5,
                whiskerwidth: 0.2,
                fillcolor: 'cls',

                marker: {
                    size: 2
                },
                line: {
                    width: 1
                }
            };
            thisData.push(result);
        };

        const thisLayout = {
            width: 1000,
            height: 600,
            yaxis: {
              zeroline: false
            },
            paper_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[2] : this.state.lightThemeColors[2],
            plot_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[1] : this.state.lightThemeColors[1],
            font: {
                color: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[4] : this.state.lightThemeColors[4],
            },
          };

        this.setState({
            violinPlotData: thisData,
            violinPlotLayout: thisLayout,
            violinLoadingData: "none",
        })

        this.render();
    }

    setUpHeatmapPlotData=()=>{
        var thisData = [
            {
              z: Object.values(this.state.heatmapRanks),
              x: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
              y: this.state.algorithmList,
              type: 'heatmap'
            }
          ];

        const thisLayout = {
            width: 1000,
            height: 600,

            paper_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[2] : this.state.lightThemeColors[2],
            plot_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[1] : this.state.lightThemeColors[1],
            font: {
                color: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[4] : this.state.lightThemeColors[4],
            },
          };
        
        this.setState({
            heatmapPlotData: thisData,
            heatmapPlotLayout: thisLayout,
            heatmapLoadingData: "none",
        })

        this.render();
    }

    setUpRadarChartData=()=>
    {
        var edit =[];
        var thisData = [];
        for (let j = 0; j < this.state.radarMeasure.length; j++)
        {
            for (let i = 0; i < this.state.radarValueList.length; i++)
            {
                edit.push(this.state.radarValueList[i][j])
            }

            var singleData = {
                type: 'scatterpolar',
                r: edit,
                theta: this.state.algorithmList,
                fill: 'toself',
                name: this.state.radarMeasure[j],

                marker: {
                    size: 2
                },
                line: {
                    width: 1
                }
            };
            edit = [];
            thisData.push(singleData);
        }

        const thisLayout =  {
        autosize: true,
        width: 1000,
        height: 600,
        margin: {
            l: 40,
            r: 30,
            b: 80,
            t: 100
        },
        polar: {
            bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[2] : this.state.lightThemeColors[2],
        },
        paper_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[1] : this.state.lightThemeColors[1],
        plot_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[1] : this.state.lightThemeColors[1],
        font: {
            color:this.state.currentTheme === 'dark' ? this.state.darkThemeColors[4] : this.state.lightThemeColors[4],
            scale: 'red'
        }}

          this.setState({
            radarChartData: thisData,
            radarChartLayout: thisLayout,
            radarLoadingData: "none",
        })
    }

    setUpRankingPlotData=()=>{
        var thisData = [];
        for ( var i = 0; i < this.state.algorithmList.length; i ++ ) {
            //console.log(this.state.rankingValueList[i])
            var result = {
                mode: 'lines+markers',
                type: 'scatter',
                x: ["meanThenRank", "medianThenRank", "rankThenMedian", "rankThenMean"],
                y: this.state.rankingValueList[i],
                name: this.state.algorithmList[i],
            };
            thisData.push(result);
        };

        const thisLayout =  {
        autosize: true,
        width: 1000,
        height: 600,

        paper_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[2] : this.state.lightThemeColors[2],
        plot_bgcolor: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[1] : this.state.lightThemeColors[1],
        font: {
            color: this.state.currentTheme === 'dark' ? this.state.darkThemeColors[4] : this.state.lightThemeColors[4],
            },
        }

        this.setState({
            rankingPlotData: thisData,
            rankingPlotLayout: thisLayout,
            rankingLoadingData: "none",
        })

        this.render();
    }

    render()
    {
        return(
            <React.Fragment>
                <CustomCard sx={{m:2}}> {/* box plot */}
                    <CustomAccordion TransitionProps={{ unmountOnExit: true }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Box plot</Typography>
                        </AccordionSummary>
                    <AccordionDetails>

                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >

                            <CustomAutocomplete
                                defaultValue = {this.state.evaluationMeasures[0]}
                                multiple = {false}							
                                limitTags={50}
                                options={this.state.evaluationMeasures}
                                sx={{width: 300, m: 2}}
                                PaperComponent={CustomPaper}
                                renderInput={(params) => 
                                    <TextField {...params} variant='outlined' label = {"Evaluation measure"} color='secondary' />
                                }
                                onChange={(event, value) => {
                                    this.setState({boxEvaluationMeasure: value, boxLoadingData: "flex"});
                                    this.setUpQuery(this.state.boxEvaluationMeasure, 'box', this.state.boxValidationFold);
                                    }
                                }/>

                                <CustomAutocomplete // split input field
                                    defaultValue = "train / test"
                                    onChange={(event, value) => {
                                        if (value === "folds")
                                        {
                                            this.setState({boxValidationFold: true, boxLoadingData: "flex"}, () =>
                                            {this.setUpQuery(this.state.boxEvaluationMeasure, 'box', this.state.boxValidationFold);});
                                        }
                                        else
                                        {
                                            this.setState({boxValidationFold: false, boxLoadingData: "flex"}, () =>
                                            {this.setUpQuery(this.state.boxEvaluationMeasure, 'box', this.state.boxValidationFold);});
                                        }
                                    }}
                                    multiple = {false}								
                                    limitTags={2}
                                    options={["folds", "train / test"]}
                                    sx={{width: 300, m: 1}}
                                    PaperComponent={CustomPaper}
                                    renderInput={(params) => 
                                    <TextField {...params} variant='outlined' label = "Validation" color='secondary' />
                                    }
                                />

                                <div style={{display: this.state.boxLoadingData}}>
                                    <Box sx={{ display: 'flex', mt: 2, mb: 2}}>
                                        <CustomCircularProgress/>
                                    </Box>
                                </div>

                                <Plot
                                    data ={this.state.boxPlotData}
                                    layout={this.state.boxPlotLayout}
                                />
                            </Grid>
                        </AccordionDetails>
                    </CustomAccordion>
                </CustomCard>

                <CustomCard sx={{m:2}}> {/* violin plot */}
                    <CustomAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Violin plot</Typography>
                        </AccordionSummary>
                    <AccordionDetails>
                       
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >

                        <CustomAutocomplete
                            defaultValue = {this.state.evaluationMeasures[0]}
                            multiple = {false}							
                            limitTags={50}
                            options={this.state.evaluationMeasures}
                            sx={{width: 300, m: 2}}
                            PaperComponent={CustomPaper}
                            renderInput={(params) => 
                                <TextField {...params} variant='outlined' label = {"Evaluation measure"} color='secondary' />
                            }
                            onChange={(event, value) => {
                                this.setState({violinEvaluationMeasure: value, violinLoadingData: "flex"});
                                    this.setUpQuery(this.state.violinEvaluationMeasure, 'violin', this.state.violinValidationFold);
                                }
                            }/> 

                            <CustomAutocomplete // split input field
                                defaultValue = "train / test"
                                onChange={(event, value) => {
                                    if (value === "folds")
                                    {
                                        this.setState({violinValidationFold: true, violinLoadingData: "flex"}, () =>
                                        {this.setUpQuery(this.state.violinEvaluationMeasure, 'violin', this.state.violinValidationFold);});
                                    }
                                    else
                                    {
                                        this.setState({violinValidationFold: false, violinLoadingData: "flex"}, () =>
                                        {this.setUpQuery(this.state.violinEvaluationMeasure, 'violin', this.state.violinValidationFold);});
                                    }
                                }}
                                multiple = {false}								
                                limitTags={2}
                                options={["folds", "train / test"]}
                                sx={{width: 300, m: 1}}
                                PaperComponent={CustomPaper}
                                renderInput={(params) => 
                                <TextField {...params} variant='outlined' label = "Validation" color='secondary' />
                                }
                            />

                            <div style={{
                                display: this.state.violinLoadingData}}>
                                <Box sx={{ display: 'flex', mt: 2, mb: 2}}>
                                    <CustomCircularProgress/>
                                </Box>
                            </div>

                            <Plot
                                data ={this.state.violinPlotData}
                                layout={this.state.violinPlotLayout}
                            />
                            </Grid>
                        </AccordionDetails>
                    </CustomAccordion>
                </CustomCard>
                                
                <CustomCard sx={{m:2}}> {/* heatmap */}
                <CustomAccordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Heatmap</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >

                        <CustomAutocomplete
                            defaultValue = {this.state.evaluationMeasures[0]}
                            multiple = {false}							
                            limitTags={50}
                            options={this.state.evaluationMeasures}
                            sx={{width: 300, m: 2}}
                            PaperComponent={CustomPaper}
                            renderInput={(params) => 
                            <TextField {...params} variant='outlined' label = {"Evaluation measure"} color='secondary' />
                            }
                            onChange={(event, value) => {
                                this.setState({heatmapEvaluationMeasure: value, heatmapLoadingData: "flex"});
                                this.setUpQuery(this.state.heatmapEvaluationMeasure, 'heatmap', this.state.heatmapValidationFold);
                                }
                            }/>

                            <CustomAutocomplete // split input field
                                defaultValue = "train / test"
                                onChange={(event, value) => {
                                    if (value === "folds")
                                    {
                                        this.setState({heatmapValidationFold: true, heatmapLoadingData: "flex"}, () =>
                                        {this.setUpQuery(this.state.heatmapEvaluationMeasure, 'heatmap', this.state.heatmapValidationFold);});
                                    }
                                    else
                                    {
                                        this.setState({heatmapValidationFold: false, heatmapLoadingData: "flex"}, () =>
                                        {this.setUpQuery(this.state.heatmapEvaluationMeasure, 'heatmap', this.state.heatmapValidationFold);});
                                    }
                                }}
                                multiple = {false}								
                                limitTags={2}
                                options={["folds", "train / test"]}
                                sx={{width: 300, m: 1}}
                                PaperComponent={CustomPaper}
                                renderInput={(params) => 
                                <TextField {...params} variant='outlined' label = "Validation" color='secondary' />
                                }
                            />

                            <div style={{
                                display: this.state.heatmapLoadingData}}>
                                    <Box sx={{ display: 'flex', mt: 2, mb: 2}}>
                                        <CustomCircularProgress/>
                                    </Box>
                            </div>

                            <Plot
                                data ={this.state.heatmapPlotData}
                                layout={this.state.heatmapPlotLayout}
                            />
                            </Grid>
                        </AccordionDetails>
                    </CustomAccordion>
                </CustomCard>

                <CustomCard sx={{m:2}}> {/* radar chart */}
                <CustomAccordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Radar chart</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{
                            display: this.state.radarLoadingData,
                            justifyContent: 'center',
                        }}>
                            <Box sx={{ display: 'flex', mt: 1, mb: 2}}>
                                <CustomCircularProgress/>
                            </Box>
                        </div>

                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >

                            <CustomAutocomplete
                                defaultValue = {"ABPM"}
                                multiple = {false}							
                                limitTags={50}
                                options={this.state.datasetList}
                                sx={{width: 300, m: 2}}
                                PaperComponent={CustomPaper}
                                renderInput={(params) => 
                                    <TextField {...params} variant='outlined' label = {"Dataset"} color='secondary' />
                                }
                                onChange={(event, value) => {
                                    this.setState({radarLoadingData: "flex", radarDataset: value}, () => {this.setUpQuery(this.state.radarMeasure, 'radar', this.state.radarValidationFold);});
                                    }
                                }/> 

                            <CustomAutocomplete
                                defaultValue = {['accuracy example-based']}
                                multiple = {true}							
                                limitTags={50}
                                options={this.state.evaluationMeasures}
                                sx={{width: 300, m: 2}}
                                PaperComponent={CustomPaper}
                                renderInput={(params) => 
                                    <TextField {...params} variant='outlined' label = {"Evaluation measure"} color='secondary' />
                                }
                                onChange={(event, value) => {
                                    this.setState({radarLoadingData: "flex", radarMeasure: value},()=>{
                                    this.setUpQuery(this.state.radarMeasure, 'radar', this.state.radarValidationFold);});
                                    }
                                }/>

                                <CustomAutocomplete // split input field
                                    defaultValue = "train / test"
                                    onChange={(event, value) => {
                                        if (value === "folds")
                                        {
                                            this.setState({radarValidationFold: true, radarLoadingData: "flex"}, () =>
                                            {this.setUpQuery(this.state.radarMeasure, 'radar', this.state.radarValidationFold);});
                                        }
                                        else
                                        {
                                            this.setState({radarValidationFold: false, radarLoadingData: "flex"}, () =>
                                            {this.setUpQuery(this.state.radarMeasure, 'radar', this.state.radarValidationFold);});
                                        }
                                    }}
                                    multiple = {false}								
                                    limitTags={2}
                                    options={["folds", "train / test"]}
                                    sx={{width: 300, m: 2,}}
                                    PaperComponent={CustomPaper}
                                    renderInput={(params) => 
                                    <TextField {...params} variant='outlined' label = "Validation" color='secondary' />
                                    }
                                />          

                            <Plot
                                data ={this.state.radarChartData}
                                layout={this.state.radarChartLayout}
                            />
                            </Grid>
          </AccordionDetails>
        </CustomAccordion>
        </CustomCard>

        <CustomCard sx={{m:2}}> {/* ranking plot */}
                <CustomAccordion TransitionProps={{ unmountOnExit: true }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Ranking methods</Typography>
                        </AccordionSummary>
                    <AccordionDetails>

                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >

                            <CustomAutocomplete
                                defaultValue = {this.state.evaluationMeasures[0]}
                                multiple = {false}							
                                limitTags={50}
                                options={this.state.evaluationMeasures}
                                sx={{width: 300, m: 2}}
                                PaperComponent={CustomPaper}
                                renderInput={(params) => 
                                    <TextField {...params} variant='outlined' label = {"Evaluation measure"} color='secondary' />
                                }
                                onChange={(event, value) => {
                                    this.setState({rankingLoadingData: "flex", rankingMeasure: value});
                                    this.setUpQuery(this.state.rankingMeasure, 'ranking', this.state.rankingValidationFold);
                                    }
                                }/> 

                                <CustomAutocomplete // split input field
                                    defaultValue = "train / test"
                                    onChange={(event, value) => {
                                        if (value === "folds")
                                        {
                                            this.setState({rankingValidationFold: true, rankingLoadingData: "flex"}, () =>
                                            {this.setUpQuery(this.state.rankingMeasure, 'ranking', this.state.rankingValidationFold);});
                                        }
                                        else
                                        {
                                            this.setState({rankingValidationFold: false, rankingLoadingData: "flex"}, () =>
                                            {this.setUpQuery(this.state.rankingMeasure, 'ranking', this.state.rankingValidationFold);});
                                        }
                                    }}
                                    multiple = {false}								
                                    limitTags={2}
                                    options={["folds", "train / test"]}
                                    sx={{width: 300, m: 2,}}
                                    PaperComponent={CustomPaper}
                                    renderInput={(params) => 
                                    <TextField {...params} variant='outlined' label = "Validation" color='secondary' />
                                    }
                                />              

                                <div style={{display: this.state.rankingLoadingData}}>
                                    <Box sx={{ display: 'flex', mt: 1, mb: 2}}>
                                        <CustomCircularProgress/>
                                    </Box>
                                </div>

                                <Plot
                                    data ={this.state.rankingPlotData}
                                    layout={this.state.rankingPlotLayout}
                                />
                            </Grid>
                        </AccordionDetails>
                    </CustomAccordion>
                </CustomCard>

                <CustomPaper sx={{m:10}}></CustomPaper>
            </React.Fragment>
        )
    }
}

export default Compare; 