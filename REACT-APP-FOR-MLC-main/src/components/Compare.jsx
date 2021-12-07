import React from 'react';
import Plot from 'react-plotly.js';
import {CustomAutocomplete, CustomPaper, CustomCircularProgress, CustomCard, CustomAccordion} from './themes.js';
import {TextField, Grid} from '@material-ui/core';
import {Box, FormControlLabel} from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

            violinValueList: [],
            violinPlotData: [],
            violinPlotLayout: [],
            violinLoadingData: "flex",

            heatmapValueList: [],
            heatmapPlotData: [],
            heatmapPlotLayout: [],
            heatmapRanks: {},
            heatmapLoadingData: "flex",
            radarDataset: "ABPM",
            radarMeasure: ['accuracy example-based'],

            radarValueList: [],
            radarChartData: [],
            radarChartLayout: [],
            radarLoadingData: "flex",

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
	setUpQuery=(selectedMeasure, typeOfPlot)=>{
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
        }


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

        this.getData(query, typeOfPlot)
	}

    getData = (query, typeOfPlot) =>
	{
		var algorithms = [];
        var datasets = [];
        var values = [];
        var subValues = [];

        if (typeOfPlot === 'heatmap') // create a map of zeros
        {
            var maping = {}; // for heatmap
            var ranks = {};
            for (let i = 0; i < this.state.algorithmList.length; i++)
            {
                ranks[this.state.algorithmList[i]] = new Array(28).fill(0);
            }
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
                            })
                            this.setUpBoxPlotData();
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

        const thisLayout =  { title: 'Boxplot',
        autosize: true,
        width: 1000,
        height: 600,
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
        showlegend: false
        }

        this.setState({
            boxPlotData: thisData,
            boxPlotLayout: thisLayout,
            boxLoadingData: "none",
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
            title: "Violin plot",
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
            showlegend: false
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
            title: "Heatmap",
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

        const thisLayout =  { title: 'Radar chart',
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
                                    this.setState({boxLoadingData: "flex"});
                                    this.setUpQuery(value, 'box');
                                    }
                                }/> 

                                <div style={{
                                    display: this.state.boxLoadingData,
                                    justifyContent: 'center',
                                    }}>
                                        <Box sx={{ display: 'flex', mt: 1, mb: 2}}>
                                            <CustomCircularProgress/>
                                        </Box>
                                </div>

                            <Plot
                                data ={this.state.boxPlotData}
                                layout={this.state.boxPlotLayout}
                            />
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
                                    this.setState({violinLoadingData: "flex"});
                                    this.setUpQuery(value, 'violin');
                                    }
                                }/> 

                                <div style={{
                                    display: this.state.violinLoadingData,
                                    justifyContent: 'center',
                                    }}>
                                        <Box sx={{ display: 'flex', mt: 1, mb: 2}}>
                                            <CustomCircularProgress/>
                                        </Box>
                                </div>

                            <Plot
                                data ={this.state.violinPlotData}
                                layout={this.state.violinPlotLayout}
                            />
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
                                    this.setState({heatmapLoadingData: "flex"});
                                    this.setUpQuery(value, 'heatmap');
                                    }
                                }/> 

                                <div style={{
                                    display: this.state.heatmapLoadingData,
                                    justifyContent: 'center',
                                    }}>
                                        <Box sx={{ display: 'flex', mt: 1, mb: 2}}>
                                            <CustomCircularProgress/>
                                        </Box>
                                </div>

                            <Plot
                                data ={this.state.heatmapPlotData}
                                layout={this.state.heatmapPlotLayout}
                            />
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
                                    this.setState({radarLoadingData: "flex", radarDataset: value}, () => {this.setUpQuery(this.state.radarMeasure, 'radar');});
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
                                    this.setState({radarLoadingData: "flex", radarMeasure: value});
                                    this.setUpQuery(value, 'radar');
                                    }
                                }/> 


                                <div style={{
                                    display: this.state.radarLoadingData,
                                    justifyContent: 'center',
                                    }}>
                                        <Box sx={{ display: 'flex', mt: 1, mb: 2}}>
                                            <CustomCircularProgress/>
                                        </Box>
                                </div>

                            <Plot
                                data ={this.state.radarChartData}
                                layout={this.state.radarChartLayout}
                            />
          </AccordionDetails>
        </CustomAccordion>
                </CustomCard>

            </React.Fragment>
        )
    }
}

export default Compare; 