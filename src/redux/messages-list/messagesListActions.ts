import {ISetOnscrollMuted, MessagesListActionType} from "./messagesListTypes";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {MessageApi} from "../../api/messageApi";
import {MessageType} from "../../model/messenger/messageType";
import {setMessages} from "../messenger/messengerActions";
import React from "react";
import {MessagesListService} from "../../service/messenger/messagesListService";

export function setOnscrollMuted(isOnscrollMuted: boolean): ISetOnscrollMuted {
    return {
        type: MessagesListActionType.SET_ONSCROLL_MUTED,
        payload: {
            isOnscrollMuted
        }
    }
}

export function setAtTheBottom(isAtTheBottom: boolean) {
    return {
        type: MessagesListActionType.SET_AT_THE_BOTTOM,
        payload: {
            isAtTheBottom
        }
    }
}

export function setLastRead(lastRead: string) {
    return {
        type: MessagesListActionType.SET_LAST_READ,
        payload: {
            lastRead
        }
    }
}

export function setHasMore(hasMore: boolean) {
    return {
        type: MessagesListActionType.HAS_MORE,
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
        const state = getState();
        const scrollRef = event.currentTarget

        if(!state.messagesList.isOnscrollMuted) {
            const {x, y} = MessagesListService.calculateAimCoordinates(scrollRef);
            const target = document.elementFromPoint(x, y);
            if(target) {
                if (MessagesListService.isAfter(target.id, state.messagesList.lastRead)) {
                    console.log('setLastRead  :  ' + target.id)
                    dispatch(setLastRead(target.id));
                }
            }
        }

        if(scrollRef.scrollTop > -1 && !state.messagesList.isAtTheBottom) {
            console.log("AT THE BOTTOM");
            dispatch(setAtTheBottom(true));
            const messages = state.messenger.messages;
            if (messages.length > 0) {
                dispatch(setLastRead(MessagesListService.mapMessageToHTMLId(messages[0])));
            }
        }

        if(scrollRef.scrollTop < -1 && state.messagesList.isAtTheBottom) {
            console.log("GO UP");
            dispatch(setAtTheBottom(false));
        }
    }
}

export function scrollToUnreadTF(lastReadHtmlId: string, scrollRef: HTMLUListElement) {
    return function (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) {
        const children = scrollRef.children[0].children[0].children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].id === lastReadHtmlId) {
                dispatch(setOnscrollMuted(true));
                children[i - 1].scrollIntoView(false);
                setTimeout(() => {dispatch(setOnscrollMuted(false))}, 500);
                return;
            }
        }
        throw new Error('Error while scrolling to first unread message');
    }
}