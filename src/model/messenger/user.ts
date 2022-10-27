export interface User {
    id: string;
    publicKey?: Uint8Array;
    privateKey?: Uint8Array;
    publicKeyPem?: string;
    privateKeyPem?: string;
    title?: string;
}