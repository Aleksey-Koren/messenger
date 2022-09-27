export interface TChat {
    id: string;
    title: string;
    confirmed: boolean;
    isUnreadMessagesExist: boolean;
    lastSeenAt: Date;
}