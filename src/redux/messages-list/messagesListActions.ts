import {ISetOnscrollMuted, MessagesListActionType} from "./messagesListTypes";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {MessageApi} from "../../api/messageApi";
import {MessageType} from "../../model/messenger/messageType";
import {
    setAdministrators,
    setChats,
    setCurrentChat,
    setGlobalUsers,
    setLastMessagesFetch,
    setMessages,
    setUsers
} from "../messenger/messengerActions";
import React from "react";
import {MessagesListService} from "../../service/messenger/messagesListService";
import {Message} from "../../model/messenger/message";
import {MessageService} from "../../service/messenger/messageService";
import {Chat} from "../../model/messenger/chat";
import {Builder} from "builder-pattern";
import {setIsMembersModalOpened} from "../messenger-menu/messengerMenuActions";
import {setIsNewPrivateModalOpened} from "../messenger-controls/messengerControlsActions";
import {StringIndexArray} from "../../model/stringIndexArray";
import {User} from "../../model/messenger/user";
import {ChatService} from "../../service/messenger/chatService";
import {MessageProcessingService} from "../../service/messenger/messageProcessingService";
import {AdministratorApi} from "../../api/administratorApi";

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
        console.log("fetchNextPageTF")
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
            if (messages.length > 0) {
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
    return function (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) {
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


export function getLastMessage(payload: any) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const message: Message = {
            id: payload.id,
            sender: payload.sender,
            receiver: payload.receiver,
            chat: payload.chat!,
            type: payload.type,
            created: new Date(payload.created!),
            data: payload.data,
            attachmentsFilenames: !!payload.attachments ? payload.attachments?.split(";") : undefined,
            nonce: payload.nonce ? payload.nonce! : undefined,
            decrypted: false
        };

        console.log("type: " + message.type)
        MessageService.decryptMessageDataByIterateOverPublicKeys(message, payload.sender)
            .then(() => {
                switch (message.type) {
                    case MessageType.whisper:
                        MessageProcessingService.processMessages(dispatch, getState, [message]);
                        break
                    case MessageType.hello:
                        handleHelloMessage(message, dispatch, getState)
                        processChatParticipants(message, dispatch, getState)
                        break
                    case MessageType.iam:
                        processChatParticipants(message, dispatch, getState);
                        break
                    case MessageType.who:
                        processChatParticipants(message, dispatch, getState);
                        break;
                    case MessageType.LEAVE_CHAT:
                        handleLeaveChatMessage(message, dispatch, getState)
                        break
                }
            })
    }
}

function processChatParticipants(message: Message, dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) {
    const user = getState().messenger.user;
    const globalUsers = {...getState().messenger.globalUsers};

    ChatService.processChatParticipants(dispatch, message.chat, globalUsers, user!.id, getState)
        .then(() => {
            let nextMessageFetch: Date = new Date();
            dispatch(setLastMessagesFetch(nextMessageFetch));
            MessageProcessingService.processMessages(dispatch, getState, [message]);
        });

}


function handleHelloMessage(message: Message, dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) {
    const state = getState();
    const user = getState().messenger.user;

    const chats = {...state.messenger.chats};
    const globalUsers = {...getState().messenger.globalUsers};
    const currentMessages = getState().messenger.messages;

    const found = currentMessages.find(item => item.type === MessageType.hello);
    const updatedMessage = currentMessages.filter(item => item.type !== MessageType.hello)
    dispatch(setMessages(updatedMessage))

    const newChat: Chat = Builder<Chat>()
        .id(message.chat)
        .title(message.data!)
        .isUnreadMessagesExist(false)
        .lastSeenAt(new Date())
        .build()

    chats[newChat.id] = newChat;
    globalUsers[user!.id].titles[newChat.id] = state.messenger.user!.title || state.messenger.user!.id;

    dispatch(setChats(chats));
    dispatch(setGlobalUsers(globalUsers));
    dispatch(setCurrentChat(newChat.id));

    dispatch(setIsNewPrivateModalOpened(false));
    AdministratorApi.getAllAdministratorsByChatId(message.chat)
        .then(administrators => {
            dispatch(setAdministrators(administrators))
            if (message.sender == user!.id && found === undefined) {
                dispatch(setIsMembersModalOpened(true));
            }
        })

    if (message.sender === message.receiver || message.receiver === user?.id) {
        dispatch(setHasMore(false))
    }
    if (message.sender === message.receiver) {
        dispatch(setIsMembersModalOpened(true))
    }
}

function handleLeaveChatMessage(message: Message, dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) {
    const user = getState().messenger.user;
    if (message.sender === user!.id) {
        const chats = getState().messenger.chats;
        delete chats[message.chat]

        dispatch(setMessages([]))
        dispatch(setCurrentChat(null))
        dispatch(setChats(chats));
    } else {
        AdministratorApi.getAllAdministratorsByChatId(message.chat)
            .then(administrators => {
                dispatch(setAdministrators(administrators))
                const members = getState().messenger.users;

                let updatedMembers: StringIndexArray<User> = {}
                for (let id in members) {
                    const member = members[id]
                    if (member.id !== message.sender) {
                        updatedMembers[id] = member;
                    }
                }
                dispatch(setUsers(updatedMembers, message.chat))
            })

        const currentMessages = getState().messenger.messages;
        let updateMessages: Message[] = []
        const found = currentMessages.find(item => item.type === MessageType.iam && item.sender === message.sender)

        if (found !== undefined) {
            for (let i = 0; i < currentMessages.length; i++) {
                if (currentMessages[i].id !== found!.id) {
                    updateMessages.push(currentMessages[i])
                }
            }
            dispatch(setMessages(updateMessages))
        }

    }
}