import {
    SET_IS_CREATE_PRIVATE_MODAL_OPENED,
    SET_IS_CREATE_ROOM_MODAL_OPENED, SET_IS_EDIT_USER_TITLE_MODAL_OPEN,
    TMessengerControlsAction,
    TMessengerControlsState
} from "./messengerControlsTypes";
import {IPlainDataAction} from "../redux-types";

const initialState: TMessengerControlsState = {
    isCreateNewPrivateModalOpened: false,
    isCreateNewRoomModalOpened: false,
    isEditUserTitleModalOpen: false
}

export function messengerControlsReducer(state: TMessengerControlsState = initialState, action: TMessengerControlsAction) {
    let castedAction;

    switch (action.type) {

        case SET_IS_CREATE_PRIVATE_MODAL_OPENED:
            castedAction = action as IPlainDataAction<boolean>;
            return {...initialState, isCreateNewPrivateModalOpened: castedAction.payload};

        case SET_IS_CREATE_ROOM_MODAL_OPENED:
            castedAction = action as IPlainDataAction<boolean>;
            return {...initialState, isCreateNewRoomModalOpened: castedAction.payload};

        case SET_IS_EDIT_USER_TITLE_MODAL_OPEN:
            castedAction = action as IPlainDataAction<boolean>;
            return {...initialState, isEditUserTitleModalOpen: castedAction.payload};

        default:
            return state
    }
}