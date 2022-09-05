import {IMessagesListState, MessagesListAction, MessagesListActionType,} from "./messagesListTypes";

const initialState: IMessagesListState = {
    isOnscrollMuted: false,
    isAtTheBottom: true,
    lastRead: null,
    hasMore: true
}

export function messagesListReducer(state: IMessagesListState = initialState, action: MessagesListAction): IMessagesListState {

    switch (action.type) {
        case MessagesListActionType.SET_ONSCROLL_MUTED:
            return {...state, isOnscrollMuted: action.payload.isOnscrollMuted}

        case MessagesListActionType.SET_AT_THE_BOTTOM:
            return {...state, isAtTheBottom: action.payload.isAtTheBottom}

        case MessagesListActionType.SET_LAST_READ:
            return {...state, lastRead: action.payload.lastRead}

        case MessagesListActionType.HAS_MORE:
            return {...state, hasMore: action.payload.hasMore}

        default: return state
    }
}