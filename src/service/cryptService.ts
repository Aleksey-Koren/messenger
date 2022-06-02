import {Message} from "../model/message";
import {fromByteArray, toByteArray} from "base64-js";
import nacl from "tweetnacl";
import {store} from "../index";
import {CustomerApi} from "../api/customerApi";

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
        console.log("USER    " + JSON.stringify(user))
        console.log("PUBLIC KEY    " + JSON.stringify(publicKeyToEncrypt))
        console.log("MESSAGE    " + JSON.stringify(message))
        message.data = fromByteArray(nacl.box(CryptService.stringToUint8(message.data!) as Uint8Array,
            message.nonce as Uint8Array,
            publicKeyToEncrypt as Uint8Array,
            user?.privateKey!) as Uint8Array)
        console.log("NONCE  ----   " + message.nonce)
        message.nonce = fromByteArray(message.nonce);

        return message;
    }

    static decrypt(message: Message, publicKeyToVerify: Uint8Array) {
        const user = store.getState().messenger.user;
        console.log("USER    " + JSON.stringify(user))
        console.log("PUBLIC KEY    " + JSON.stringify(publicKeyToVerify))
        console.log("MESSAGE    " + JSON.stringify(message))
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
        console.log("Arr" + array);
        console.log("Buff" + array.buffer);
        return new TextDecoder().decode(array);
    }

    static stringToUint8(string: string) {
        return new TextEncoder().encode(string) as Uint8Array;
    }
}