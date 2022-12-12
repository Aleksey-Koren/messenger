import {CryptService} from "./cryptService";
import forge from "node-forge";

export {}

test("Convert text to base64 should to be is not undefined and not null", () => {
    const bytes = 'test_bytes'
    const base64 = CryptService.textToBase64(bytes);

    expect(base64).not.toBeUndefined()
    expect(base64).not.toBeNull()
})

test("Convert base64 to text should to be convert successfully", () => {
    const sourceText = "test_text"
    const base64 = CryptService.textToBase64(sourceText)
    const text = CryptService.base64ToText(base64);

    expect(text).toBe(sourceText)
})

test("Encode utf8 should to be is not undefined and not null", () => {
    const sourceText = "test_text"
    const encodeUtf8 = CryptService.encodeUtf8(sourceText)

    expect(encodeUtf8).not.toBeUndefined()
    expect(encodeUtf8).not.toBeNull()
})

test("Decode utf8 should to be is not undefined and not null", () => {
    const sourceText = "test_text"
    const decodeUtf8 = CryptService.decodeUtf8(sourceText)

    expect(decodeUtf8).not.toBeUndefined()
    expect(decodeUtf8).not.toBeNull()
})

test("Convert base64 to uint8 should to be is not undefined and not null", () => {
    const sourceText = "test_text"
    const base64 = CryptService.textToBase64(sourceText);
    const uint8 = CryptService.base64ToUint8(base64);

    expect(uint8).not.toBeUndefined()
    expect(uint8).not.toBeNull()
})

test("Convert uint8 to base64 should to be is not undefined and not null", () => {
    const uint8 = new Uint8Array([1, 2, 3, 4])
    const base64 = CryptService.Uint8ToBase64(uint8);

    expect(base64).not.toBeUndefined()
    expect(base64).not.toBeNull()
})

test("Encrypt RSA should be encrypt successfully", () => {
    const keysBob = forge.pki.rsa.generateKeyPair(2048);
    const publicKeyBob = forge.pki.publicKeyToPem(keysBob.publicKey)

    const keysAlice = forge.pki.rsa.generateKeyPair(2048);
    const privateKeyAlice = forge.pki.privateKeyToPem(keysAlice.privateKey)

    const text = "Hello world!";
    const encrypt = CryptService.encryptRSA(text, publicKeyBob, privateKeyAlice);

    expect(encrypt.data).not.toBe(text)
})

test("Decrypt RSA should be decrypt successfully", () => {
    const keysBob = forge.pki.rsa.generateKeyPair(2048);
    const publicKeyBob = forge.pki.publicKeyToPem(keysBob.publicKey)
    const privateKeyBob = forge.pki.privateKeyToPem(keysBob.privateKey)

    const keysAlice = forge.pki.rsa.generateKeyPair(2048);
    const publicKeyAlice = forge.pki.publicKeyToPem(keysAlice.publicKey)
    const privateKeyAlice = forge.pki.privateKeyToPem(keysAlice.privateKey)

    const text = "Hello world!";
    const encrypt = CryptService.encryptRSA(text, publicKeyBob, privateKeyAlice);
    const decrypt = CryptService.decryptRSA(encrypt.data, publicKeyAlice, privateKeyBob, encrypt.nonce);

    expect(decrypt).toBe(text)
})

test("Generated key AES should to be is not undefined and not null", () => {
    const key = CryptService.generateKeyAES(16);

    expect(key).not.toBeUndefined()
    expect(key).not.toBeNull()
})

test("Generated key AES length should to be is 16", () => {
    const key = CryptService.generateKeyAES(16);

    expect(key.length).toBe(16)
})

test("Encrypt AES should be encrypt successfully", () => {
    const key = CryptService.generateKeyAES(16);
    const text = "Hello world!";
    const encryptText = CryptService.encryptAES(text, key)

    expect(encryptText.data).not.toBe(text)
})

test("Decrypt AES should be encrypt successfully", () => {
    const key = CryptService.generateKeyAES(16);
    const text = "Hello world!";
    const encryptText = CryptService.encryptAES(text, key)
    const decryptText = CryptService.decryptAES(encryptText.data, key, encryptText.nonce)

    expect(decryptText).toBe(text)
})