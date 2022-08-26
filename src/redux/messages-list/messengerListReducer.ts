import {IMessagesListState, MessagesListAction, MessagesListActionType,} from "./messagesListTypes";

const initialState: IMessagesListState = {
    hasMore: true,
}

export function messagesListReducer(state: IMessagesListState = initialState, action: MessagesListAction): IMessagesListState {

    switch (action.type) {
        case MessagesListActionType.SET_HAS_MORE:
            return {...state, hasMore: action.payload.hasMore}

        default: return state
    }
}