import nacl from "tweetnacl";

export class AuthorizationService {
    static areKeysValid(publicKey: Uint8Array, privateKey: Uint8Array): boolean {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const test = encoder.encode('test');
        const nonce = new Uint8Array(24);
        crypto.getRandomValues(nonce);
        const encrypted = nacl.box(test, nonce, publicKey, privateKey);
        const decrypted = nacl.box.open(encrypted, nonce, publicKey, privateKey);

        return 'test' === decoder.decode(decrypted!)
    }

    static JSONByteStringToUint8(userInput: string) {
        return Uint8Array.from(userInput.split(",")
            .map(str => parseInt(str))
        );
    }
}