import {ISetOnscrollMuted, MessagesListActionType} from "./messagesListTypes";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {MessageApi} from "../../api/messageApi";
import {MessageType} from "../../model/messenger/messageType";
import {setGlobalUsers, setMessages} from "../messenger/messengerActions";
import React from "react";
import {MessagesListService} from "../../service/messenger/messagesListService";
import {Message} from "../../model/messenger/message";
import {CryptService} from "../../service/cryptService";
import {MessageService} from "../../service/messenger/messageService";
import {getChatById, getChatsByCustomerId} from "../chats/chatsActions";
import {LocalStorageService} from "../../service/local-data/localStorageService";
import {CustomerApi} from "../../api/customerApi";

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

/**
 * Method that fetch next page of messages in chat.
 */
export function fetchNextPageTF() {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const state = getState();
        const currentMessages = state.messenger.messages;
        const oldestCreated = currentMessages[currentMessages.length - 1].created;
        const currentChat = state.chats.chat;


        MessageApi.getMessages({
            receiver: state.messenger.user!.id,
            chat: currentChat!.id,
            page: 0,
            size: 20,
            before: oldestCreated
        }).then(messages => {
            console.log(messages)
            if (messages.length > 0) {
                dispatch(setMessages([...currentMessages, ...messages]));
            } else {
                dispatch(setHasMore(false));
            }
        })
    }
}

export function getLastMessage(payload: any) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const state = getState();
        const currentMessages = state.messenger.messages;
        const data = LocalStorageService.loadDataFromLocalStorage();
        const userId = data!.user.id

        const message: Message = {
            id: payload.id,
            sender: payload.sender,
            receiver: payload.receiver,
            chat: payload.chat!,
            type: payload.type,
            created: new Date(payload.created!),
            data: payload.data,
            attachmentsFilenames: !!payload.attachments ? payload.attachments?.split(";") : undefined,
            nonce: payload.nonce ? CryptService.base64ToUint8(payload.nonce!) : undefined,
            decrypted: false
        };

        MessageService.decryptMessageDataByIterateOverPublicKeys(message, payload.sender)
            .then(() => {
                console.log(message.type)
                switch (message.type) {
                    case MessageType.CHAT:
                    case MessageType.WHISPER:
                        dispatch(setMessages([...currentMessages.slice(0, 0), message, ...currentMessages.slice(0)]))
                        break
                    case MessageType.INVITE_CHAT:
                        CustomerApi.getCustomersByChatId(message.chat)
                            .then(users => {
                                const globalUsers = {...getState().messenger.globalUsers};
                                users.forEach((userItem) => {
                                    globalUsers[userItem.id!] = {
                                        userId: userItem.id,
                                        certificates: [CryptService.uint8ToBase64(userItem.publicKey)],
                                        titles: {}
                                    };
                                });
                                LocalStorageService.globalUsersToStorage(globalUsers);
                                dispatch(getChatsByCustomerId(userId, 0, 0))
                                dispatch(setGlobalUsers(globalUsers))
                            })
                        break
                    case MessageType.LEAVE_CHAT:
                        dispatch(getChatById(message.chat))
                        break
                }
            })
    }
}

export function onScrollTF(event: React.UIEvent<HTMLUListElement, UIEvent>) {
    return function (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) {
        const state = getState();
        const scrollRef = event.currentTarget

        if (!state.messagesList.isOnscrollMuted) {
            const {x, y} = MessagesListService.calculateAimCoordinates(scrollRef);
            const target = document.elementFromPoint(x, y);
            if (target) {
                if (MessagesListService.isAfter(target.id, state.messagesList.lastRead)) {
                    console.log('setLastRead  :  ' + target.id)
                    dispatch(setLastRead(target.id));
                }
            }
        }

        if (scrollRef.scrollTop > -1 && !state.messagesList.isAtTheBottom) {
            console.log("AT THE BOTTOM");
            dispatch(setAtTheBottom(true));
            const messages = state.messenger.messages;
            if (messages.length > 0) {
                dispatch(setLastRead(MessagesListService.mapMessageToHTMLId(messages[0])));
            }
        }

        if (scrollRef.scrollTop < -1 && state.messagesList.isAtTheBottom) {
            console.log("GO UP");
            dispatch(setAtTheBottom(false));
        }
    }
}

export function scrollToUnreadTF(lastReadHtmlId: string, scrollRef: HTMLUListElement) {
    return function (dispatch: ThunkDispatch<AppState, void, Action>) {
        const children = scrollRef.children[0].children[0].children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].id === lastReadHtmlId) {
                dispatch(setOnscrollMuted(true));
                children[i - 1].scrollIntoView(false);
                setTimeout(() => {
                    dispatch(setOnscrollMuted(false))
                }, 500);
                return;
            }
        }
        throw new Error('Error while scrolling to first unread message');
    }
}