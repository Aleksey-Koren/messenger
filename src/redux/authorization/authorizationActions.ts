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
import {connectStompClient, setUser} from "../messenger/messengerActions";
import {LocalStorageService} from "../../service/local-data/localStorageService";
import Notification from '../../Notification';
import {Builder} from "builder-pattern";
import {Customer} from "../../model/messenger/customer";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {User} from "../../model/messenger/user";
import {v4} from "uuid";


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

export function authenticateTF(id: string, privateKeyStr: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        // CustomerApi.getCustomer(id)
        //     .then(user => {
        //         const publicKey = user.publicKey!;
        //         const privateKey = CryptService.JSONByteStringToUint8(privateKeyStr);
        //         if (AuthorizationService.areKeysValid(publicKey, privateKey)) {
        //             user.privateKey = privateKey;
        //             dispatch(setUser(user));
        //             dispatch(fetchMessengerStateTF(user.id!));
        //             dispatch(setIsLoginModalOpen(false));
        //             LocalStorageService.userToStorage(user);
        //             dispatch(connectStompClient(user.id!));
        //         } else {
        //             Notification.add({message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
        //         }
        //     }).catch((e) => {
        //     Notification.add({error: e, message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
        // })
    }
}

// ПАРА КЛЮЧЕЙ
export function registerTF(isGhost?: boolean) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        // const keyPair = nacl.box.keyPair();
        //
        // const customer = Builder(Customer)
        //     .pk(keyPair.publicKey)
        //     .build();
        //
        // (isGhost ? new Promise<User>(resolve => {
        //         resolve({
        //             id: v4(),
        //             privateKey: keyPair.secretKey,
        //             publicKey: keyPair.publicKey
        //         })
        //     }
        // ) : CustomerApi.register(customer))
        //     .then((user: User) => {
        //         user.privateKey = keyPair.secretKey
        //         dispatch(setIsRegistrationModalOpen(true, !!isGhost));
        //         dispatch(setIsWelcomeModalOpen(false));
        //         dispatch(setUser(user));
        //         dispatch(connectStompClient(user.id!));
        //         LocalStorageService.userToStorage(user);
        //     }).catch((e) => {
        //     dispatch(setIsWelcomeModalOpen(true));
        //     Notification.add({message: 'Something went wrong.', severity: 'error', error: e})
        // })
    }
}


export function registerRSA(isGhost?: boolean) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        const forge = require("node-forge");
        const rsa = forge.pki.rsa;


        const keypair = rsa.generateKeyPair({bits: 2048});
        const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey)
        const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey)

        console.log(privateKeyPem)
        console.log(publicKeyPem)

        const customer = Builder(Customer)
            .pk(publicKeyPem)
            .build();

        (isGhost ? new Promise<User>(resolve => {
                resolve({
                    id: v4(),
                    privateKey: privateKeyPem,
                    publicKey: publicKeyPem
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
