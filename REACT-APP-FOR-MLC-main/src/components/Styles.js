import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import React from 'react';

class ButtonNew extends React.Component {
	classes = makeStyles({
		root: {
			background: 'linear-gradient(45deg, #333, #999)',
			border:0,
			borderRadius: 15,
			color: 'white',
			padding: '0 30 px',
		}
	})

	render() {
		return(
			<Button 
			className={this.classes.root}>
				{(props) => props.name} 
			</Button>
		);
	}
}

export default ButtonNew;