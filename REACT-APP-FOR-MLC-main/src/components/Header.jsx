import React from 'react';
import {AppBar, Toolbar, Typography, Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import {MaterialUISwitch} from './themes.js'
import PatternIcon from '@mui/icons-material/Pattern';
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';

  	//menu list
	function FadeMenu() {
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
			<Button
			  id="fade-button"
			  aria-controls="fade-menu"
			  aria-haspopup="true"
			  aria-expanded={open ? 'true' : undefined}
			  onClick={handleClick}
			  sx = {{m:1.5}}
			>
			  Browse
			</Button>
			<Menu
			  id="fade-menu"
			  MenuListProps={{
				'aria-labelledby': 'fade-button',
			  }}
			  anchorEl={anchorEl}
			  open={open}
			  onClose={handleClose}
			  TransitionComponent={Fade}
			>
			  <MenuItem onClick={handleClose}><Link to='/Experiments'>Experiments</Link></MenuItem>
			  <MenuItem onClick={handleClose}><Link to='/Dataset'>Datasets</Link></MenuItem>
			  <MenuItem onClick={handleClose}><Link to='/Method'>Methods</Link></MenuItem>
			</Menu>
		  </div>
		);
	}

class Header extends React.Component {
	ToggleTheme = (theme) => {
        this.props.callback(theme);
    }

  	render() {
		return (
				<AppBar position="static">
					<Toolbar>
						<Box display='flex' flexGrow={1}>
							<Link to="/">
								<Box display='flex'sx={{mr:2, mt:2}}>
									<Box sx={{mt:0.5}}>
										<PatternIcon sx={{mr:2}}/>
									</Box>
									<Typography variant='h5'>
										MLC Catalogue
									</Typography>
								</Box>
							</Link>
								<FadeMenu/>
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