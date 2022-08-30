import {Message} from "../../model/messenger/message";

export interface IMessagesListState {
    hasMore: boolean;
    isAtTheBottom: boolean;
    lastRead: Message | null;
}

export enum MessagesListActionType {
    SET_HAS_MORE,
    SET_AT_THE_BOTTOM,
    SET_LAST_READ
}

export interface ISetHasMoreAction {
    type: MessagesListActionType.SET_HAS_MORE;
    payload: {
        hasMore: boolean
    }
}

export interface ISetAtTheBottom {
    type: MessagesListActionType.SET_AT_THE_BOTTOM;
    payload: {
        isAtTheBottom: boolean;
    }
}

export interface ISetLastRead {
    type: MessagesListActionType.SET_LAST_READ;
    payload: {
        lastRead: Message;
    }
}

export type MessagesListAction = ISetHasMoreAction | ISetAtTheBottom | ISetLastRead;