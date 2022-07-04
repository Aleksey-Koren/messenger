import {
    LOGOUT,
    SET_IS_LOGIN_MODAL_OPEN,
    SET_IS_REGISTRATION_MODAL_OPEN,
    SET_IS_WELCOME_MODAL_OPEN
} from "./authorizationTypes";
import {IPlainDataAction} from "../redux-types";
import {AppDispatch, AppState} from "../../index";
import {CustomerApi} from "../../api/customerApi";
import {AuthorizationService} from "../../service/authorizationService";
import {fetchMessengerStateTF, setUser} from "../messenger/messengerActions";
import {LocalStorageService} from "../../service/localStorageService";
import Notification from '../../Notification';
import {Builder} from "builder-pattern";
import {Customer} from "../../model/customer";
import nacl from "tweetnacl";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {CryptService} from "../../service/cryptService";
import {Buffer} from 'buffer';


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

export function setIsRegistrationModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_REGISTRATION_MODAL_OPEN,
        payload: isOpen
    }
}

export function authenticateTF(id: string, privateKeyStr: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        CustomerApi.getCustomer(id)
            .then(user => {
                const publicKey = user.publicKey!;
                const privateKey = CryptService.JSONByteStringToUint8(privateKeyStr);
                if (AuthorizationService.areKeysValid(publicKey, privateKey)) {
                    user.privateKey = privateKey;
                    dispatch(setUser(user));
                    dispatch(fetchMessengerStateTF(user.id!));
                    dispatch(setIsLoginModalOpen(false));
                    LocalStorageService.userToStorage(user);
                } else {
                    Notification.add({message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
                }
            }).catch((e) => {
                Notification.add({error: e, message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
            })
    }
}

export function registerTF() {
    return (dispatch: AppDispatch) => {
        const keyPair = nacl.box.keyPair();

        const customer = Builder(Customer)
            .pk(keyPair.publicKey)
            .build();

        CustomerApi.register(customer).then(user => {
            user.privateKey = keyPair.secretKey
            dispatch(setIsRegistrationModalOpen(true));
            dispatch(setIsWelcomeModalOpen(false));
            dispatch(setUser(user));
            LocalStorageService.userToStorage(user);
        }).catch((e) => {
            dispatch(setIsWelcomeModalOpen(true));
            Notification.add({message: 'Something went wrong.', severity: 'error', error: e})
        })
    }
}


export function logout(): IPlainDataAction<boolean> {
    return {
        type: LOGOUT,
        payload: true
    }
}

/*
const keyPair = nacl.box.keyPair();
var uuid = "45322f4d-dc28-4af3-9f09-b98678e16727";
var nonce = crypto.getRandomValues(new Uint8Array(24));
var out = nacl.box(CryptService.plainStringToUint8(uuid), nonce, keyPair.publicKey, keyPair.secretKey);
var data = [];
data.push(CryptService.uint8ToBase64(out));
data.push(CryptService.uint8ToBase64(nonce));
data.push(CryptService.uint8ToBase64(keyPair.publicKey));
data.push(CryptService.uint8ToBase64(keyPair.secretKey));
var decrypt = CryptService.uint8ToBase64(nacl.box.open(
    CryptService.base64ToUint8(data[0]),
    CryptService.base64ToUint8(data[1]),
    CryptService.base64ToUint8(data[2]),
    CryptService.base64ToUint8(data[3])
)!);
console.log(data, Buffer.from(decrypt, 'base64').toString('utf-8'));
*/
