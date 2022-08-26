import {ISetHasMoreAction, MessagesListActionType} from "./messagesListTypes";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {MessageApi} from "../../api/messageApi";
import {MessageType} from "../../model/messenger/messageType";
import {setMessages} from "../messenger/messengerActions";
import React from "react";

export function setHasMore(hasMore: boolean): ISetHasMoreAction {
    return {
        type: MessagesListActionType.SET_HAS_MORE,
        payload: {
            hasMore
        }
    }
}

export function fetchNextPageTF() {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const state = getState();
        const currentMessages = state.messenger.messages;
        const oldestCreated = currentMessages[currentMessages.length - 1].created;
        MessageApi.getMessages({
            receiver: state.messenger.user!.id,
            chat: state.messenger.currentChat!,
            page: 0,
            size: 15,
            before: oldestCreated
        }).then(messages => {
            console.log("NEXT PAGE")
            console.log(messages)
            if(messages.length > 0) {
                messages = messages.filter(message => message.type !== MessageType.who);
                dispatch(setMessages([...currentMessages, ...messages]));
            } else {
                dispatch(setHasMore(false));
            }
        })
    }
}

export function onScrollTF(event: React.UIEvent<HTMLUListElement, UIEvent>) {
    return function (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) {
        const scrollRef = event.currentTarget;
        console.log(scrollRef.scrollTop);
        if(scrollRef.scrollTop > -1) {
            console.log('ON THE TOP');
        }
    }
}