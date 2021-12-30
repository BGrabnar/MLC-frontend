import React from 'react';
import { Typography } from '@mui/material';
import Box from '@material-ui/core/Box';

class LandingPage extends React.Component {

  	render() {
		return (
            <React.Fragment>
              <img src={"/Bacground.png"} alt="Logo" style={{width: '100%', height: '92vh'}}/>
                <div style={{
                  position: 'absolute', left: '50%', top: '45%',
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