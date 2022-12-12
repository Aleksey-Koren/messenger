import naclUtil from "tweetnacl-util";
import {Bytes} from "node-forge";

const forge = require("node-forge");

//@TODO ERROR please cover it with tests, positive and negative for each (used) method
export class CryptService {

    static textToBase64(data: string) {
        return forge.util.encode64(data);
    }

    static base64ToText(data: string) {
        return forge.util.decode64(data);
    }

    static encodeUtf8(data: string) {
        return forge.util.encodeUtf8(data);
    }

    static decodeUtf8(data: string) {
        return forge.util.decodeUtf8(data);
    }

    static base64ToUint8(data: string) {
        return naclUtil.decodeBase64(data);
    }

    static Uint8ToBase64(data: Uint8Array) {
        return naclUtil.encodeBase64(data);
    }
    //===============================================RSA================================================================

    static encryptRSA(message: string | Uint8Array, publicKeyToEncrypt: string, privateKeyToSign: string, nonce?: string) {
        const bytes = forge.util.encodeUtf8(message);

        const privateKey = forge.pki.privateKeyFromPem(privateKeyToSign);
        const publicKey = forge.pki.publicKeyFromPem(publicKeyToEncrypt)

        // sign data with a private key and output DigestInfo DER-encoded bytes
        const md = forge.md.sha1.create();

        const plainText = (Math.random() + 1).toString(36).substring(2);
        md.update(plainText, 'utf8');

        const generatedNonce = forge.util.encode64(privateKey.sign(md)) + ":" + forge.util.encode64(plainText);
        const encryptData = forge.util.encode64(publicKey.encrypt(bytes))

        return {
            nonce: nonce || generatedNonce,
            data: encryptData,
        }
    }

    static decryptRSA(message: string, publicKeyToVerify: string, privateKeyToDecrypt: string, nonce: string) {
        const privateKey = forge.pki.privateKeyFromPem(privateKeyToDecrypt);
        const publicKey = forge.pki.publicKeyFromPem(publicKeyToVerify)

        if (nonce !== null) {
            const values = nonce.split(':');
            const sign = forge.util.decode64(values[0]);
            const digest = forge.util.decode64(values[1]);

            try {
                publicKey.verify(digest, sign);
            } catch (e) {
                return "not decrypted"
            }
        }

        return forge.util.decodeUtf8(privateKey.decrypt(forge.util.decode64(message)));
    }

    //===============================================AES================================================================

    static generateKeyAES(size: number): Bytes {
        return forge.random.getBytesSync(size);
    }

    static encryptAES(message: string | Uint8Array, key: string, nonce?: string) {
        const cipher = forge.cipher.createCipher('AES-CBC', key);
        const generatedNonce = nonce || forge.random.getBytesSync(key.length);

        cipher.start({iv: generatedNonce});
        cipher.update(forge.util.createBuffer(message));
        cipher.finish();

        const encodedNonce = forge.util.encode64(generatedNonce)
        const encodedData = forge.util.encode64(cipher.output.data);

        return {
            nonce: encodedNonce,
            data: encodedData,
        };
    }

    static decryptAES(message: string | Uint8Array, key: string, nonce: string) {
        const decodedData = forge.util.decode64(message)
        const decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: forge.util.decode64(nonce)});
        decipher.update(forge.util.createBuffer(decodedData));

        const result = decipher.finish();

        return result ? decipher.output.data : "not decrypted";
    }

}