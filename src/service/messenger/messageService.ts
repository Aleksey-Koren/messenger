import {Message} from "../../model/messenger/message";
import {store} from "../../index";
import {CryptService} from "../cryptService";
import {CustomerApi} from "../../api/customerApi";
import {setGlobalUsers} from "../../redux/messenger/messengerActions";
import {MessageType} from "../../model/messenger/messageType";

export class MessageService {

    static async decryptMessageDataByIterateOverPublicKeys(message: Message, userId: string) {
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

        if (message.type === MessageType.HELLO) {
            await MessageService.tryDecryptUndecryptableMessages([message])
        }
    }

    static async tryDecryptUndecryptableMessages(messages: Message[]) {
        const messagesSenders: Map<string, string> = new Map();
        const globalUsers = {...store.getState().messenger.globalUsers}

        await Promise.all(messages.map(async message => {
            const senderId = message.sender;

            if (!messagesSenders.has(senderId)) {

                await CustomerApi.getCustomer(senderId)
                    .then(user => {
                        const foundedPublicKey = user.publicKeyPem!;
                        const decryptedMessageData = decryptMessageData(message, foundedPublicKey);

                        console.log('DECRYPT UNDECRYPTABLE MESSAGES. DECRYPTED DATA --- ' + decryptedMessageData)

                        message.data = decryptedMessageData;
                        message.decrypted = !!decryptedMessageData;

                        const globalUser = globalUsers[senderId];

                        if (!globalUser) {
                            globalUsers[senderId] = {
                                certificates: [foundedPublicKey],
                                titles: {},
                                userId: user.id
                            }
                        } else if (globalUser.certificates.indexOf(foundedPublicKey) === -1) {
                            globalUsers[senderId].certificates.unshift(foundedPublicKey);
                        }

                        messagesSenders.set(senderId, user.publicKeyPem!);
                    })
                    .catch((e) => {      // User is a ghost || Server Error
                        message.data = undefined;
                        message.decrypted = false;
                        console.error('Fail with decrypt undecryptable messages. Error: ' + e)
                    })

            } else {
                const foundedPublicKey = messagesSenders.get(senderId)!;
                const decryptedMessageData = decryptMessageData(message, foundedPublicKey);
                message.data = decryptedMessageData;
                message.decrypted = !!decryptedMessageData;
            }
        })).then(() => {
            store.dispatch(setGlobalUsers(globalUsers));
        })
    }

    static isMessageNotEmpty(text: string, attachments: FileList) {
        return (text !== '' || attachments.length > 0);
    }

    static reverseMessages(messages: Message[]) {
        return messages.reverse();
    }
}

function decryptMessageData(message: Message, publicKeyToVerify: string, privateKeyToDecrypt?: string) {
    privateKeyToDecrypt = privateKeyToDecrypt || store.getState().messenger.user?.privateKeyPem;
    const currentChat = store.getState().messenger.chats[store.getState().messenger.currentChat!];

    if (!privateKeyToDecrypt) {
        throw new Error("user is not logged in")
    }

    if (message.type === MessageType.WHISPER) {
        const data = CryptService.decryptAES(message.data!, currentChat.keyAES, message.nonce!);
        return CryptService.decodeUtf8(data);
    }
    return CryptService.decryptRSA(message.data!, publicKeyToVerify, privateKeyToDecrypt, message.nonce!);

}