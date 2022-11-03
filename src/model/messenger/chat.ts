export interface Chat {
    id: string;
    title: string;
    confirmed: boolean;
    isUnreadMessagesExist: boolean;
    lastSeenAt: Date;
    keyAES: string;
}