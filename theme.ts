import { createTheme } from '@mui/material';

/**
 * Info about the theme config object:
 * @see https://mui.com/material-ui/customization/default-theme/
 * 
 * Material UI tool for generating theme colours based on a selected colour:
 * @see https://mui.com/material-ui/customization/color/#picking-colors
 * 
 */
export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#8c0f61',
      light: '#bf498e',
      dark: '#5a0037',
    },
    secondary: {
      main: '#F29F05',
      light: '#ffd049',
      dark: '#ba7100',
    },
  },
});

