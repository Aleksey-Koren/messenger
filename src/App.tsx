import React from 'react';
import './App.css';
import Messenger from "./components/messenger/Messenger";
import {createTheme, ThemeProvider} from "@mui/material";
import 'react-perfect-scrollbar/dist/css/styles.css';
import * as yup from "yup";
import {validate} from 'uuid';
import Notification from './Notification';

yup.addMethod(yup.string, "uuid", function (errorMessage) {
  return this.test(`test-card-type`, errorMessage, function (value) {
    const { path, createError } = this;

    return (
        validate(value as string) ||
        createError({ path, message: errorMessage })
    );
  });
});



function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Notification/>
      <Messenger/>
    </ThemeProvider>
  );
}

export default App;
