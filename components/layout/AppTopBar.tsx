import MuiAppBar, { AppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { DRAWER_WIDTH } from './DrawerHeader';


interface AppTopBarProps extends AppBarProps {
  open?: boolean;
}

const AppTopBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppTopBarProps>(({ theme, open }) => ({
  backgroundColor: '#121212',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: DRAWER_WIDTH,
  }),
}));

export default AppTopBar;