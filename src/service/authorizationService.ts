import nacl from "tweetnacl";
import {CryptService} from "./cryptService";

export class AuthorizationService {
    static areKeysValid(publicKey: Uint8Array, privateKey: Uint8Array): boolean {
        const test = CryptService.stringToUint8('test');
        const nonce = new Uint8Array(24);
        crypto.getRandomValues(nonce);
        const encrypted = nacl.box(test, nonce, publicKey, privateKey);
        const decrypted = nacl.box.open(encrypted, nonce, publicKey, privateKey);

        return 'test' === CryptService.uint8ToString(decrypted!);
    }


}