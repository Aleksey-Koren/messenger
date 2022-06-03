import {Message} from "../model/message";
import {fromByteArray, toByteArray} from "base64-js";
import {store} from "../index";
import {CustomerApi} from "../api/customerApi";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import {MessageDto} from "../dto/messageDto";

export class CryptService {
    
    static encrypt(message: Message, dto: MessageDto, publicKeyToEncrypt: Uint8Array) {

        if(message.nonce === null) {
            message.nonce = new Uint8Array(24);
            message.nonce = crypto.getRandomValues(message.nonce);
        }

        const privateKey = store.getState().messenger.user?.privateKey;
        dto.data = fromByteArray(nacl.box(CryptService.stringToUint8(message.data!),
            message.nonce,
            publicKeyToEncrypt,
            privateKey!))

        dto.nonce = fromByteArray(message.nonce);

        console.log("DTO -- " + JSON.stringify(dto));
        return dto;
    }

    static decrypt(dto: MessageDto, message: Message , publicKeyToVerify: Uint8Array) {
        const privateKey = store.getState().messenger.user?.privateKey;
        message.nonce = toByteArray(dto.nonce!);

        message.data = CryptService.uint8ToString(nacl.box.open(toByteArray(dto.data!),
                                                                    message.nonce,
                                                                    publicKeyToVerify,
                                                                    privateKey!)!);
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

    static JSONByteStringToUint8(userInput: string) {
        return Uint8Array.from(userInput.split(",")
            .map(str => parseInt(str))
        );
    }
}