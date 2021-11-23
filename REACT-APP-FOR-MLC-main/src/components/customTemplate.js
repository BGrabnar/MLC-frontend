import { createTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export function customTheme() {
	return(
	createTheme({
		palette: {
			primary: {
				main: '#212121'
			},
			secondary: {
				main: '#00BFA5'
			},
		},
		root: {
			variant: 'contained',
			color: 'secondary',
			border: '5',
			marginBottom: '15',
			borderRadius: '15',
			padding: '10px 30px'
	}
			})
	);
}

export function myStyle() {
	return(
		makeStyles({
		lala: {
				variant: 'contained',
				color: 'secondary',
				border: '5',
				marginBottom: '15',
				borderRadius: '15',
				padding: '10px 30px'
		}
		})
	)
}