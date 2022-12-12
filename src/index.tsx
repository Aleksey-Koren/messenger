import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import {Provider, useDispatch} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import reducers from "./redux/RootReducers";

export const store = configureStore({reducer: reducers, devTools: true, middleware: [thunk, promise]})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <Provider store={store}>
        <App/>
    </Provider>,
);