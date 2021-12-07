import React from 'react';
import {AppBar, Toolbar, Typography, Grid} from '@material-ui/core';

class Footer extends React.Component {

  	render() {
		return (
            <React.Fragment>
                <div style={{position: 'absolute', left: '0%', top: '100%', width: '100%'}}>
                    
                        <AppBar position="static">
                        <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    >
                            Copyright © Jožef Stefan Institute 2021 
                            </Grid>
                        </AppBar>
                    </div>
                
            </React.Fragment>
    )
  }
}

export default Footer;