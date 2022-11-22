export interface Chat {
    id: string;
    title: string;
    isUnreadMessagesExist: boolean;
    lastSeenAt: Date;
    keyAES: string;
}