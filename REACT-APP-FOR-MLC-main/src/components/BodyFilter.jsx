import React from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@material-ui/core';

class Filter extends React.Component {

	render() {
		const inputArray = this.props.inputArray;
		const inputType = this.props.inputType;
		let singleSelect = this.props.singleSelect;

		return (
						<Autocomplete
							multiple = {!singleSelect}
							limitTags={50}
							options={inputArray}
							sx={{width: 300}}
							renderInput={(params) => 
							<TextField {...params}
							variant='outlined'
							label = {inputType}
							color='secondary'
							/>}
						/>
		);
	}
}
 
export default Filter;