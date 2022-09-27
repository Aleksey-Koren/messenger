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
import {AuthorizationService} from "../../service/authorizationService";
import {connectStompClient, setGlobalUsers, setUser} from "../messenger/messengerActions";
import {LocalStorageService} from "../../service/local-data/localStorageService";
import Notification from '../../Notification';
import {Builder} from "builder-pattern";
import {Customer} from "../../model/messenger/customer";
import nacl from "tweetnacl";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {CryptService} from "../../service/cryptService";
import {User} from "../../model/messenger/user";
import {v4} from "uuid";
import {getChatsByCustomerId} from "../chats/chatsActions";


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
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        CustomerApi.getCustomer(id)
            .then(user => {
                const publicKey = user.publicKey!;
                const privateKey = CryptService.JSONByteStringToUint8(privateKeyStr);
                if (AuthorizationService.areKeysValid(publicKey, privateKey)) {
                    user.privateKey = privateKey;
                    dispatch(setUser(user));
                    LocalStorageService.userToStorage(user);

                    dispatch(setIsLoginModalOpen(false));
                    dispatch(connectStompClient(user.id))
                    CustomerApi.getCustomersWhichMembersOfChatsOfCustomerId(id)
                        .then(users => {
                            const globalUsers = {...getState().messenger.globalUsers};
                            users.forEach((userItem) => {
                                globalUsers[userItem.id!] = {
                                    userId: userItem.id,
                                    certificates: [CryptService.uint8ToBase64(userItem.publicKey)],
                                    titles: {}
                                };
                            });
                            LocalStorageService.globalUsersToStorage(globalUsers);
                            dispatch(getChatsByCustomerId(user.id, 0, 0));
                            dispatch(setGlobalUsers(globalUsers))
                        })
                } else {
                    Notification.add({message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
                }
            }).catch((e) => {
            Notification.add({error: e, message: 'ID or PRIVATE KEY is incorrect', severity: 'error'});
        })
    }
}

export function registerTF(isGhost?: boolean) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        const keyPair = nacl.box.keyPair();

        const customer = Builder(Customer)
            .pk(keyPair.publicKey)
            .build();

        (isGhost ? new Promise<User>(resolve => {
                resolve({
                    id: v4(),
                    privateKey: keyPair.secretKey,
                    publicKey: keyPair.publicKey
                })
            }
        ) : CustomerApi.register(customer))
            .then((user: User) => {
                user.privateKey = keyPair.secretKey
                dispatch(setIsRegistrationModalOpen(true, !!isGhost));
                dispatch(setIsWelcomeModalOpen(false));
                dispatch(setUser(user));
                dispatch(connectStompClient(user.id))
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
