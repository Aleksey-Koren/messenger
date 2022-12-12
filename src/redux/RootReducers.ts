import {combineReducers} from "@reduxjs/toolkit";
import {authorizationReducer} from "./authorization/authorizationReducer";
import {messengerReducer} from "./messenger/messengerReducer";
import {messengerMenuReducer} from "./messenger-menu/messengerMenuReducer";
import {messengerControlsReducer} from "./messenger-controls/messengerControlsReducer";
import {voiceMessagesReducer} from "./voiceMessages/voiceMessagesReducer";
import {messagesListReducer} from "./messages-list/messengerListReducer";

const reducers = combineReducers({
    authorizationReducer: authorizationReducer,
    messenger: messengerReducer,
    messengerMenu: messengerMenuReducer,
    messengerControls: messengerControlsReducer,
    voiceMessages: voiceMessagesReducer,
    messagesList: messagesListReducer
});

export default reducers;