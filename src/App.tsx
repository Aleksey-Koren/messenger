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

function foo() {

    let a1;
    let a2;
    let a3;
    a1 = 1;
    a2 = 2;
    a3 = 3;
    let arr = [];
    arr.push(a2);
    arr.push(a3);
    arr.push(a1);
    console.log(arr);
    arr.sort((a, b) => {
        if (a > b) {
            return -1;
        } else if (a < b) {
            return 1;
        } else {
            return 0;
        }
    });
    console.log(arr);

}

yup.addMethod(yup.mixed, "isGlobalUserNotExists", function (errorMessage) {
    return this.test('test.ts-global-user-existing', errorMessage, function (value) {
        const {path, createError} = this;
        const globalUser = store.getState().messenger.globalUsers[value!];

        return (!globalUser || createError({path, message: errorMessage}));
    })
})

function App() {
    foo();
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
