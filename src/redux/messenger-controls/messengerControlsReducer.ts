import {
    GlobalUserConfigurationState,
    SET_IS_CONFIRM_MODAL_OPEN,
    SET_IS_CREATE_PRIVATE_MODAL_OPENED,
    SET_IS_CREATE_ROOM_MODAL_OPENED,
    SET_IS_EDIT_USER_TITLE_MODAL_OPEN,
    SET_IS_GLOBAL_USER_CONFIGURATION_MODAL_OPEN,
    SET_IS_LEAVE_CHAT_CONFIRM_MODAL_OPENED,
    TMessengerControlsAction,
    TMessengerControlsState
} from "./messengerControlsTypes";
import {IPlainDataAction} from "../redux-types";

const initialState: TMessengerControlsState = {
    globalUserConfigurationState: {isGlobalUserConfigurationModalOpen: false},
    isCreateNewPrivateModalOpened: false,
    isCreateNewRoomModalOpened: false,
    isEditUserTitleModalOpen: false,
    isConfirmModalOpen: false,
    isLeaveChatConfirmModalOpened: false
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

        case SET_IS_GLOBAL_USER_CONFIGURATION_MODAL_OPEN:
            castedAction = action as IPlainDataAction<GlobalUserConfigurationState>;
            return {...initialState, globalUserConfigurationState: castedAction.payload}

        case SET_IS_CONFIRM_MODAL_OPEN:
            castedAction = action as IPlainDataAction<boolean>;
            return {...state, isConfirmModalOpen: castedAction.payload}

        case SET_IS_LEAVE_CHAT_CONFIRM_MODAL_OPENED:
            castedAction = action as IPlainDataAction<boolean>;
            return {...state, isLeaveChatConfirmModalOpened: castedAction.payload}

        default:
            return state
    }
}