import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import {Provider, TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import {authorizationReducer} from "./redux/authorization/authorizationReducer";
import {messengerReducer} from "./redux/messenger/messengerReducer";
import {messengerMenuReducer} from "./redux/messenger-menu/messengerMenuReducer";
import {messengerControlsReducer} from "./redux/messenger-controls/messengerControlsReducer";
import {voiceMessagesReducer} from "./redux/voiceMessages/voiceMessagesReducer";
import {messagesListReducer} from "./redux/messages-list/messengerListReducer";

const reducers = combineReducers({
    authorizationReducer: authorizationReducer,
    messenger: messengerReducer,
    messengerMenu: messengerMenuReducer,
    messengerControls: messengerControlsReducer,
    voiceMessages: voiceMessagesReducer,
    messagesList: messagesListReducer
});

export const store = configureStore({reducer: reducers, devTools: true, middleware: [thunk, promise]})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <Provider store={store}>
        <App/>
    </Provider>,
);