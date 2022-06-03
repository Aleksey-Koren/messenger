import {
    SET_IS_CREATE_PRIVATE_MODAL_OPENED,
    TMessengerControlsAction,
    TMessengerControlsState
} from "./messengerControlsTypes";
import {IPlainDataAction} from "../redux-types";

const initialState: TMessengerControlsState = {
    isCreateNewPrivateModalOpened: false
}

export function messengerControlsReducer(state: TMessengerControlsState = initialState, action: TMessengerControlsAction) {
    let castedAction;

    switch (action.type) {

        case SET_IS_CREATE_PRIVATE_MODAL_OPENED:
            castedAction = action as IPlainDataAction<boolean>;
            return {...initialState, isCreateNewPrivateModalOpened: castedAction.payload};

        default: return state
    }
}