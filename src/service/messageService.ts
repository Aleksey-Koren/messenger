import {Message} from "../model/messenger/message";
import {store} from "../index";
import {CryptService} from "./cryptService";
import {CustomerApi} from "../api/customerApi";
import {setGlobalUsers} from "../redux/messenger/messengerActions";
import {GlobalUsers} from "../model/local-storage/localStorageTypes";

export class MessageService {

    static decryptMessageDataByIterateOverPublicKeys(message: Message, userId: string) {
        const globalUsers = {...store.getState().messenger.globalUsers};
        const userPublicKeys = globalUsers[userId].certificates;

        for (let publicKey in userPublicKeys) {
            try {
                const decryptedMessageData = decryptMessageData(message, publicKey);
                if (decryptedMessageData) {
                    message.data = decryptedMessageData;
                    message.decrypted = true;
                    return;
                }
            } catch (e) {
                message.decrypted = false;
                return;
            }
        }

        tryDecryptMessageByPublicKeyFromServer(message, userId, userPublicKeys, globalUsers);
    }
}

function decryptMessageData(message: Message, publicKeyToVerify: string, privateKeyToDecrypt?: Uint8Array) {
    privateKeyToDecrypt = privateKeyToDecrypt || store.getState().messenger.user?.privateKey;
    if (!privateKeyToDecrypt) {
        throw new Error("user not logged in")
    }

    return CryptService.decryptToString(
        CryptService.base64ToUint8(message.data!),
        CryptService.plainStringToUint8(publicKeyToVerify),
        message.nonce!,
        privateKeyToDecrypt
    ) || undefined;
}

function tryDecryptMessageByPublicKeyFromServer(message: Message, userId: string, userPublicKeys: string[], globalUsers: GlobalUsers) {
    CustomerApi.getCustomer(userId)
        .then(user => {
            const foundedPublicKey = CryptService.uint8ToPlainString(user.publicKey);
            const decryptedMessageData = decryptMessageData(message, foundedPublicKey);
            message.data = decryptedMessageData;
            message.decrypted = !!decryptedMessageData;

            if (userPublicKeys.indexOf(foundedPublicKey) == -1) {
                userPublicKeys = [foundedPublicKey, ...userPublicKeys]
                store.dispatch(setGlobalUsers(globalUsers));
            }
        })
        .catch(() => {      // User is a ghost / Server Error
            message.data = undefined;
            message.decrypted = false;
        })
}