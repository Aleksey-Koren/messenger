export interface User {
    id: string;
    publicKeyPem?: string;
    privateKeyPem?: string;
    title?: string;
    webhookUrl?: string;
}