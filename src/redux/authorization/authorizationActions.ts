import {SET_IS_LOGIN_MODAL_OPEN, SET_IS_REGISTRATION_MODAL_OPEN, SET_IS_WELCOME_MODAL_OPEN} from "./authorizationTypes";
import {IPlainDataAction} from "../redux-types";
import {AppDispatch, AppState} from "../../index";
import {CustomerService} from "../../service/customerService";
import {areKeysValid, retrieveUnit8Array} from "./authorizationActionsUtil";
import {setUser} from "../messenger/messengerActions";
import {LocalStorageService} from "../../service/localStorageService";
import {setErrorPopupState} from "../error-popup/errorPopupActions";
import {User} from "../../model/user";


export function setIsWelcomeModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_WELCOME_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsLoginModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_LOGIN_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsRegistrationModalOpen(isOpen: boolean): IPlainDataAction<boolean>{

    return {
        type: SET_IS_REGISTRATION_MODAL_OPEN,
        payload: isOpen
    }
}

export function authenticateTF(id: string, privateKeyStr: string) {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        CustomerService.getCustomer(id)
            .then(response => {
                const customer = response.data;
                const publicKey = retrieveUnit8Array(customer.pk!);
                const privateKey = retrieveUnit8Array(privateKeyStr);
                if(areKeysValid(publicKey, privateKey)) {
                    const user = new User();
                    user.id = customer.id;
                    user.publicKey = publicKey;
                    user.privateKey = privateKey;
                    //todo we have to fetch and set to state full context but not only user. E.g. chats[], activeChat, users
                    dispatch(setUser(user));


                    dispatch(setIsLoginModalOpen(false))

                    LocalStorageService.userToStorage(user);
                }else{
                    dispatch(setErrorPopupState(true, 'ID or PRIVATE KEY is incorrect'))
                }
            }).catch(reason => {
                dispatch(setErrorPopupState(true, 'ID or PRIVATE KEY is incorrect'))
        })
    }
}

