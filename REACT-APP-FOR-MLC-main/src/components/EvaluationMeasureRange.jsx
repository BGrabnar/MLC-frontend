import React from 'react';
import { Grid } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import {CustomAutocomplete, CustomPaper, CustomTextField} from './themes.js';
import { react } from 'plotly.js';

class EvaluationMeasureRange extends React.Component {
  constructor(props) {
    super(props);
    this.handleMeasure = this.handleMeasure.bind(this);
    this.handleRange = this.handleRange.bind(this);
    this.handleMeasureError= this.handleMeasureError.bind(this);
    this.handleRangeError= this.handleRangeError.bind(this);

    this.state = {
      selectedMeasure: props.measure,
      selectedRange: props.range,
      measureError: false,
			rangeError: false,
      disabledMeasures: props.disabledMeasures,
      evaluationMeasureList: props.evaluationMeasureList,
      
    };
  }
    
  componentDidMount()
  {
  this.setState({
    selectedMeasure: this.props.measure,
    selectedRange: this.props.range,
    disabledMeasures: this.props.disabledMeasures,
    evaluationMeasureList: this.props.evaluationMeasureList
  })}

  componentDidUpdate(prevProps){
    if(prevProps !== this.props){
      console.log("updated")
      this.setState({
        selectedMeasure: this.props.measure,
        selectedRange: this.props.range,
        disabledMeasures: this.props.disabledMeasures,
        evaluationMeasureList: this.props.evaluationMeasureList
      })
    }
  }
 

	handleMeasure(e, v) {
    this.setState({selectedMeasure: v})
    this.props.onHandleMeasureChange(v, this.props.id);
	}

  handleRange(e) {
    this.setState({
      selectedRange: e.target.value
    }, ()=>{this.handleRangeError()})
    this.props.onHandleRangeChange(e.target.value, this.props.id);
	}
	
  handleMeasureError() {
      this.setState({ measureError: !this.state.selectedMeasure })
  }

  handleRangeError() {
    const regex = new RegExp(/^(\d+(\.\d)?\d*(-\d+(\.\d)?\d*)?|[><]=?\d+(\.\d)?\d*)$/)
    if ( this.state.selectedRange === '' || regex.test(this.state.selectedRange))
      this.setState({ rangeError: false })
    else
      this.setState({ rangeError: true })
  }
 
  render() {
    return (
      <React.Fragment>
        <Grid container spacing = {1}>
          <Grid item>
            <CustomAutocomplete
              multiple = {false}
              limitTags={50}
              options={this.state.evaluationMeasureList}
              getOptionDisabled={(option) => !!this.state.disabledMeasures.find(element => element === option)}
              value={this.state.selectedMeasure}
              sx={{width: 300, m:1, mb:2.5}}
              PaperComponent={CustomPaper}
              //isOptionEqualToValue={(option, value) => option.value === value.value}
              onChange={(event, value) => this.handleMeasure(event, value)}
              renderInput={(params) => 
                <TextField {...params}
                  variant='outlined'
                  label = "Evaluation measure"
                  color='secondary'
                  onChange={this.handleMeasureError}
                  error={this.state.selectedMeasure==="" && this.state.selectedRange!=="" && !this.state.rangeError}
                />
              }
            />
          </Grid> 
          <Grid item>
            <CustomTextField
              label='Range'
              color='secondary'
              variant='outlined'
              style={{marginTop: 8, }}
              size="small"
              value={this.state.selectedRange}
              onChange={this.handleRange}
              error={this.state.rangeError}
              helperText={this.state.rangeError &&  "Please enter a valid range."}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
   }
 }

 export default EvaluationMeasureRange;
 