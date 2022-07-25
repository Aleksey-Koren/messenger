import {store} from "../index";
import nacl from "tweetnacl";
import {pki, md, util, mgf, pss, cipher} from "node-forge";
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

var rsa = pki.rsa;

var data = "let pss = forge.pss.create({\n" +
    "      md: forge.md.sha512.create(),\n" +
    "      mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),\n" +
    "      saltLength: 20\n" +
    "    });\n" +
    "    let md = forge.md.sha512.create();\n" +
    "    md.update(exampleString, \"utf8\");\n" +
    "    let signature = forge.util.encode64(keypair[\"privateKey\"].sign(md, pss));\n" +
    "\n" +
    "    // VERIFY the String\n" +
    "    pss = forge.pss.create({\n" +
    "      md: forge.md.sha512.create(),\n" +
    "      mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),\n" +
    "      saltLength: 20\n" +
    "    });\n" +
    "    md = forge.md.sha512.create();\n" +
    "    md.update(exampleString, \"utf8\");\n" +
    "    let verified = keypair[\"publicKey\"].verify(\n" +
    "      md.digest().getBytes(),\n" +
    "      forge.util.decode64(signature),\n" +
    "      pss\n" +
    "    );\n" +
    "\n" +
    "    logger.info(\"is signature ok?: %s\", verified);\n" +
    "  } catch (error) {\n" +
    "    logger.error(error.message);";


var buffer = util.createBuffer(data, 'utf8');
var bytes = buffer.getBytes();
console.log(bytes);
var keypair = rsa.generateKeyPair({bits: 2048});

console.log(keypair);
//cipher.createCipher("AES-ECB", keypair.privateKey.);

var enc = keypair.publicKey.encrypt(bytes);
console.log("encoded: " + util.encode64(enc));

var forgeMd = md.sha1.create();
forgeMd.update(data, 'utf8');
var signature = keypair.privateKey.sign(forgeMd);
console.log("signature: " + util.encode64(signature));
// verify data with a public key
// (defaults to RSASSA PKCS#1 v1.5)
var verified = keypair.publicKey.verify(forgeMd.digest().bytes(), signature);

console.log("verified: " + verified);
console.log("decrypted: " + keypair.privateKey.decrypt(enc))