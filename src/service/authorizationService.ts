import {CryptService} from "./cryptService";

export class AuthorizationService {
    static areRSAKeysValid(publicKeyPem: string, privateKeyPem: string): boolean {
        const encrypted = CryptService.encryptRSA('test', publicKeyPem, privateKeyPem);
        const decrypted = CryptService.decryptRSA(
            encrypted.data,
            publicKeyPem,
            privateKeyPem,
            encrypted.nonce,
        );

        return 'test' === decrypted;
    }


}