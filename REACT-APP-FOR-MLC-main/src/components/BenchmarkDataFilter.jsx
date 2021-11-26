import React from 'react';
import EvaluationMeasureRange from './EvaluationMeasureRange';
import PerformanceDataTable from './PerformanceDataTable.jsx';
import { Box } from '@mui/material';
import { Button, TextField,  Grid, Typography } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import {getList} from './utils.js'
import FormControlLabel from '@mui/material/FormControlLabel';
import {AntSwitch, CustomCard, CustomAddIcon, CustomAutocomplete, CustomPaper, CustomDeleteButton} from './themes.js';

class Body extends React.Component {

	constructor(props) {
    	super(props);
		this.parentHandleMeasure = this.parentHandleMeasure.bind(this);
		this.parentHandleRange = this.parentHandleRange.bind(this);
		this.handleAdd = this.handleAdd.bind(this)
		this.handleRemove = this.handleRemove.bind(this)

		this.state = {
			evaluationHTMLElements: [],
			selectedEvaluationMeasures: [
				{
					"measure": "",
					"range": "",
					"id": 0
				}
			],
			addButtonDisabled: false,
			disabledMeasures: [],
			showFilters: 'none',
			//reqURL: "http://semanticannotations.ijs.si:8890/sparql?default-graph-uri=http%3A%2F%2Flocalhost%3A8890%2FMLC&&Content-Type='application/json'&query=", //change back
			reqURL: "http://localhost:8890/sparql?default-graph-uri=http%3A%2F%2Flocalhost%3A8890%2FMLC&&Content-Type='application/json'&query=",
			datasetList: [], 
			algorithmList: [],
			evaluationMeasureList: ['accuracy example-based', 'AUPRC', 'AUROC', 'average precision', 'coverage', 'F1-score example-based', 'hamming loss example-based', 'macro F1-score', 'macro precision', 'macro recall', 'micro F1-score', 'micro precision', 'micro recall', 'one error', 'precision example-based', 'ranking loss', 'recall example-based', 'subset accuracy', 'testing time', 'training time'],
			evaluationMeasureListTrainTest: ['accuracy example-based', 'AUPRC', 'AUROC', 'average precision', 'coverage', 'F1-score example-based', 'hamming loss example-based', 'macro F1-score', 'macro precision', 'macro recall', 'micro F1-score', 'micro precision', 'micro recall', 'one error', 'precision example-based', 'ranking loss', 'recall example-based', 'subset accuracy', 'testing time', 'training time'],
			evaluationMeasureListFolds: ['accuracy example-based', 'AUPRC', 'AUROC', 'average precision', 'coverage', 'F1-score example-based', 'hamming loss example-based', 'macro F1-score', 'macro precision', 'macro recall', 'micro F1-score', 'micro precision', 'micro recall', 'one error', 'precision example-based', 'ranking loss', 'recall example-based', 'subset accuracy'],
			
			foldsAutocompleteDisplayMode: "none",
			spreadSheetColumns: [],
			spreadSheetRows: [],
			validationFolds: false,
			selectedDatasets: [],
			selectedAlgorithms: [],
			selectedFold: [],
			filterString: ""
    	}
  	}

	componentDidMount(){
		this.setEvaluationHTMLElements()
		this.getDatasets()
		this.getAlgorithms()
	}

	componentDidUpdate(prevProps){
		if (prevProps !== this.props)
		{
			this.setEvaluationHTMLElements()
		}
	}

	// gets the names of the datasets
	getDatasets=()=>{
		var query = `
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
			
			select ?dataset_label
			where {
			?dataset rdf:type <http://www.ontodm.com/OntoDM-core/OntoDM_000144> .
			?dataset rdfs:label ?dataset_labela_arff .
			FILTER (!regex(?dataset_label, "predicted") && !regex(?dataset_label, "fold") && !regex(?dataset_label, "train") && !regex(?dataset_label, "test")) .
			BIND(REPLACE(?dataset_labela_arff , ".arff", "", "i") AS ?dataset_label) .
			}
		`

		getList(this.state.reqURL, query).then((value) => {this.setState({datasetList: value})});
	}


	// gets the names of the algorithms/methods
	getAlgorithms=()=>{
		var query = `
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

			select distinct ?algorithm_name
			where {
			?dataset rdf:type <http://www.ontodm.com/OntoDM-core/OntoDM_000175> .
			?dataset <http://www.ontodm.com/OntoDM-core/ontoexp_0074> ?algorithm_name.
			}
		`

		getList(this.state.reqURL, query).then((value) => {this.setState({algorithmList: value})});
	}

