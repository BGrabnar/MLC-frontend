import React from 'react';
import {AntSwitch, CustomCircularProgress, CustomDataGrid, CustomTooltip, CustomAddIcon, CustomLink, CustomGridToolbarExport, CustomPaper} from './themes.js';
import {Box, FormControlLabel} from '@mui/material';
import {GridToolbarContainer} from '@material-ui/data-grid';


const http = require('http')

class PerformanceDataTable extends React.Component
{
    constructor(props) {
        super(props);
        this.filterData = this.filterData.bind(this);

        this.state = {
            spreadSheetRows: [],
            spreadSheetColumns: [],

            selectedDatasets: props.selectedDatasets,
            selectedAlgorithms: props.selectedAlgorithms,
			selectedFold: props.selectedFold,
            selectedEvaluationMeasures: props.selectedEvaluationMeasures,
            evaluationMeasureList: props.evaluationMeasureList,
            validationFolds: props.validationFolds,
			loadingData: "flex",
			aggregatedValues: false,
			showAggreagateSwitch: "none",
			aggregatedChecked: false,
			
			hideDatasetColumn: props.hideDatasetColumn,
			hideAlgorithmColumn: props.hideAlgorithmColumn,
        };
    }

	componentDidMount()
	{
		this.props.setFilter(this.filterData)
		this.getDataFromQuery()
	}
	
	filterData()
	{
        this.setState({
            selectedDatasets: this.props.selectedDatasets,
            selectedAlgorithms: this.props.selectedAlgorithms,
			selectedFold: this.props.selectedFold,
            validationFolds: this.props.validationFolds,
			selectedEvaluationMeasures: this.props.selectedEvaluationMeasures,
			evaluationMeasureList: this.props.evaluationMeasureList,
			loadingData: "flex"
    	},() => {
			if (this.state.validationFolds){this.setState({showAggreagateSwitch: "flex"})}
			else {this.setState({showAggreagateSwitch: "none"})}
			this.getDataFromQuery()});
        
	}

