import React from 'react';
import './App.css';
import Messenger from "./components/messenger/Messenger";
import {createTheme, ThemeProvider} from "@mui/material";
import 'react-perfect-scrollbar/dist/css/styles.css';
import * as yup from "yup";
import {validate} from 'uuid';
import Notification from './Notification';
import nacl from "tweetnacl";
import {CryptService} from "./service/cryptService";

yup.addMethod(yup.string, "uuid", function (errorMessage) {
  return this.test(`test-card-type`, errorMessage, function (value) {
    const { path, createError } = this;

    return (
        validate(value as string) ||
        createError({ path, message: errorMessage })
    );
  });
});

function foo() {
  let a = CryptService.decrypt(CryptService.base64ToUint8('0bf6YcHMaZ0D/uoVB8AdIuXHjnGlyUa/35XRnIy+0cJpTF0sUx/TxZgG33dGaelLHN91MA=='),
      CryptService.base64ToUint8('34BKNh4ev74U+wXfcHVrKdMhdfOG4PDgYym2qIxiERk='),
      CryptService.base64ToUint8('csf2mo/PF0ve6YZ8nVo6aw0tpSLbTzet'),
      CryptService.JSONByteStringToUint8('133, 71, 53, 252, 93, 14, 62, 29, 234, 252, 76, 147, 133, 129, 252, 94, 93, 79, 7, 81, 120, 161, 211, 146, 54, 39, 170, 227, 32, 212, 249, 218')
  );
  console.log(a);
  console.log(CryptService.uint8ToPlainString(a!));
}

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    }
  });

  foo();

  return (
    <ThemeProvider theme={theme}>
      <Notification/>
      <Messenger/>
    </ThemeProvider>
  );
}

export default App;
