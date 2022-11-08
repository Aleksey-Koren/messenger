import {store} from "../index";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import {Bytes} from "node-forge";

const forge = require("node-forge");

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

        if (data === null) {
            throw new Error('Encryption function has returned null. Something went wrong');
        }

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

    static BytesToBase64(data: Bytes) {
        return forge.util.encode64(data);
    }

    //===============================================RSA================================================================

    static encryptRSA(message: string | Uint8Array, publicKeyToEncrypt: string, privateKeyToSign?: string, nonce?: string) {
        console.log(message)
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
        const data = forge.util.encode64(publicKey.encrypt(message))

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

        return privateKey.decrypt(forge.util.decode64(message))
    }

    //===============================================AES================================================================

    static generateKeyAES(size: number) {
        return forge.random.getBytesSync(size);
    }


    static encryptAES(message: string | Uint8Array, key: string, nonce?: string) {
        const cipher = forge.cipher.createCipher('AES-CBC', key);
        const nonceValue = nonce || forge.random.getBytesSync(key.length);

        cipher.start({iv: nonceValue});
        cipher.update(forge.util.createBuffer(message));
        cipher.finish();

        const encodedNonce = forge.util.encode64(nonceValue)
        const data = forge.util.encode64(cipher.output.data);

        return {
            nonce: encodedNonce,
            data: data,
        }
    }

    static decryptAES(message: string | Uint8Array | ArrayBuffer, key: string, nonce: string) {
        const decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: forge.util.decode64(nonce)});
        decipher.update(forge.util.createBuffer(forge.util.decode64(message)));

        const result = decipher.finish();

        return result ? decipher.output.data : "not decrypted";
    }

}

// var buffer = util.createBuffer(data, 'utf8');
// var bytes = buffer.getBytes();
// // console.log('PRINT BYTES' + bytes);
//
// var rsa = pki.rsa;
// var keypair = rsa.generateKeyPair({bits: 2048});
//
// //-------------------------------------- SYMMETRIC DATA ENCRYPTION-----------------------
// // generate a random key and IV
// // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
// var key = forge.random.getBytesSync(16);
// var iv = forge.random.getBytesSync(16);
//
//
// // encrypt some bytes using CBC mode
// // (other modes include: ECB, CFB, OFB, CTR, and GCM)
// // Note: CBC and ECB modes use PKCS#7 padding as default
// var ciph = forge.cipher.createCipher('AES-CBC', key);
// ciph.start({iv: iv});
// ciph.update(forge.util.createBuffer(bytes));
// ciph.finish();
// var encrypted = ciph.output;
// // outputs encrypted hex
// console.log('AES encrypted  ' + util.encode64(encrypted.data));
//
//
// //---------------------------- ASYMMETRIC ENCRYPTION OF SYMMETRIC KEY ---------------------------------
// var enc = keypair.publicKey.encrypt(key);
// console.log("encrypted: " + enc);
//
// //---------------------------- SIGNING OF SYMMETRIC KEY WITH ASYMMETRIC PRIVATE KEY---------------------------------
// var forgeMd = md.sha1.create();
// forgeMd.update(key, 'utf8');
// var signature = keypair.privateKey.sign(forgeMd);
// console.log("signature: " + signature);
// // verify data with a public key
// // (defaults to RSASSA PKCS#1 v1.5)
//
// //--------------------------- VERIFYING AND DECRYPTION OF SYMMETRIC KEY WITH ASYMMETRIC PUBLIC KEY -----------------------
// var verified = keypair.publicKey.verify(forgeMd.digest().bytes(), signature);
// var decryptedKey = keypair.privateKey.decrypt(enc);
//
// console.log("verified: " + verified);
// console.log("decrypted: " + decryptedKey);
//
// //-------------------------- SYMMETRIC DATA DECRYPTION ----------------------------------------------------
//
// var decipher = forge.cipher.createDecipher('AES-CBC', decryptedKey);
// decipher.start({iv: iv});
// decipher.update(util.createBuffer(util.decode64(util.encode64(encrypted.data))));
// var result = decipher.finish(); // check 'result' for true/false
// console.log('decrypt result --- ' + result)
// // outputs decrypted hex
// console.log('OUTPUT!!!!' + decipher.output.toString());