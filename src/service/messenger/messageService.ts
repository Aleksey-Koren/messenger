import {Message} from "../../model/messenger/message";
import {store} from "../../index";
import {CryptService} from "../cryptService";
import {CustomerApi} from "../../api/customerApi";
import {setGlobalUsers} from "../../redux/messenger/messengerActions";
import {MessageType} from "../../model/messenger/messageType";

export class MessageService {

    static decryptMessageDataByIterateOverPublicKeys(message: Message, userId: string) {
        const userPublicKeys = store.getState().messenger.globalUsers[userId]?.certificates;

        if (userPublicKeys) {
            for (const publicKey of userPublicKeys) {
                try {
                    const decryptedMessageData = decryptMessageData(message, publicKey);
                    if (decryptedMessageData) {
                        message.data = decryptedMessageData;
                        message.decrypted = true;
                        return;
                    }
                } catch (e) {
                    console.error(e);
                    message.decrypted = false;
                    return;
                }
            }
        }

        if (message.type === MessageType.hello) {
            MessageService.tryDecryptUndecryptableMessages([message])
        }
    }

    static tryDecryptUndecryptableMessages(messages: Message[]) {
        const messagesSendersIds: Set<string> = new Set();
        const globalUsers = {...store.getState().messenger.globalUsers}

        messages.forEach(message => {
            const senderId = message.sender;

            if (!messagesSendersIds.has(senderId)) {

                CustomerApi.getCustomer(senderId)
                    .then(user => {
                        const foundedPublicKey = CryptService.uint8ToBase64(user.publicKey);
                        const decryptedMessageData = decryptMessageData(message, foundedPublicKey);
                        message.data = decryptedMessageData;
                        message.decrypted = !!decryptedMessageData;

                        if (globalUsers[senderId].certificates.indexOf(foundedPublicKey) === -1) {
                            globalUsers[senderId].certificates.unshift(foundedPublicKey);
                        }
                    })
                    .catch(() => {      // User is a ghost / Server Error
                        message.data = undefined;
                        message.decrypted = false;
                    })
                messagesSendersIds.add(senderId);
            }
        })
        store.dispatch(setGlobalUsers(globalUsers));
    }
}

function decryptMessageData(message: Message, publicKeyToVerify: string, privateKeyToDecrypt?: Uint8Array) {
    privateKeyToDecrypt = privateKeyToDecrypt || store.getState().messenger.user?.privateKey;
    if (!privateKeyToDecrypt) {
        throw new Error("user is not logged in")
    }

    return CryptService.decryptToString(
        CryptService.base64ToUint8(message.data!),
        CryptService.base64ToUint8(publicKeyToVerify),
        message.nonce!,
        privateKeyToDecrypt
    ) || undefined;
}