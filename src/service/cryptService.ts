import {Message} from "../model/message";
import {fromByteArray, toByteArray} from "base64-js";
import {store} from "../index";
import {CustomerApi} from "../api/customerApi";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

export class CryptService {


    static encrypt(message: Message, publicKeyToEncrypt: Uint8Array) {

        if(message.nonce === null) {
            message.nonce = new Uint8Array(24);
            message.nonce = crypto.getRandomValues(message.nonce);
        } else {
            if(!(message.nonce instanceof Uint8Array)) {
                throw new Error('nonce in decrypted message have to be as Uint8Array. As string it must exist only in encrypted messages');
            }
        }
        const user = store.getState().messenger.user;
        message.data = fromByteArray(nacl.box(CryptService.stringToUint8(message.data!),
            message.nonce as Uint8Array,
            publicKeyToEncrypt,
            user?.privateKey!))
        message.nonce = fromByteArray(message.nonce);

        return message;
    }

    static decrypt(message: Message, publicKeyToVerify: Uint8Array) {
        const user = store.getState().messenger.user;
        message.data = CryptService.uint8ToString(nacl.box.open(toByteArray(message.data!),
                                                                    toByteArray(message.nonce! as string),
                                                                    publicKeyToVerify,
                                                                    user?.privateKey!)!);

        message.nonce = toByteArray(message.nonce! as string);
        return message;
    }

    static async findPublicKey(userId: string) {
        const user = store.getState().messenger.users?.get(userId);

        if(!user) {
            try {
                return (await CustomerApi.getCustomer(userId)).pk! as Uint8Array;
            } catch (e) {
                throw new Error("Error due getting customer by id --- " + e);
            }
        }
        return user.publicKey!;
    }

    static uint8ToString(array: Uint8Array) {
        return naclUtil.encodeUTF8(array);
    }

    static stringToUint8(string: string) {
        return naclUtil.decodeUTF8(string);
    }
}