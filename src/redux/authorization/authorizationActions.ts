import {
    IRegistrationModalPayload,
    LOGOUT,
    SET_IS_LOGIN_MODAL_OPEN,
    SET_IS_REGISTRATION_MODAL_OPEN,
    SET_IS_WELCOME_MODAL_OPEN
} from "./authorizationTypes";
import {IPlainDataAction} from "../redux-types";
import {AppState} from "../../index";
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

export function authenticateRSA(id: string, privateKeyPem: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
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
            }).catch((e) => {
            Notification.add({error: e, message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
        })
    }
}

export function registerRSA(isGhost?: boolean) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        const forge = require("node-forge");

        const keypair = forge.pki.rsa.generateKeyPair({bits: 2048});
        const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey)
        const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey)

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
                console.log(user)
                user.privateKeyPem = privateKeyPem
                dispatch(setIsRegistrationModalOpen(true, !!isGhost));
                dispatch(setIsWelcomeModalOpen(false));
                dispatch(setUser(user));
                dispatch(connectStompClient(user.id!));
                LocalStorageService.userToStorage(user);
            }).catch((e) => {
                dispatch(setIsWelcomeModalOpen(true));
                Notification.add({message: 'Something went wrong. ', severity: 'error', error: e})
            })
    }
}


export function logout(): IPlainDataAction<boolean> {
    return {
        type: LOGOUT,
        payload: true
    }
}
