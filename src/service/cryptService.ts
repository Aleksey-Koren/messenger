import {store} from "../index";
import naclUtil from "tweetnacl-util";
import {Bytes} from "node-forge";

const forge = require("node-forge");

//@TODO ERROR please cover it with tests, positive and negative for each (used) method
export class CryptService {

    static base64ToUint8(string: string) {
        return naclUtil.decodeBase64(string);
    }

    static BytesToBase64(data: Bytes) {
        return forge.util.encode64(data);
    }

    //===============================================RSA================================================================

    static encryptRSA(message: string | Uint8Array, publicKeyToEncrypt: string, privateKeyToSign?: string, nonce?: string) {
        const bytes = forge.util.encodeUtf8(message);

        const messenger = store.getState().messenger;

        const privateKey = forge.pki.privateKeyFromPem(privateKeyToSign || messenger.user?.privateKeyPem);
        const publicKey = forge.pki.publicKeyFromPem(publicKeyToEncrypt)

        if (!privateKey) {
            throw new Error("User is not logged in");
        }

        // sign data with a private key and output DigestInfo DER-encoded bytes
        const md = forge.md.sha1.create();

        const plainText = (Math.random() + 1).toString(36).substring(2);
        md.update(plainText, 'utf8');

        const nonceValue = forge.util.encode64(privateKey.sign(md)) + ":" + forge.util.encode64(plainText);
        const data = forge.util.encode64(publicKey.encrypt(bytes))

        return {
            nonce: nonce || nonceValue,
            data: data,
        }
    }

    static decryptRSA(message: string, publicKeyToVerify: string, privateKeyToDecrypt: string, nonce: string) {
        const messenger = store.getState().messenger;
        const privateKey = forge.pki.privateKeyFromPem(privateKeyToDecrypt || messenger.user?.privateKeyPem);
        const publicKey = forge.pki.publicKeyFromPem(publicKeyToVerify)

        if (!privateKey) {
            throw new Error("User is not logged in");
        }

        if (nonce !== null) {
            const values = nonce.split(':');
            const sign = forge.util.decode64(values[0]);
            const digest = forge.util.decode64(values[1]);

            try {
                publicKey.verify(digest, sign);
            } catch (e) {
                console.error("error: ", e)
            }
        }

        return forge.util.decodeUtf8(privateKey.decrypt(forge.util.decode64(message)));
    }

    //===============================================AES================================================================


    static generateKeyAES(size: number): Bytes {
        return forge.random.getBytesSync(size);
    }

    static encryptAES(message: string | Uint8Array, key: string, nonce?: string) {
        console.log("ENCRYPT AES (NONCE): " + nonce)
        const bytes = typeof message === "string" ? forge.util.encodeUtf8(message) : message;

        const cipher = forge.cipher.createCipher('AES-CBC', key);
        const nonceValue = nonce || forge.random.getBytesSync(key.length);

        cipher.start({iv: nonceValue});
        cipher.update(forge.util.createBuffer(bytes));
        cipher.finish();

        const encodedNonce = forge.util.encode64(nonceValue)
        const encodedText = forge.util.encode64(cipher.output.data);

        return {
            nonce: encodedNonce,
            data: encodedText,
        };
    }

    static decryptAES(message: string | Uint8Array, key: string, nonce: string) {
        const isText = typeof message === "string"

        const decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: forge.util.decode64(nonce)});
        decipher.update(forge.util.createBuffer(isText ? forge.util.decode64(message) : message));

        const result = decipher.finish();
        const decodedText = isText ? forge.util.decodeUtf8(decipher.output.data) : decipher.output.data

        return result ? decodedText : "not decrypted";
    }

}