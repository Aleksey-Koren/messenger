export interface IMessagesListState {
    isOnscrollMuted: boolean;
    isAtTheBottom: boolean;
    lastRead: string | null;
    hasMore: boolean;
}

export enum MessagesListActionType {
    SET_ONSCROLL_MUTED = 'SET_ONSCROLL_MUTED',
    SET_AT_THE_BOTTOM = 'SET_AT_THE_BOTTOM',
    SET_LAST_READ = 'SET_LAST_READ',
    HAS_MORE = 'HAS_MORE'
}

export interface ISetOnscrollMuted {
    type: MessagesListActionType.SET_ONSCROLL_MUTED;
    payload: {
        isOnscrollMuted: boolean
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
        lastRead: string;
    }
}

export interface ISetHasMore {
    type: MessagesListActionType.HAS_MORE;
    payload: {
        hasMore: boolean;
    }
}

export type MessagesListAction = ISetOnscrollMuted | ISetAtTheBottom | ISetLastRead | ISetHasMore;