import {Message} from "../model/message";
import {fromByteArray, toByteArray} from "base64-js";
import {store} from "../index";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import {MessageDto} from "../dto/messageDto";

export class CryptService {

    static encrypt(message: Message, publicKeyToEncrypt: Uint8Array) {
        const messenger = store.getState().messenger;
        const privateKey = messenger.user?.privateKey;
        if(!privateKey) {
            throw new Error("User not logged in");
        }
        if (!message.nonce) {
            message.nonce = new Uint8Array(24);
            message.nonce = crypto.getRandomValues(message.nonce);
        }
        const data = fromByteArray(nacl.box(CryptService.plainStringToUint8(message.data!),
            message.nonce!,
            publicKeyToEncrypt,
            privateKey!))

        return {
            nonce: fromByteArray(message.nonce!),
            data: data
        }
    }

    static decrypt(dto: MessageDto, publicKeyToVerify: Uint8Array) {
        const messenger = store.getState().messenger;
        const privateKey = messenger.user?.privateKey;
        if(!privateKey) {
            throw new Error("User not logged in");
        }
        const nacl1 = nacl.box.open(toByteArray(dto.data!),
            CryptService.stringToUint8(dto.nonce!),
            publicKeyToVerify,
            privateKey!)

        return CryptService.uint8ToPlainString(nacl1!);
    }

    static uint8ToPlainString(array: Uint8Array) {
        return naclUtil.encodeUTF8(array);
    }

    static plainStringToUint8(string: string) {
        return naclUtil.decodeUTF8(string);
    }
    static uint8ToString(array: Uint8Array) {
        return naclUtil.encodeBase64(array);
    }

    static stringToUint8(string: string) {
        return naclUtil.decodeBase64(string);
    }

    static JSONByteStringToUint8(userInput: string) {
        return Uint8Array.from(userInput.split(",")
            .map(str => parseInt(str))
        );
    }
}