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
import {store} from "./index";

// yup.addMethod(yup.string, "uuid", function (errorMessage) {
//     return this.test(`test-card-type`, errorMessage, function (value) {
//         const {path, createError} = this;
//
//         return (
//             validate(value as string) ||
//             createError({path, message: errorMessage})
//         );
//     });
// });

yup.addMethod(yup.mixed, "isGlobalUserNotExists", function (errorMessage) {
    return this.test('test-global-user-existing', errorMessage, function (value) {
        const {path, createError} = this;
        const globalUser = store.getState().messenger.globalUsers[value!];

        return (!globalUser || createError({path, message: errorMessage}));
    })
})

// function foo() {
//     const nonce = new Uint8Array(24);
//     crypto.getRandomValues(nonce);
//
//     const pair = nacl.box.keyPair();
//
//     const test = nacl.box(
//         CryptService.plainStringToUint8('Watermelon!!!HEY'),
//         nonce,
//         pair.secretKey,
//         pair.publicKey
//     );
//
//
//     const opened = nacl.box.open(test, nonce, pair.secretKey, pair.publicKey);
//     console.log(CryptService.uint8ToPlainString(opened!));
// }
//
// function generateKey() {
//     const boxKeyPair = nacl.box.keyPair();
//     console.log("FRONTEND BASE 64 PUBLIC KEY: " + CryptService.uint8ToBase64(boxKeyPair.publicKey));
//     console.log("FRONTEND BASE 64 PRIVATE KEY: " + CryptService.uint8ToBase64(boxKeyPair.secretKey));
// }

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
