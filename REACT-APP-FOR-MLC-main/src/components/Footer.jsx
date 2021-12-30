import React from 'react';
import {AppBar, Box, Typography, Grid} from '@material-ui/core';

class Footer extends React.Component {

  	render() {
		return (
            <React.Fragment>
                <div style={{position: 'fixed', left: '0%', top: '94.25%', width: '100%'}}>
                        <AppBar position="static">
                        <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    style={{height: 100, paddingBottom: 50}}
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