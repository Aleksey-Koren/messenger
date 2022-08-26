export interface IMessagesListState {
    hasMore: boolean;
}

export enum MessagesListActionType {
    SET_HAS_MORE
}

export interface ISetHasMoreAction {
    type: typeof MessagesListActionType.SET_HAS_MORE;
    payload: {
        hasMore: boolean
    }
}

export type MessagesListAction = ISetHasMoreAction;