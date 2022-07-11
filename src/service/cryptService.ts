import {store} from "../index";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import {fromByteArray, toByteArray} from "base64-js";

export class CryptService {

    static encrypt(input: Uint8Array, publicKeyToEncrypt: Uint8Array, nonce?: Uint8Array, privateKeyToSign?: Uint8Array) {
        const messenger = store.getState().messenger;
        const privateKey = privateKeyToSign || messenger.user?.privateKey;
        nonce = nonce || crypto.getRandomValues(new Uint8Array(24));
        if (!privateKey) {
            throw new Error("User is not logged in");
        }

        const data = nacl.box(
            input,
            nonce,
            publicKeyToEncrypt,
            privateKey!
        );

        return {
            nonce: nonce,
            data: data
        }
    }

    static decrypt(input: Uint8Array, publicKeyToVerify: Uint8Array, nonce: Uint8Array, privateKeyToDecrypt: Uint8Array) {
        return nacl.box.open(
            input,
            nonce,
            publicKeyToVerify,
            privateKeyToDecrypt!)
    }

    static decryptToBase64(input: Uint8Array, publicKeyToVerify: Uint8Array, nonce: Uint8Array, privateKeyToDecrypt: Uint8Array) {
        const decrypt = CryptService.decrypt(input, publicKeyToVerify, nonce, privateKeyToDecrypt);
        if (!decrypt) {
            return null;
        }
        return CryptService.uint8ToBase64(decrypt);
    }

    static decryptToString(input: Uint8Array, publicKeyToVerify: Uint8Array, nonce: Uint8Array, privateKeyToDecrypt: Uint8Array) {
        const decrypt = CryptService.decrypt(input, publicKeyToVerify, nonce, privateKeyToDecrypt);
        if (!decrypt) {
            return null;
        }
        return CryptService.uint8ToPlainString(decrypt);
    }

    static uint8ToBase64(array: Uint8Array) {
        return naclUtil.encodeBase64(array);
    }

    static base64ToUint8(string: string) {
        return naclUtil.decodeBase64(string);
    }

    static plainStringToUint8(string: string) {
        return naclUtil.decodeUTF8(string);
    }

    static uint8ToPlainString(data: Uint8Array) {
        return naclUtil.encodeUTF8(data);
    }

    static JSONByteStringToUint8(userInput: string) {
        return Uint8Array.from(userInput.split(",")
            .map(str => parseInt(str))
        );
    }
}