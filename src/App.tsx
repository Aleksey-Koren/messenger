import React from 'react';
import './App.css';
import Messenger from "./components/messenger/Messenger";
import {createTheme, ThemeProvider} from "@mui/material";
import 'react-perfect-scrollbar/dist/css/styles.css';
import * as yup from "yup";
import Notification from './Notification';
import nacl from "tweetnacl";
import {CryptService} from "./service/cryptService";
import {store} from "./index";
import {CustomerApi} from "./api/customerApi";

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

function foo() {
    CustomerApi.getServerUser().then(s => console.log(JSON.stringify(s)));
}

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
