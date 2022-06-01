import {Message} from "../model/message";
import {fromByteArray, toByteArray} from "base64-js";
import nacl from "tweetnacl";
import {store} from "../index";
import {CustomerApi} from "../api/customerApi";

export class CryptService {

    static encrypt(message: Message, publicKeyToEncrypt: Uint8Array) {

        if(message.nonce === null) {
            message.nonce = new Uint8Array(24);
            crypto.getRandomValues(message.nonce);
        } else {
            if(!(message.nonce instanceof Uint8Array)) {
                throw new Error('nonce in decrypted message have to be as Uint8Array. As string it must exist only in encrypted messages');
            }
        }

        message.data = fromByteArray(nacl.box(CryptService.stringToUint8(message.data!),
            message.nonce,
            publicKeyToEncrypt,
            store.getState().messenger.user!.privateKey!))

        message.nonce = fromByteArray(message.nonce);

        return message;
    }

    static decrypt(message: Message, publicKeyToVerify: Uint8Array) {
        message.data = CryptService.uint8ToString(nacl.box.open(toByteArray(message.data!),
                                                                    toByteArray(message.nonce! as string),
                                                                    publicKeyToVerify,
                                                                    store.getState().messenger.user!.privateKey!)!);

        message.nonce = toByteArray(message.nonce! as string);

        return message;
    }

    static async findPublicKey(message: Message) {
        const user = store.getState().messenger.users!.get(message.receiver!);

        if(!user) {
            try {
                return (await CustomerApi.getCustomer(message.receiver!)).pk! as Uint8Array;
            } catch (e) {
                throw new Error("Error due getting customer by id --- " + e);
            }
        }
        return user.publicKey!;
    }

    static uint8ToString(array: Uint8Array) {
        return new TextDecoder().decode(array);
    }

    static stringToUint8(string: string) {
        return new TextEncoder().encode(string);
    }
}