    getColumnsAndRows = (query) =>
	{
		// rows
		var list = [];

		var selectedMeasures = {};
		for (let i = 0; i < this.state.selectedEvaluationMeasures.length; i++)
		{
			selectedMeasures[this.state.selectedEvaluationMeasures[i]['measure']] = this.state.selectedEvaluationMeasures[i]['range'];

		}

		// post request
		var req = "http://semanticannotations.ijs.si:8890/sparql?default-graph-uri=http%3A%2F%2Flocalhost%3A8890%2FMLC&&Content-Type='application/json'&query="+encodeURIComponent(query)
		//var req = "http://localhost:8890/sparql?default-graph-uri=http%3A%2F%2Flocalhost%3A8890%2FMLC&&Content-Type='application/json'&query="+encodeURIComponent(query)
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
						// fill row with data
						var subList = {
							id: i,
							dataset: result[1].split('</literal>')[0],
							algorithm: result[2].split('</literal>')[0],
							model: result[4].split('</literal>')[0].replaceAll("&quot",'"').replaceAll(";",""),
						};

						for (let j = 0; j < this.state.evaluationMeasureList.length; j++)
						{
							// handle range
							// range is handled here instead of in the query, because the values are in the same row
							if (Object.keys(selectedMeasures).includes(this.state.evaluationMeasureList[j]))
							{
								if (selectedMeasures[this.state.evaluationMeasureList[j]].match(/^>=[0-9.]+$/))
								{
									if (parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) >= parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].substr(2)))
									{
										subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
									}
								}
								else if (selectedMeasures[this.state.evaluationMeasureList[j]].match(/^>[0-9.]+$/))
								{
									if (parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) > parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].substr(1)))
									{
										subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
									}
								}
								else if (selectedMeasures[this.state.evaluationMeasureList[j]].match(/^<=[0-9.]+$/))
								{
									if (parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) <= parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].substr(2)))
									{
										subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
									}
								}
								else if (selectedMeasures[this.state.evaluationMeasureList[j]].match(/^<[0-9.]+$/))
								{
									if (parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) < parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].substr(1)))
									{
										subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
									}
								}
								else if (selectedMeasures[this.state.evaluationMeasureList[j]].match(/^[0-9.]+$/))
								{
									if (parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) === parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]]))
									{
										subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
									}
								}
								else if (selectedMeasures[this.state.evaluationMeasureList[j]].match(/^[0-9.]+-[0-9.]+$/))
								{
									if (parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].split('-')[0]) <= parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].split('-')[1]) )
									{
										if (parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) >= parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].split('-')[0]) && parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) <= parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].split('-')[1]))
										{
											subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
										}
									}
									else
									{
										if (parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) >= parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].split('-')[1]) && parseFloat(result[3].split('</literal>')[0].split(";")[j].split(":")[1]) <= parseFloat(selectedMeasures[this.state.evaluationMeasureList[j]].split('-')[0]))
										{
											subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
										}
									}
								}
								else
								{
									subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
								}
							}
							else
							{
								subList[this.state.evaluationMeasureList[j]] = result[3].split('</literal>')[0].split(";")[j].split(":")[1]	
							}
						}

						if (this.state.validationFolds)
						{
							// tidy the parameter string
							var evaluationParameters = result[5].split('</literal>')[0]
							evaluationParameters = evaluationParameters.replace(result[1].split('</literal>')[0], "").replace(result[2].split('</literal>')[0], "").replace("_predictive_model_train_test_evaluation_workflow_execution", "").substr(1);
							evaluationParameters = evaluationParameters.substr(1, evaluationParameters.length - 3);
							
							var wordArray = evaluationParameters.split("_");
							var str = wordArray[0]
							for (let i = 1; i < wordArray.length; i++)
							{
								if (wordArray[i][0] >= '0' && wordArray[i][0] <= '9')
								{
								str += ": " + wordArray[i]
								}
								else
								{
									if (wordArray[i-1][0] >= '0' && wordArray[i-1][0] <= '9')
									{
										str += ", " + wordArray[i]
									}
									else
									{
										str += " " + wordArray[i]
									}
								} 
							}
							subList['parameters'] = str;

							// fold
							if (!this.state.aggregatedValues)
							{
								var fold = result[6].split('</literal>')[0];
								subList['fold'] = fold.substr(fold.length-11, 1);
							}
							else 
							{
								subList['fold'] = "1, 2, 3";
							}
						}
						
						list.push(subList);
					}
					this.setState({
						spreadSheetRows: list,
						spreadSheetColumns: columns,
						loadingData: "none",
					})
				});
			})
			.on("error", (err) => {
				console.log(err)
			});

		// columns
		var columns = [
			{ field: 'id', headerName: '', width: 20, },
			{ field: 'dataset', headerName: 'Dataset', width: 200, hide: this.state.hideDatasetColumn, renderCell: (data) => (<CustomLink to={`/Dataset/${data.value}`}>{data.value}</CustomLink>)},
			{ field: 'algorithm', headerName: 'Method', width: 200, hide: this.state.hideAlgorithmColumn,  renderCell: (data) => (<CustomLink to={`/Method/${data.value}`}>{data.value}</CustomLink>)},
			{ field: 'model', headerName: 'Model', width: 100, renderCell: (params) =>  (<CustomTooltip title={params.row.model}><span>{<CustomAddIcon/>}</span></CustomTooltip>),}

		];

		if (this.state.validationFolds) // add extra columns if its the folds validation
		{
			var subColumn = {field: 'parameters', headerName: 'Tuned Parameters', width: 400,};
			columns.push(subColumn);
			subColumn = {field: 'fold', headerName: 'Fold', width: 150,};
			columns.push(subColumn);
		}

		for (let i = 0; i < this.state.evaluationMeasureList.length; i++)
		{
			subColumn = {
				field: this.state.evaluationMeasureList[i], width: 250,
			};
			columns.push(subColumn);
		}	
	}

	getDataFromQuery(){
		var filterString = ""
		for (let i = 0; i < this.state.selectedDatasets.length; i++) // for datasets
		{
			if (i === 0)
				filterString += 'Filter (?datasetLabel in ("'
			else
				filterString += '", "'
			filterString += this.state.selectedDatasets[i]
			
			if (i === this.state.selectedDatasets.length - 1)
				filterString += '")).'
		}

		for (let i = 0; i < this.state.selectedAlgorithms.length; i++) // for algorithms
		{
			if (i === 0)
				filterString += 'Filter (?Algorithm in ("'
			else
				filterString += '", "'
			filterString += this.state.selectedAlgorithms[i]
			
			if (i === this.state.selectedAlgorithms.length - 1)
				filterString += '")).'
		}

		for (let i = 0; i < this.state.selectedFold.length; i++) // for folds
		{
			if (i === 0)
				filterString += 'Filter (regex(?Fold, "['
			filterString += this.state.selectedFold[i]
			
			if (i === this.state.selectedFold.length - 1)
				filterString += ']")).'
		}

		
		if (!this.state.validationFolds)
		{
				var query = `
				PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
				PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
						
				SELECT ?datasetLabel ?Algorithm (group_concat( concat(?evaluationMeasureClassLabel , ":", ?value) ;separator=";") as ?EvaluationMeasures) ?model
				WHERE {
				select *
				where {
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

				?predictiveModelTrainTestEvaluationWorkflowExecution ?hasPart ?predictiveModelingAlgorithmExecution.
				?predictiveModelingAlgorithmExecution <http://purl.obolibrary.org/obo/OBI_0000299> ?predictiveModel.
				?predictiveModel <http://www.ontodm.com/OntoDM-core/ontoexp_0072> ?model.

				MINUS {
				?oneFoldTestTwoFoldTrainDatasetAssigment ?precedes2 ?predictiveModelTrainTestEvaluationWorkflowExecution. 
				?oneFoldTestTwoFoldTrainDatasetAssigment rdf:type <http://www.ontodm.com/OntoDM-core/ontoexp_0068>.
				}

				BIND(REPLACE(?datasetLabelArff , ".arff", "")  AS ?datasetLabel ).
				${filterString}
				} order by (lcase(?evaluationMeasureClassLabel)) 
				}
				GROUP BY ?datasetLabel ?Algorithm ?model
				ORDER BY ?datasetLabel ?Algorithm
				`
		}
		else
		{
			if (this.state.aggregatedValues)
		{
			query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>		
			SELECT ?datasetLabel ?Algorithm (group_concat( concat(?evaluationMeasureClassLabel , ":", ?value) ;separator=";") as ?EvaluationMeasures) ?model ?TunedParameters ?Fold
			WHERE {
			select *
			where {
			?foldTestFoldTrainDatasetAssignment <http://www.obofoundry.org/ro/ro.owl#precedes> ?predictiveModelTrainTestEvaluationWorkflowExecution .
					?foldTestFoldTrainDatasetAssignment rdf:type <http://www.ontodm.com/OntoDM-core/ontoexp_0068>.
					?foldTestFoldTrainDatasetAssignment ?hasSpecifiedOutput ?foldTest.
					?foldTest rdf:type <http://www.ontodm.com/OntoDM-core/OntoDM_000144>.
					?foldTest rdfs:label ?Fold.
			
			
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
			
						?NFoldEvaluationMeasure rdf:type <http://www.ontodm.com/OntoDM-core/ontoexp#N_fold_evaluation_measure>.
						?NFoldEvaluationMeasure rdfs:label ?NFoldEvaluationMeasureLabel.
						?NFoldEvaluationMeasure <http://www.ontodm.com/OntoDT#OntoDT_0000240> ?value.
			
			?evaluationMeasure rdfs:label ?evaluationMeasure_label.
			?evaluationMeasure rdf:type ?evaluationMeasureClass .
?predictiveModelTrainTestEvaluationWorkflowExecution rdfs:label ?TunedParameters.
			
			?predictiveModelingAlgorithmExecution <http://purl.obolibrary.org/obo/OBI_0000299> ?predictiveModel.
			?predictiveModel <http://www.ontodm.com/OntoDM-core/ontoexp_0072> ?model.
			
			?evaluationMeasure rdfs:label ?evaluationMeasure_label.
			?evaluationMeasure rdf:type ?evaluationMeasureClass .
			?evaluationMeasureClass rdfs:label ?evaluationMeasureClassLabel .
			BIND(REPLACE(?datasetLabelArff , ".arff", "")  AS ?datasetLabel ).
FILTER (regex(?Fold, "1_test")).
${filterString}
			} order by (lcase(?evaluationMeasureClassLabel))}
			GROUP BY ?datasetLabel ?Algorithm ?model ?TunedParameters ?Fold
			ORDER BY ?datasetLabel ?Algorithm`
		}
		else {
				query = `
				PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
				PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
						
				SELECT ?datasetLabel ?Algorithm (group_concat( concat(?evaluationMeasureClassLabel , ":", ?value) ;separator=";") as ?EvaluationMeasures) ?model ?TunedParameters ?Fold
				WHERE {
					select *
				where {
					?foldTestFoldTrainDatasetAssignment <http://www.obofoundry.org/ro/ro.owl#precedes> ?predictiveModelTrainTestEvaluationWorkflowExecution .
					?foldTestFoldTrainDatasetAssignment rdf:type <http://www.ontodm.com/OntoDM-core/ontoexp_0068>.
					?foldTestFoldTrainDatasetAssignment ?hasSpecifiedOutput ?foldTest.
					?foldTest rdf:type <http://www.ontodm.com/OntoDM-core/OntoDM_000144>.
					?foldTest rdfs:label ?Fold.


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
				?predictiveModelTrainTestEvaluationWorkflowExecution rdfs:label ?TunedParameters.

				?predictiveModelingAlgorithmExecution <http://purl.obolibrary.org/obo/OBI_0000299> ?predictiveModel.
				?predictiveModel <http://www.ontodm.com/OntoDM-core/ontoexp_0072> ?model.

				?evaluationMeasure rdfs:label ?evaluationMeasure_label.
				?evaluationMeasure rdf:type ?evaluationMeasureClass .
				?evaluationMeasureClass rdfs:label ?evaluationMeasureClassLabel .
				BIND(REPLACE(?datasetLabelArff , ".arff", "")  AS ?datasetLabel ).
				FILTER (regex(?Fold, "test")).
				${filterString}
				} order by (lcase(?evaluationMeasureClassLabel)) 
				}
				GROUP BY ?datasetLabel ?Algorithm ?model ?TunedParameters ?Fold 
				ORDER BY ?datasetLabel ?Algorithm ?Fold
				`
			}
		}
		console.log(query)
		this.getColumnsAndRows(query)
	}

    render()
    {
        return (
			<React.Fragment>
				<div style={{
				display: this.state.loadingData,
				justifyContent: 'center',
				}}>
					<Box sx={{ display: 'flex', mt: 1, mb: 2}}>
						<CustomCircularProgress/>
					</Box>
				</div>

            <div style={{ height: 1000, width: '99%', marginBottom: 15}}>
				<Box sx={{ml:1.5, mt:1.5}} style={{height: '100%'}}>
					<CustomDataGrid
						rows={this.state.spreadSheetRows}
						columns={this.state.spreadSheetColumns}
						
						
						disableColumnMenu={true}
						//onRowClick = {(data) => console.log(data['row'])} // log row data
						components={{
							Toolbar: () => {
								return (
								  <GridToolbarContainer>						
										<CustomGridToolbarExport color='secondary' variant='contained' style={{marginBottom:5}}/>
											<CustomTooltip title={"Explanation here!"}><span>{
												<FormControlLabel sx={{mb:0.5, display: this.state.showAggreagateSwitch}} control={
															<AntSwitch sx = {{ml:4, mr: 1}}
															checked = {this.state.aggregatedChecked}
															onChange = {(value) => {
																if (value.target.checked === true)
																{
																	this.setState({aggregatedValues: true, aggregatedChecked: true, loadingData: "flex"}, ()=> {this.getDataFromQuery()})
																}
																else{
																	this.setState({aggregatedValues: false, aggregatedChecked: false, loadingData: "flex"}, ()=> {this.getDataFromQuery()})
																}														
															}}
														/>} label="Aggregated values"/>
												}</span></CustomTooltip>
								  </GridToolbarContainer>
								);
							  },
						  }}
					/>
				</Box>
            </div>
			<CustomPaper sx={{m:10}}></CustomPaper>
			</React.Fragment>
        );
    }
}

export default PerformanceDataTable;