	parentHandleMeasure(val, id) {
		let newSelectedEvals = []
		this.state.selectedEvaluationMeasures.forEach(el => {
			if(el.id === id){
				el.measure = val
			}
			newSelectedEvals.push(el)
		})
		
		this.setState({
			selectedEvaluationMeasures: newSelectedEvals 
		})
		this.setDisabledMeasures()
		this.addButtonDisabled()	
	}

	parentHandleRange(val, id) {
		let newSelectedEvals = []
		this.state.selectedEvaluationMeasures.forEach(el => {
			if(el.id === id){
				el.range = val
			}
			newSelectedEvals.push(el)
		})
		this.setState({
			selectedEvaluationMeasures: newSelectedEvals 
		})
		this.setDisabledMeasures()
		this.addButtonDisabled()
	}
	

	setEvaluationHTMLElements(){
		console.log("set HTML")
		console.log(this.state.selectedEvaluationMeasures)
		const evals=[]
		for(let i = 0; i<this.state.selectedEvaluationMeasures.length; i++){
			evals.push(
				<React.Fragment>
					<Grid container spacing = {2}>
						<Grid item>
							<EvaluationMeasureRange
								onHandleMeasureChange={this.parentHandleMeasure}
								id = {this.state.selectedEvaluationMeasures[i].id}
								range = {this.state.selectedEvaluationMeasures[i].range}
								measure = {this.state.selectedEvaluationMeasures[i].measure}
								onHandleRangeChange={this.parentHandleRange}
								disabledMeasures={this.state.disabledMeasures}
								evaluationMeasureList ={this.state.evaluationMeasureList}
							/>
						</Grid>
						<Box sx={{mt:2, ml:0.1, px: 0.5}}>
							<CustomDeleteButton
								variant='contained'
								color='secondary'
								onClick={() => this.handleRemove(this.state.selectedEvaluationMeasures[i].id)}
								disabled={this.state.selectedEvaluationMeasures.length === 1}
								style={{maxHeight: '50px', minHeight: '50px'}}
								fullWidth
							>
								<DeleteIcon/>
							</CustomDeleteButton>
						</Box>
					</Grid>
				</React.Fragment>
			)
		}
		this.setState({
			evaluationHTMLElements: evals
		})
		console.log(evals)
		this.setDisabledMeasures()
	}

	setDisabledMeasures(){
		const newDisabledMeasures = []
		for(let i = 0; i<this.state.selectedEvaluationMeasures.length; i++){
			newDisabledMeasures.push(this.state.selectedEvaluationMeasures[i].measure)
		}
		this.setState({disabledMeasures: newDisabledMeasures})
	}

	addButtonDisabled(){
		const regex = new RegExp(/^(\d+(\.\d)?\d*(-\d+(\.\d)?\d*)?|[><]=?\d+(\.\d)?\d*)$/)
		for(let i = 0; i<this.state.selectedEvaluationMeasures.length; i++){
			if (((this.state.selectedEvaluationMeasures[i].measure === null || this.state.selectedEvaluationMeasures[i].measure === '') && this.state.selectedEvaluationMeasures[i].range.length > 0)  ||
			//if(this.state.selectedEvaluationMeasures[i].measure===null ||
				//this.state.selectedEvaluationMeasures[i].measure==='' ||
				//this.state.selectedEvaluationMeasures.length>10 ||
				//this.state.selectedEvaluationMeasures[i].range==='' ||
				(!regex.test(this.state.selectedEvaluationMeasures[i].range) &&  this.state.selectedEvaluationMeasures[i].range.length !== 0))
			{
				this.setState({addButtonDisabled: true})
			}
			else{
				
				this.setState({addButtonDisabled: false})
			}
		}
	}
	handleAdd() {
		let newSelectedEvals = this.state.selectedEvaluationMeasures
			newSelectedEvals.push({
				"measure": "",
				"range": "",
				"id": this.state.selectedEvaluationMeasures[this.state.selectedEvaluationMeasures.length-1].id+1
			})

		this.setState({
			selectedEvaluationMeasures: newSelectedEvals,
			addButtonDisabled: true
		}, 
		()=>{
			console.log("handle add")
			console.log(this.state.selectedEvaluationMeasures)
			this.setEvaluationHTMLElements()
			this.addButtonDisabled()
			this.setDisabledMeasures()
		})
		
	}

