import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider, TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import {authorizationReducer} from "./redux/authorization/authorizationReducer";

const reducers = combineReducers({
    authorization: authorizationReducer
});

export const store = configureStore({reducer: reducers, devTools: true, middleware: [thunk, promise]})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
