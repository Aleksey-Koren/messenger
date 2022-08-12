import React from 'react';
import './App.css';
import Messenger from "./components/messenger/Messenger";
import {createTheme, ThemeProvider} from "@mui/material";
import 'react-perfect-scrollbar/dist/css/styles.css';
import * as yup from "yup";
import Notification from './Notification';
import {store} from "./index";

// yup.addMethod(yup.string, "uuid", function (errorMessage) {
//     return this.test.ts(`test.ts-card-type`, errorMessage, function (value) {
//         const {path, createError} = this;
//
//         return (
//             validate(value as string) ||
//             createError({path, message: errorMessage})
//         );
//     });
// });

async function foo() {


    URL.createObjectURL(new Blob([new Uint8Array()]));
}

yup.addMethod(yup.mixed, "isGlobalUserNotExists", function (errorMessage) {
    return this.test('test.ts-global-user-existing', errorMessage, function (value) {
        const {path, createError} = this;
        const globalUser = store.getState().messenger.globalUsers[value!];

        return (!globalUser || createError({path, message: errorMessage}));
    })
})

function App() {
    foo().then();
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