	handleRemove(x) {
		console.log("handle remove "+x)
		let newSelectedEvals = []
		for(let i = 0; i<this.state.selectedEvaluationMeasures.length; i++){
			if(this.state.selectedEvaluationMeasures[i].id!==x)
				newSelectedEvals.push(this.state.selectedEvaluationMeasures[i])
		}
		this.setState({
			selectedEvaluationMeasures: newSelectedEvals
		}, 
		()=>{
			console.log("handle remove")
			console.log(this.state.selectedEvaluationMeasures)
			this.setEvaluationHTMLElements()
			this.addButtonDisabled()
			this.setDisabledMeasures()
		})
	}

	render() {
    	return (
			<React.Fragment>
				<div>
					<FormControlLabel control={
						<AntSwitch  sx = {{m: 1, ml: 2}}
						onChange= {(value) => {
							if (value.target.checked === true)
							{
								this.setState({showFilters: ''})
							}
							else{
								this.setState({showFilters: 'none'})
							}
						}}
					/>} label="Filters"/>
    			</div>

				<Grid
					container
					spacing={0}
					direction="column"
					alignItems="center"
					justifyContent="center"
				>

					<CustomCard sx={{display: this.state.showFilters, m: 2 }}>
						<Grid container spacing = {0}>
							<CustomAutocomplete // Dataset input field
								multiple = {true}							
								limitTags={50}
								options={this.state.datasetList}
								sx={{width: 300, m: 1}}
								PaperComponent={CustomPaper}
								renderInput={(params) => 
									<TextField {...params} variant='outlined' label = {"Datasets"} color='secondary' />
								}
								onChange={(event, value) => {
									this.setState({selectedDatasets : value});
									}
								}
							/>
							
							<CustomAutocomplete // split input field
								defaultValue = "train / test"
								onChange={(event, value) => {
									if (value === "folds")
									{
										this.setState({
											foldsAutocompleteDisplayMode : "",
											validationFolds: true,
											evaluationMeasureList: this.state.evaluationMeasureListFolds
										},()=> {this.setEvaluationHTMLElements()});
									}
									else
									{
										this.setState({
											foldsAutocompleteDisplayMode : "none",
											validationFolds: false,
											evaluationMeasureList: this.state.evaluationMeasureListTrainTest
										},()=> {this.setEvaluationHTMLElements()});
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
						</Grid>

						<CustomAutocomplete // methods input field
							multiple = {true}
							limitTags={3}
							options={this.state.algorithmList}
							sx={{width: 300, m: 1}}
							PaperComponent={CustomPaper}
							renderInput={(params) => 
								<TextField {...params} variant='outlined' label = "Methods" color='secondary'/>
							}
							onChange={(event, value) => {
								this.setState({selectedAlgorithms : value});
								}
							}
						/>

						<CustomAutocomplete // folds input field
							multiple = {true}
							limitTags={50}
							options={["1", "2", "3"]}
							PaperComponent={CustomPaper}
							sx={{width: 300, display : this.state.foldsAutocompleteDisplayMode, m: 1, mt:2}}
							renderInput={(params) => 
								<TextField {...params} variant='outlined' label = "Fold" color='secondary'/>
							}	
							onChange={(event, value) =>{
								this.setState({selectedFold: value});
							}}
						/>
						{this.state.evaluationHTMLElements}	

						<Box sx={{ml:1}}
						style ={{width: 615}}> 
							<Button variant='contained'
							color='secondary'
							onClick={this.handleAdd}
							disabled={false} // before: this.state.addButtonDisabled
							fullWidth
							>
								<CustomAddIcon style={{maxHeight: '15px', minHeight: '15px'}}/>
							</Button>
						</Box>

						<Box sx={{m:1, mt:3}}>
							<Button // filter / sumbmit button
							color='secondary'
							variant='contained'
							onClick={() => this.callPerformanceDataTableMethod()}
							disabled={this.state.addButtonDisabled} 
							>
								<Typography variant='button'>
									Submit
								</Typography>
							</Button>
						</Box>

					</CustomCard>
				</Grid>

				<PerformanceDataTable
					setFilter={click => this.callPerformanceDataTableMethod = click}
					selectedDatasets = {this.state.selectedDatasets}
					selectedAlgorithms = {this.state.selectedAlgorithms}
					selectedFold = {this.state.selectedFold}
					evaluationMeasureList = {this.state.evaluationMeasureList}
					validationFolds = {this.state.validationFolds}
					selectedEvaluationMeasures = {this.state.selectedEvaluationMeasures}
				/>
		</React.Fragment>
		);
  	}
}

export default Body;