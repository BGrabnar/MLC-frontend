import React from 'react';
import {AppBar, Toolbar, Typography, Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import {MaterialUISwitch} from './themes.js'
import PatternIcon from '@mui/icons-material/Pattern';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import {CustomLink, CustomMenuItem, CustomButton, CustomMenu} from './themes.js';

  	//menu list
	function FadeMenu(props) {
		const [anchorEl, setAnchorEl] = React.useState(null);
		const open = Boolean(anchorEl);
		const handleClick = (event) => {
		  setAnchorEl(event.currentTarget);
		};
		const handleClose = () => {
		  setAnchorEl(null);
		};
	  
		return (
		  <div>
			<CustomButton
			  id="fade-button"
			  aria-controls="fade-menu"
			  aria-haspopup="true"
			  aria-expanded={open ? 'true' : undefined}
			  onClick={handleClick}
			  sx = {{m:1.5}}
			  selected={props.browse}
			>
			  Browse
			</CustomButton>
			<CustomMenu
			  id="fade-menu"
			  MenuListProps={{
				'aria-labelledby': 'fade-button',
			  }}
			  anchorEl={anchorEl}
			  open={open}
			  onClose={handleClose}
			  TransitionComponent={Fade}
			>
			  <MenuItem onClick={handleClose}><CustomLink to='/Experiments' >Experiments</CustomLink></MenuItem>
			  <MenuItem onClick={handleClose}><CustomLink to='/Datasets'>Datasets</CustomLink></MenuItem>
			  <MenuItem onClick={handleClose}><CustomLink to='/Methods'>Methods</CustomLink></MenuItem>
			</CustomMenu>
		  </div>
		);
	}

class Header extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {
			url: props.url,
			compare: false,
			browse: false,
    	}
  	}

	ToggleTheme = (theme) => {
        this.props.callback(theme);
    }

	componentDidMount() {
		this.interval = setInterval(() => {
			if (window.location.pathname === "/Compare")
				{this.setState({compare: true, browse: false}, () => {this.render();} )}
			else if (window.location.pathname === "/")
				{this.setState({compare: false, browse: false}, () => {this.render();} )}
			else
				{this.setState({compare: false, browse: true}, () => {this.render();} )}
			}, 250);
	  }

  	render() {
		return (
				<AppBar position="static">
					<Toolbar>
						
						<Box display='flex' flexGrow={1}>
						
							<CustomLink to="/">
								<Box display='flex'sx={{mr:2, mt:2, width: 600}}>
									<Box sx={{mt:0.5}}>
										<PatternIcon sx={{mr:2}}/>
									</Box>
									<Typography variant='h5'>
										MLC Catalogue
									</Typography>
								</Box>
							</CustomLink>
							<Grid container justifyContent="flex-end">
									<FadeMenu browse={this.state.browse}/>
									<Button><CustomLink to="/Compare" selected={this.state.compare}>COMPARE</CustomLink> </Button>
								</Grid>
							</Box>
							
							<FormControlLabel sx={{ display: 'none' }}
								control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked   
								onChange= {(value) => {
									if (value.target.checked === true)
									{
										this.ToggleTheme('dark');
									}
									else
									{
										this.ToggleTheme('light');
									}
								}}/>}
								label=""
							/>
					</Toolbar>
				</AppBar>
    	)
  }
}

export default Header;