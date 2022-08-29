export interface IMessagesListState {
    hasMore: boolean;
    isAtTheBottom: boolean;
}

export enum MessagesListActionType {
    SET_HAS_MORE,
    SET_AT_THE_BOTTOM
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

export type MessagesListAction = ISetHasMoreAction | ISetAtTheBottom;