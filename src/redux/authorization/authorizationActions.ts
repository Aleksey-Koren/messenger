import {
    IRegistrationModalPayload,
    LOGOUT,
    SET_IS_FETCHING,
    SET_IS_LOGIN_MODAL_OPEN,
    SET_IS_REGISTRATION_MODAL_OPEN,
    SET_IS_WELCOME_MODAL_OPEN
} from "./authorizationTypes";
import {IPlainDataAction} from "../redux-types";
import {AppDispatch, AppState} from "../../index";
import {CustomerApi} from "../../api/customerApi";
import {connectStompClient, fetchMessengerStateTF, setUser} from "../messenger/messengerActions";
import {LocalStorageService} from "../../service/local-data/localStorageService";
import Notification from '../../Notification';
import {Builder} from "builder-pattern";
import {Customer} from "../../model/messenger/customer";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {User} from "../../model/messenger/user";
import {v4} from "uuid";
import {AuthorizationService} from "../../service/authorizationService";
import {saveAs} from 'file-saver';

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

export function setIsRegistrationModalOpen(isOpen: boolean, isGhost: boolean): IPlainDataAction<IRegistrationModalPayload> {
    return {
        type: SET_IS_REGISTRATION_MODAL_OPEN,
        payload: {
            isOpen,
            isGhost
        }
    }
}

export function setIsFetching(isFetching: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_FETCHING,
        payload: isFetching
    }
}

export function authenticateRSA(id: string, privateKeyPem: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        dispatch(setIsFetching(true))
        CustomerApi.getCustomer(id)
            .then(user => {
                const publicKeyPem = user.publicKeyPem!;

                if (AuthorizationService.areRSAKeysValid(publicKeyPem, privateKeyPem)) {
                    user.privateKeyPem = privateKeyPem;
                    dispatch(setUser(user));
                    dispatch(fetchMessengerStateTF(user.id!));
                    dispatch(setIsLoginModalOpen(false));
                    LocalStorageService.userToStorage(user);
                    dispatch(connectStompClient(user.id!));
                } else {
                    Notification.add({message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
                }
            })
            .catch((e) => {
                Notification.add({error: e, message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
            })
            .finally(() => dispatch(setIsFetching(false)))
    }
}

export function registerRSA(isGhost?: boolean) {
    return async (dispatch: ThunkDispatch<AppState, void, Action>) => {
        dispatch(setIsFetching(true))
        const forge = require("node-forge");

        let privateKeyPem = "";
        let publicKeyPem = "";
        await new Promise((resolve, reject) =>
            forge.pki.rsa.generateKeyPair(2048, (error: Error, keys: any) => {
                privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey)
                publicKeyPem = forge.pki.publicKeyToPem(keys.publicKey)
                if (error) reject(error);
                resolve(keys);
            }))

        const customer = Builder(Customer)
            .pk(publicKeyPem)
            .build();

        (isGhost ? new Promise<User>(resolve => {
                resolve({
                    id: v4(),
                    privateKeyPem: privateKeyPem,
                    publicKeyPem: publicKeyPem
                })
            }
        ) : CustomerApi.register(customer))
            .then((user: User) => {
                user.privateKeyPem = privateKeyPem
                dispatch(setIsRegistrationModalOpen(true, !!isGhost));
                dispatch(setIsWelcomeModalOpen(false));
                dispatch(setUser(user));
                dispatch(connectStompClient(user.id!));
                LocalStorageService.userToStorage(user);
            }).catch((e) => {
            dispatch(setIsWelcomeModalOpen(true));
            Notification.add({message: 'Something went wrong. ', severity: 'error', error: e})
        }).finally(() => dispatch(setIsFetching(false)))
    }
}

export function saveCredentials() {
    return async (dispatch: AppDispatch, getState: () => AppState) => {
        const user = getState().messenger.user;
        const text = user?.id + '\n\n' + user?.privateKeyPem + '\n\n' + user?.publicKeyPem;
        saveAs(new Blob([text], {type: 'text/plain'}), user?.id + '.txt');
    }
}

export function logout(): IPlainDataAction<boolean> {
    return {
        type: LOGOUT,
        payload: true
    }
}
