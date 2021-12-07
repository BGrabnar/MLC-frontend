import React from 'react';
import {Grid} from '@material-ui/core';
import { color, palette } from '@mui/system';
import { Typography } from '@mui/material';
import Box from '@material-ui/core/Box';

class LandingPage extends React.Component {

  	render() {
		return (
            <React.Fragment>
              <div style={{
                position: 'absolute', left: '50%', top: '40%',
                transform: 'translate(-50%, -50%)',
              }}>
                <Typography variant="h1">
                  <Box sx={{width: 700}}>
                     Welcome to MLC Catalogue </Box>  
                </Typography> 
                
              </div>

                
            </React.Fragment>
    	)
  }
}

export default LandingPage;