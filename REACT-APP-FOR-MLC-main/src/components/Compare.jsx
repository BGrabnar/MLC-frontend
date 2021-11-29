import React from 'react';
import Plot from 'react-plotly.js';
import {CustomAutocomplete, CustomPaper, CustomCircularProgress, CustomCard, AntSwitch} from './themes.js';
import {TextField, Grid} from '@material-ui/core';
import {Box, FormControlLabel} from '@mui/material';

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

            violinValueList: [],
            violinPlotData: [],
            violinPlotLayout: [],

            heatmapValueList: [],
            heatmapPlotData: [],
            heatmapPlotLayout: [],

            evaluationMeasures: ['accuracy example-based', 'AUPRC', 'AUROC', 'average precision', 'coverage', 'F1-score example-based', 'hamming loss example-based', 'macro F1-score', 'macro precision', 'macro recall', 'micro F1-score', 'micro precision', 'micro recall', 'one error', 'precision example-based', 'ranking loss', 'recall example-based', 'subset accuracy', 'testing time', 'training time'],
            currentTheme: props.currentTheme,
            darkThemeColors: ['#082032', '#2C394B', '#7c848f', '#FB9300', '#fff', '#ff6666'],
            lightThemeColors: ['#343F56', '#F5E6CA', '#f9f0df','#FB9300' , '#000', '#ff0000'],

            boxLoadingData: "flex",
            violinLoadingData: "flex",
            heatmapLoadingData: "flex",
            showBoxPlot: "none",
            showViolinPlot: "none",
            showHeatmapPlot: "none",
        };
    }

	componentDidMount(){
		this.setUpQuery('accuracy example-based', true);
        this.setUpQuery('accuracy example-based', false);
        this.setUpHeatmapPlotData();
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
                this.setUpHeatmapPlotData()})
		}
	}

    // gets the names of the algorithms/methods
	setUpQuery=(selectedMeasure, boxPlot)=>{
		var query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                
        SELECT  ?Algorithm ?datasetLabel ?value
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
        Filter(?evaluationMeasureClassLabel in ("${selectedMeasure}"))
        }
        ORDER BY  ?Algorithm ?datasetLabel
		`

        this.GetData(query, boxPlot)
	}

    GetData = (query, boxPlot) =>
	{
		var algorithms = [];
        var datasets = [];
        var values = [];
        var subValues = [];
		// post request
		//var req = "http://semanticannotations.ijs.si:8890/sparql?default-graph-uri=http%3A%2F%2Flocalhost%3A8890%2FMLC&&Content-Type='application/json'&query="+encodeURIComponent(query) // change back
		var req = "http://localhost:8890/sparql?default-graph-uri=http%3A%2F%2Flocalhost%3A8890%2FMLC&&Content-Type='application/json'&query="+encodeURIComponent(query)
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

                        if (result[1].split('</literal>')[0] !== algorithms[algorithms.length-1])
                        {
                            algorithms.push(result[1].split('</literal>')[0]);
                            values.push(subValues);
                            subValues = [];
                        }

                        if (algorithms.length === 1)
                        {
                            datasets.push(result[2].split('</literal>')[0])
                        }

                        subValues.push(result[3].split('</literal>')[0])		
					}

                    values.shift();
                    values.push(subValues);

					this.setState({
						algorithmList: algorithms,
                        datasetList: datasets,
                        boxValueList: values,
                        violinValueList: values,
					})

                    if (boxPlot) {this.setUpBoxPlotData();}
                    else {this.setUpViolinPlotData();}
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
              z: [[1, 20, 30], [20, 1, 60], [30, 60, 1]],
              type: 'heatmap'
            }
          ];

        this.setState({
            heatmapPlotData: thisData,
           /*  heatmapPlotLayout: thisLayout, */
            heatmapLoadingData: "none",
        })

        this.render();
    }

    render()
    {
        return(
            <React.Fragment>
                <CustomCard sx={{m:2}}> {/* box plot */}
                    <CustomPaper sx={{m:1}}>
                        <FormControlLabel control={
                            <AntSwitch  sx = {{m: 1, ml: 2}}
                            onChange= {(value) => {
                                if (value.target.checked === true)
                                {
                                    this.setState({showBoxPlot: ''})
                                }
                                else{
                                    this.setState({showBoxPlot: 'none'})
                                }
                            }}
                        />} label="Box plot"/>
                    </CustomPaper>

                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CustomCard sx={{display: this.state.showBoxPlot, m:1}}>
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
                                    this.setUpQuery(value, true);
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
                                style={{color:'red'}}
                                data ={this.state.boxPlotData}
                                layout={this.state.boxPlotLayout}
                            />
                        </CustomCard>
                    </Grid>
                </CustomCard>

                <CustomCard sx={{m:2}}> {/* violin plot */}
                    <CustomPaper sx={{m:1}}>
                        <FormControlLabel control={
                            <AntSwitch  sx = {{m: 1, ml: 2}}
                            onChange= {(value) => {
                                if (value.target.checked === true)
                                {
                                    this.setState({showViolinPlot: ''})
                                }
                                else{
                                    this.setState({showViolinPlot: 'none'})
                                }
                            }}
                        />} label="Violin plot"/>
                    </CustomPaper>

                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CustomCard sx={{display: this.state.showViolinPlot, m:1}}>
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
                                    this.setUpQuery(value, false);
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
                                style={{color:'red'}}
                                data ={this.state.violinPlotData}
                                layout={this.state.violinPlotLayout}
                            />
                        </CustomCard>
                    </Grid>
                </CustomCard>
                                
                <CustomCard sx={{m:2}}> {/* heatmap */}
                    <CustomPaper sx={{m:1}}>
                        <FormControlLabel control={
                            <AntSwitch  sx = {{m: 1, ml: 2}}
                            onChange= {(value) => {
                                if (value.target.checked === true)
                                {
                                    this.setState({showHeatmapPlot: ''})
                                }
                                else{
                                    this.setState({showHeatmapPlot: 'none'})
                                }
                            }}
                        />} label="Ranking heatmap"/>
                    </CustomPaper>

                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CustomCard sx={{display: this.state.showHeatmapPlot, m:1}}>
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
                                    this.setUpQuery(value, false);
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
                                style={{color:'red'}}
                                data ={this.state.heatmapPlotData}
                                layout={this.state.heatmapPlotLayout}
                            />
                        </CustomCard>
                    </Grid>
                </CustomCard>

            </React.Fragment>
        )
    }
}

export default Compare; 