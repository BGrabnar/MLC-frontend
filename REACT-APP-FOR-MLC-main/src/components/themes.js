import { createTheme, styled } from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import {Switch, Card, Autocomplete, Paper, Button, CircularProgress, Tooltip } from "@mui/material";
import { TextField } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import MuiAccordion from '@mui/material/Accordion';
import {Link} from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {GridToolbarExport, GridToolbarContainer} from '@material-ui/data-grid';

// 0: header   1: body  2: pannels  3: highlight  4: text    5: error
const darkThemeColors = ['#082032', '#2C394B', '#7c848f', '#FB9300', '#fff', '#ff6666'];
const lightThemeColors = ['#343F56', '#F5E6CA', '#f9f0df','#FB9300' , '#000', '#ff0000'];

export const darkTheme = createTheme({
    palette: {
        //mode: 'dark',
        primary: {
            main: darkThemeColors[0],
        },
        secondary: {
            main: darkThemeColors[3],
            contrastText: darkThemeColors[4]
        },
        text: {
            primary: darkThemeColors[4],
        },
        error: {
          main: darkThemeColors[5]
        },
    },
    typography: {
        h1: {
            color:  darkThemeColors[4],
            fontSize: '20rem',
            textAlign: "center",
        },
        body1: {
            color: darkThemeColors[4],
            backgroundColor: darkThemeColors[1],
            borderRadius: 5,
        },
        button: {
          color: darkThemeColors[4]
        }
    },
});

export const lightTheme = createTheme({
    palette: {
        //mode: 'light',
        primary: {
            main: lightThemeColors[0]
        },
        secondary: {
            main: lightThemeColors[3]
        },
        text: {
            primary: lightThemeColors[4],
        },
        error: {
            main: lightThemeColors[5]
        }
    },
    typography: {
      h1: {
        color:  lightThemeColors[4],
        fontSize: '20rem',
        textAlign: "center",
      },
        body1: {
             color: lightThemeColors[4],
             backgroundColor: lightThemeColors[1],
             borderRadius: 5,
        },
        button: {
              color: lightThemeColors[4]
        }
      },
});

var currentTheme;
export function toggleTheme(theme){
    currentTheme = theme;
    if (theme === 'dark')
    {
        document.body.style.backgroundColor = darkThemeColors[1];

        return {...darkTheme}
    }
    else
    {
        document.body.style.backgroundColor = lightThemeColors[1];

        return {...lightTheme}
    }
}

// card
export const CustomCard = styled(Card)(({}) => ({
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[2] : lightThemeColors[2],
}));

// add icon
export const CustomAddIcon = styled(AddIcon)(({}) => ({
  color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
}));

// autocomplete 
export const CustomAutocomplete = styled(Autocomplete)(({}) => ({
  '.MuiInputBase-input':{
    color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
  },
  '.MuiAutocomplete-tag': {
    color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[2] : lightThemeColors[2],
    '.MuiChip-deleteIcon': {
      color: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
      '&:hover': {
        color: currentTheme === 'dark' ? darkThemeColors[3] : lightThemeColors[3],
     },
    },
  },
  '.MuiAutocomplete-inputRoot': {
    color: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
  },
  '.Mui-focused': {
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
    borderRadius: 5,
  },
  '.MuiAutocomplete-clearIndicator': {
    color: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[2] : lightThemeColors[2],
    '&:hover': {
      background: currentTheme === 'dark' ? darkThemeColors[3] : lightThemeColors[3],
   },
  },
  '.MuiAutocomplete-popupIndicatorOpen': {
    color: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[2] : lightThemeColors[2],
    '&:hover': {
      background: currentTheme === 'dark' ? darkThemeColors[3] : lightThemeColors[3],
   },
  },
  '.MuiAutocomplete-popupIndicator': {
    color: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[2] : lightThemeColors[2],
    '&:hover': {
      background: currentTheme === 'dark' ? darkThemeColors[3] : lightThemeColors[3],
   },
  },
}));

