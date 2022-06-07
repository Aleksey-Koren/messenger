import React from 'react';
import './App.css';
import Messenger from "./components/messenger/Messenger";
import {createTheme, ThemeProvider} from "@mui/material";
import 'react-perfect-scrollbar/dist/css/styles.css';


function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#60ad60',
      },
      secondary: {
        main: '#fec720'
      },
      background: {
        default: "#262424",
        paper: "#262424"
      }
    },
    typography: {
      button: {
        textTransform: "none",
        color: '#60ad60',

      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          color: "secondary"
        }
      },
      MuiPaper: {
        defaultProps: {
          style: {
            border: "1px solid #60ad60",
          }
        }
      },
      MuiDialogTitle: {
        defaultProps: {
          color: "primary"
        }
      },
      MuiTypography: {
        defaultProps: {
          color: "primary"
        }
      },
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Messenger/>
    </ThemeProvider>
  );
}

export default App;
