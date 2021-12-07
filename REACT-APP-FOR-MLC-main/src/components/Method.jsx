import React from 'react';
import PerformanceDataTable from './PerformanceDataTable.jsx';
import {CustomAutocomplete, CustomPaper} from './themes.js';
import { TextField } from '@material-ui/core';


class Method extends React.Component 
{
    constructor(props) {
    	super(props);

		this.state = {
			algorithm: window.location.pathname.split('/')[2] === undefined ? [] : [window.location.pathname.split('/')[2]],
			reqURL: "http://semanticannotations.ijs.si:8890/sparql?default-graph-uri=http%3A%2F%2Flocalhost%3A8890%2FMLC&&Content-Type='application/json'&query=",
			evaluationMeasureList: ['accuracy example-based', 'AUPRC', 'AUROC', 'average precision', 'coverage', 'F1-score example-based', 'hamming loss example-based', 'macro F1-score', 'macro precision', 'macro recall', 'micro F1-score', 'micro precision', 'micro recall', 'one error', 'precision example-based', 'ranking loss', 'recall example-based', 'subset accuracy', 'testing time', 'training time'],
			evaluationMeasureListTrainTest: ['accuracy example-based', 'AUPRC', 'AUROC', 'average precision', 'coverage', 'F1-score example-based', 'hamming loss example-based', 'macro F1-score', 'macro precision', 'macro recall', 'micro F1-score', 'micro precision', 'micro recall', 'one error', 'precision example-based', 'ranking loss', 'recall example-based', 'subset accuracy', 'testing time', 'training time'],
			evaluationMeasureListFolds: ['accuracy example-based', 'AUPRC', 'AUROC', 'average precision', 'coverage', 'F1-score example-based', 'hamming loss example-based', 'macro F1-score', 'macro precision', 'macro recall', 'micro F1-score', 'micro precision', 'micro recall', 'one error', 'precision example-based', 'ranking loss', 'recall example-based', 'subset accuracy'],
			validationFolds: false,
    	}
  	}

    render()
    {
        return(
            <React.Fragment>
                <CustomAutocomplete // validation input field
								defaultValue = "train / test"
								onChange={(event, value) => {
									if (value === "folds")
									{
										this.setState({
											validationFolds: true,
											evaluationMeasureList: this.state.evaluationMeasureListFolds
										},()=> {this.callPerformanceDataTableMethod()});
									}
									else
									{
										this.setState({
											validationFolds: false,
											evaluationMeasureList: this.state.evaluationMeasureListTrainTest
										},()=> {this.callPerformanceDataTableMethod()});
									}
								}}
								multiple = {false}								
								limitTags={2}
								options={["folds", "train / test"]}
								sx={{width: 300, m: 2}}
								PaperComponent={CustomPaper}
								renderInput={(params) => 
								<TextField {...params} variant='outlined' label = "Validation" color='secondary' />
								}
							/>

                <PerformanceDataTable
					setFilter={click => this.callPerformanceDataTableMethod = click}
					selectedDatasets = {[]}
					selectedAlgorithms = {this.state.algorithm}
					selectedFold = {[]}
					evaluationMeasureList = {this.state.evaluationMeasureList}
					validationFolds = {this.state.validationFolds}
					selectedEvaluationMeasures = {[]}
                    hideDatasetColumn = {false}
					hideAlgorithmColumn = {true}
				/>

            </React.Fragment>
        )
    }
}

export default Method; 