// for autocomplete dropdown list
export const CustomPaper = (props) => {
  return <Paper style={{background: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1], color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],}} {...props} />;
};

// delete button
export const CustomDeleteButton = styled(Button)(({}) => ({
  backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
  '&:hover': {
    background: currentTheme === 'dark' ? darkThemeColors[3] : lightThemeColors[3],
 },
}));

// circular progress / loading icon
export const CustomCircularProgress = styled(CircularProgress)(({}) => ({
  color: currentTheme === 'dark' ? darkThemeColors[3] : lightThemeColors[3],
}));

// text field
export const CustomTextField = styled(TextField)(({}) =>({
  backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
  borderRadius: 5,
  '.Mui-focused': {
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
    borderRadius: 5,
  },
}));

// data grid
export const CustomDataGrid = styled(DataGrid)(({}) => ({
  backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
  '.MuiDataGrid-row':{
    color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[2] : lightThemeColors[2],
  },
  '.MuiDataGrid-columnHeader': {
    color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[3] : lightThemeColors[3],
    borderRadius: 1,
  },
  '.MuiDataGrid-menuIconButton': {
    color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
  },
  '.MuiDataGrid-sortIcon': {
    color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
  },
  '.MuiDataGrid-iconSeparator': {
    color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[1],
  },
}));

// tooltip
const ToBeStyledTooltip = ({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
);
export const CustomTooltip = styled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
  color: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
  border: '1px solid',
  borderColor: currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
  fontSize: 15,
}));

// light / dark theme switch
export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
	width: 62,
	height: 34,
	padding: 7,
	'& .MuiSwitch-switchBase': {
	  margin: 1,
	  padding: 0,
	  transform: 'translateX(6px)',
	  '&.Mui-checked': {
		color: darkThemeColors[4],
		transform: 'translateX(22px)',
		'& .MuiSwitch-thumb:before': {
		  backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
			darkThemeColors[4],
		  )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
		},
		'& + .MuiSwitch-track': {
		  opacity: 1,
		  backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
		},
	  },
	},
	'& .MuiSwitch-thumb': {
	  backgroundColor: theme.palette.mode === 'dark' ? '#003892' : darkThemeColors[3],
	  width: 32,
	  height: 32,
	  '&:before': {
		content: "''",
		position: 'absolute',
		width: '100%',
		height: '100%',
		left: 0,
		top: 0,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
		  darkThemeColors[4],
		)}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
	  },
	},
	'& .MuiSwitch-track': {
	  opacity: 1,
	  backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
	  borderRadius: 20 / 2,
	},
  }));

//other switches
export const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 4,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: darkThemeColors[4],
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? darkThemeColors[3] : darkThemeColors[3],
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#8796A5',
        border: '6px solid #fff',
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 18,
      height: 18,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#8796A5' : '#8796A5',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

// accordion
export const CustomAccordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: currentTheme === 'dark' ? darkThemeColors[2] : lightThemeColors[2],
}));

// link
export const CustomLink = styled(Link)(({selected}) => ({
  color: selected === true ? darkThemeColors[3] : currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
  textDecoration: "none"
}));

// menus
export const CustomMenu = styled(Menu)(({}) => ({
  '.MuiList-root':{
    color : currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
    
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
  },
  '.MuiMenuItem-root':{
    color : currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
    
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
  },
}));

// button
export const CustomButton = styled(Button)(({selected}) => ({
  color: selected === true ? darkThemeColors[3] : currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
  //backgroundColor : currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
}));

// GridToolbarExport
export const CustomGridToolbarExport = styled(GridToolbarExport)(({}) => ({
  '.MuiList-root':{
    '.MuiPaper-root':{
    color : currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
    
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
    }
  },
  '.MuiMenuItem-root':{
    color : currentTheme === 'dark' ? darkThemeColors[4] : lightThemeColors[4],
    
    backgroundColor: currentTheme === 'dark' ? darkThemeColors[1] : lightThemeColors[1],
  },
}));