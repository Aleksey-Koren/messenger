import {CryptService} from "./cryptService";

export class AuthorizationService {
    static areKeysValid(publicKey: Uint8Array, privateKey: Uint8Array): boolean {
        const nonce = new Uint8Array(24);
        crypto.getRandomValues(nonce);
        const test = CryptService.encrypt(CryptService.plainStringToUint8('test'), publicKey, nonce, privateKey);
        const decrypted = CryptService.decrypt(
            test.data,
            publicKey,
            nonce,
            privateKey
        );
        return 'test' === CryptService.uint8ToPlainString(decrypted!);
    }

}