import {IMessagesListState, MessagesListAction, MessagesListActionType,} from "./messagesListTypes";

const initialState: IMessagesListState = {
    hasMore: true,
    isAtTheBottom: true,
    lastRead: null
}

export function messagesListReducer(state: IMessagesListState = initialState, action: MessagesListAction): IMessagesListState {

    switch (action.type) {
        case MessagesListActionType.SET_HAS_MORE:
            return {...state, hasMore: action.payload.hasMore}

        case MessagesListActionType.SET_AT_THE_BOTTOM:
            return {...state, isAtTheBottom: action.payload.isAtTheBottom}

        case MessagesListActionType.SET_LAST_READ:
            return {...state, lastRead: action.payload.lastRead}

        default: return state
    }
}