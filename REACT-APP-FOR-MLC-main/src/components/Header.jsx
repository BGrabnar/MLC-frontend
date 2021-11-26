import React from 'react';
import {AppBar, Toolbar, Typography, Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import {MaterialUISwitch} from './themes.js'
import PatternIcon from '@mui/icons-material/Pattern';
import {Link} from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const options = [
	<Link to='/MainPage'>Main page</Link>,
	<Link to='/'>Compare</Link>,
	<Link to='/Ed'>Experiment data</Link>,
	<Link to='/Dataset'>Dataset</Link>,
	<Link to='/Method'>Method</Link>,
	<Link to='/Dataset Grid'>Dataset grid</Link>,
	<Link to='/Method Grid'>Method grid</Link>
  ];

  //menu list
function MenuList() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedIndex, setSelectedIndex] = React.useState(1);
	const open = Boolean(anchorEl);
	const handleClickListItem = (event) => {
	  setAnchorEl(event.currentTarget);
	};
  
	const handleMenuItemClick = (event, index) => {
	  setSelectedIndex(index);
	  setAnchorEl(null);
	};
  
	const handleClose = () => {
	  setAnchorEl(null);
	};
  
	return (
	  <div>
		<List
		  component="nav"
		  aria-label="Device settings"
		  sx={{ bgcolor: 'palette.secondary' }}
		>
		  <ListItem
			button
			id="lock-button"
			aria-haspopup="listbox"
			aria-controls="lock-menu"
			aria-expanded={open ? 'true' : undefined}
			onClick={handleClickListItem}
		  >
			<ListItemText
			  primary={options[selectedIndex]}
			/>
		  </ListItem>
		</List>
		<Menu
		  id="lock-menu"
		  anchorEl={anchorEl}
		  open={open}
		  onClose={handleClose}
		  MenuListProps={{
			'aria-labelledby': 'lock-button',
			role: 'listbox',
		  }}
		>
		  {options.map((option, index) => (
			<MenuItem
			  key={option}
			  selected={index === selectedIndex}
			  onClick={(event) => handleMenuItemClick(event, index)}
			>
			  {option}
			</MenuItem>
		  ))}
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
								<Box display='flex'sx={{mr:2, mt:2}}>
									<Box sx={{mt:0.5}}>
										<PatternIcon sx={{mr:2}}/>
									</Box>
									<Typography variant='h5'>
										MLC Catalogue
									</Typography>
								</Box>
								<MenuList sx={{ml:5}}/>
							</Box>

							<FormControlLabel
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